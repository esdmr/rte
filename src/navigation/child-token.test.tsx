import type {FunctionComponent} from 'preact';
import {useContext, useState} from 'preact/hooks';
import {cleanup, fireEvent, render} from '@testing-library/preact';
import {afterEach, assert, describe, expect, it, vi} from 'vitest';
import {
	navChildToken,
	NavChildToken,
	useChildToken,
	wrapNavChildren,
} from './child-token.js';
import {NavNode} from './node.js';

afterEach(() => {
	cleanup();
});

describe('NavChildToken', () => {
	describe('parent', () => {
		it('is the same object as the constructor', () => {
			const parent = new NavNode(undefined, {});

			expect(new NavChildToken(parent, 0).parent).toBe(parent);
		});
	});

	describe('clear', () => {
		it('disposes the child', () => {
			const parent = new NavNode(undefined, {});

			const child = new NavNode(parent, {});
			parent.children[0] = child;
			const spiedChildDispose = vi.spyOn(child, 'dispose');

			new NavChildToken(parent, 0).clear();
			expect(spiedChildDispose).toHaveBeenCalled();
		});

		it('clears the child slot of parent', () => {
			const parent = new NavNode(undefined, {});

			const child = new NavNode(parent, {});
			parent.children[0] = child;

			new NavChildToken(parent, 0).clear();

			expect(parent.children[0]).toBeUndefined();
		});
	});

	describe('get child', () => {
		it('returns the child from the parent', () => {
			const parent = new NavNode(undefined, {});
			const token = new NavChildToken(parent, 0);
			const child = new NavNode(parent, {});

			expect(token.child).toBeUndefined();

			parent.children[0] = child;
			expect(token.child).toBe(child);
		});
	});

	describe('set child', () => {
		it('takes undefined', () => {
			const parent = new NavNode(undefined, {});
			const token = new NavChildToken(parent, 0);

			const child = new NavNode(parent, {});
			parent.children[0] = child;

			token.child = undefined;

			// It should not throw if repeated:
			token.child = undefined;

			expect(parent.children[0]).toBeUndefined();
		});

		it('ignores if the call is of no effect', () => {
			const parent = new NavNode(undefined, {});
			const token = new NavChildToken(parent, 0);

			const child = new NavNode(parent, {});
			parent.children[0] = child;

			token.child = child;

			expect(parent.children[0]).toBe(child);
		});

		it('throws if two different nodes are assigned', () => {
			const parent = new NavNode(undefined, {});
			const token = new NavChildToken(parent, 0);

			const child1 = new NavNode(parent, {});
			parent.children[0] = child1;

			const child2 = new NavNode(parent, {});

			expect(() => {
				token.child = child2;
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: more than one child node assigned to token"',
			);

			expect(parent.children[0]).toBe(child1);
		});

		it('throws if node has an incorrect parent', () => {
			const parent = new NavNode(undefined, {});
			const token = new NavChildToken(parent, 0);
			const child = new NavNode(undefined, {});

			expect(() => {
				token.child = child;
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: child node has an incorrect parent"',
			);

			expect(parent.children[0]).toBe(undefined);
		});
	});
});

describe('navChildToken', () => {
	it('is a context', () => {
		expect(navChildToken.Provider).toBeTypeOf('function');
		expect(navChildToken.Consumer).toBeTypeOf('function');

		const setValue = vi.fn();

		const Component: FunctionComponent = () => {
			setValue(useContext(navChildToken));
			return null;
		};

		const parent = new NavNode(undefined, {});
		const token = parent.newChildToken();

		render(
			<navChildToken.Provider value={token}>
				<Component />
			</navChildToken.Provider>,
		);

		expect(setValue).toBeCalledWith(token);
	});

	it('has a display name', () => {
		if (import.meta.env.DEV) {
			expect(navChildToken.displayName).toBe('navChildToken');
		} else {
			expect(navChildToken.displayName).toBeUndefined();
		}
	});

	it('is undefined by default', () => {
		const setValue = vi.fn();

		const Component: FunctionComponent = () => {
			setValue(useContext(navChildToken));
			return null;
		};

		render(<Component />);
		expect(setValue).toBeCalledWith(undefined);
	});
});

describe('useChildToken', () => {
	it('throws if context is not set', () => {
		const Component: FunctionComponent = () => {
			useChildToken();
			return null;
		};

		expect(() => {
			render(<Component />);
		}).toThrowErrorMatchingInlineSnapshot(
			'"Assertion failed: navChildToken context was not setup"',
		);
	});

	it('returns the child token', () => {
		const setValue = vi.fn();

		const Component: FunctionComponent = () => {
			setValue(useChildToken());
			return null;
		};

		const parent = new NavNode(undefined, {});
		const token = parent.newChildToken();

		render(
			<navChildToken.Provider value={token}>
				<Component />
			</navChildToken.Provider>,
		);

		expect(setValue).toBeCalledWith(token);
	});

	it('cleans up the child token on unmount', () => {
		const Component: FunctionComponent = () => {
			useChildToken();
			return null;
		};

		const parent = new NavNode(undefined, {});
		const token = parent.newChildToken();

		const child = new NavNode(parent, {});
		token.child = child;

		render(
			<navChildToken.Provider value={token}>
				<Component />
			</navChildToken.Provider>,
		).unmount();

		expect(token.child).toBeUndefined();
	});

	it('cleans up the child token on change', () => {
		const Component: FunctionComponent = () => {
			useChildToken();
			return null;
		};

		const Provider: FunctionComponent<{
			first: NavChildToken;
			second: NavChildToken;
		}> = ({first, second}) => {
			const [token, setToken] = useState(first);

			return (
				<navChildToken.Provider value={token}>
					<Component />
					<button
						data-testid="switch"
						onClick={() => {
							setToken(second);
						}}
					/>
				</navChildToken.Provider>
			);
		};

		const parent = new NavNode(undefined, {});

		const token1 = parent.newChildToken();
		const child1 = new NavNode(parent, {});
		token1.child = child1;

		const token2 = parent.newChildToken();
		const child2 = new NavNode(parent, {});
		token2.child = child2;

		const result = render(<Provider first={token1} second={token2} />);

		const button = result.queryByTestId('switch');
		assert(button);
		fireEvent.click(button);

		expect(token1.child).toBeUndefined();
		expect(token2.child).toBe(child2);
	});
});

describe('wrapNavChildren', () => {
	it('takes non-array literal children', () => {
		const parent = new NavNode(undefined, {});

		expect(wrapNavChildren(parent, 'a')).toMatchObject(['a']);
		expect(wrapNavChildren(parent, 0)).toMatchObject([0]);
		expect(wrapNavChildren(parent, 0n)).toMatchObject([0n]);
		expect(wrapNavChildren(parent, false)).toMatchObject([]);
		expect(wrapNavChildren(parent, true)).toMatchObject([]);
		expect(wrapNavChildren(parent, null)).toMatchObject([]);
		expect(wrapNavChildren(parent, undefined)).toMatchObject([]);
	});

	it('takes non-array object children', () => {
		const setValue = vi.fn();

		const Component: FunctionComponent = () => {
			setValue(useContext(navChildToken)?.parent);
			return null;
		};

		const parent = new NavNode(undefined, {});

		const wrapped = wrapNavChildren(parent, <Component key="randomKey" />);

		render(<>{wrapped}</>);
		expect(setValue).toBeCalledWith(parent);
	});

	it('takes non-array literal children', () => {
		const parent = new NavNode(undefined, {});

		expect(wrapNavChildren(parent, ['a'])).toMatchObject(['a']);
		expect(wrapNavChildren(parent, [0])).toMatchObject([0]);
		expect(wrapNavChildren(parent, [0n])).toMatchObject([0n]);
		expect(wrapNavChildren(parent, [false])).toMatchObject([]);
		expect(wrapNavChildren(parent, [true])).toMatchObject([]);
		expect(wrapNavChildren(parent, [null])).toMatchObject([]);
		expect(wrapNavChildren(parent, [undefined])).toMatchObject([]);
	});

	it('takes array object children', () => {
		const setValue = vi.fn();

		const Component: FunctionComponent = () => {
			setValue(useContext(navChildToken)?.parent);
			return null;
		};

		const parent = new NavNode(undefined, {});
		const wrapped = wrapNavChildren(parent, [<Component />, <Component />]);

		render(<>{wrapped}</>);
		expect(setValue).toBeCalledTimes(2);
		expect(setValue).toBeCalledWith(parent);
	});

	it('keeps the key of the children', () => {
		const parent = new NavNode(undefined, {});
		const wrapped = wrapNavChildren(parent, <div key="randomKey" />);

		expect(wrapped.length).toBe(1);
		assert(typeof wrapped[0] === 'object');
		expect(wrapped[0].key).toBe('randomKey');
	});
});
