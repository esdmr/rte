import {describe, expect, it} from 'vitest';
import {CompNode, tryRemovingFromParent} from './node.js';
import {compNodeOfElement} from './registry.js';

describe('CompNode', () => {
	class CompTestNode extends CompNode {
		disposed = false;

		override get activeDescendant() {
			return undefined;
		}

		override dispose(): void {
			this.disposed = true;
		}
	}

	describe('constructor', () => {
		it('fails if element is already registered', () => {
			const node = new CompTestNode();

			expect(
				() => new CompTestNode(node._element),
			).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Element already registered in a compositor"',
			);
		});

		it('registers the passed element', () => {
			const node = new CompTestNode();
			expect(compNodeOfElement.get(node._element)).toEqual(node);
		});

		it('sets role', () => {
			const node = new CompTestNode();
			expect(node.role).toMatchInlineSnapshot('"presentation"');
		});
	});

	describe('isAtDocumentBody', () => {
		it('is false if element is not provided', () => {
			const node = new CompTestNode();
			expect(node.isAtDocumentBody).toBe(false);
		});

		it('is false if the provided element is not the document body', () => {
			const node = new CompTestNode(document.createElement('div'));
			expect(node.isAtDocumentBody).toBe(false);
		});

		it('is false if the provided <body> element is not the document body', () => {
			const node = new CompTestNode(document.createElement('body'));
			expect(node.isAtDocumentBody).toBe(false);
		});

		it('is true if the provided element is document body', () => {
			const node = new CompTestNode(document.body);
			expect(node.isAtDocumentBody).toBe(true);
		});
	});

	describe('parent', () => {
		it('is undefined if root node', () => {
			const node = new CompTestNode();
			expect(node.parent).toBeUndefined();
		});

		it('is the parent compositor node', () => {
			const parent = new CompTestNode();
			const node = new CompTestNode();
			parent._element.append(node._element);
			expect(node.parent).toBe(parent);
		});

		it('is undefined if parent does not have a compositor node', () => {
			const parentElement = document.createElement('div');
			const node = new CompTestNode();
			parentElement.append(node._element);
			expect(node.parent).toBe(undefined);
		});
	});

	describe('findNearest', () => {
		class CompNodeSubSubClass extends CompTestNode {}

		it('matches itself given own class', () => {
			const node = new CompTestNode();
			expect(node.findNearest(CompTestNode)).toBe(node);
		});

		it('matches itself given a superclass', () => {
			const node = new CompTestNode();
			expect(node.findNearest(CompNode)).toBe(node);
		});

		it('matches parent', () => {
			const parent = new CompNodeSubSubClass();
			const node = new CompTestNode();
			parent._element.append(node._element);
			expect(node.findNearest(CompNodeSubSubClass)).toBe(parent);
		});

		it('fails to match anything if not found', () => {
			const node = new CompTestNode();
			new CompTestNode()._element.append(node._element);
			expect(node.findNearest(CompNodeSubSubClass)).toBeUndefined();
		});
	});

	describe('root', () => {
		class CompNodeRootTest extends CompTestNode {
			_root: CompNode = new CompTestNode();

			override get root() {
				return this._root;
			}
		}

		it('is the current node if no parent', () => {
			const node = new CompTestNode();
			expect(node.root).toBe(node);
		});

		it('asks parent for who is root', () => {
			const parent = new CompNodeRootTest();
			const node = new CompTestNode();
			parent._element.append(node._element);
			expect(node.root).toBe(parent._root);
		});
	});

	describe('classList', () => {
		it('is from the element', () => {
			const node = new CompTestNode();
			expect(node.classList).toBe(node._element.classList);
		});
	});

	describe('inert', () => {
		it('reflects the element inertness', () => {
			const node = new CompTestNode();
			expect(node.inert).toBe(node._element.inert);

			node._element.inert = false;
			expect(node.inert).toBe(false);

			node._element.inert = true;
			expect(node.inert).toBe(true);
		});

		it('sets the element inertness', () => {
			const node = new CompTestNode();

			node.inert = false;
			expect(node._element.inert).toBe(false);

			node.inert = true;
			expect(node._element.inert).toBe(true);
		});
	});

	describe('hidden', () => {
		it('reflects the element hidden attribute', () => {
			const node = new CompTestNode();
			expect(node.hidden).toBe(node._element.hidden);

			node._element.hidden = false;
			expect(node.hidden).toBe(false);

			node._element.hidden = true;
			expect(node.hidden).toBe(true);
		});

		it('sets the element hidden attribute', () => {
			const node = new CompTestNode();

			node.hidden = false;
			expect(node._element.hidden).toBe(false);

			node.hidden = true;
			expect(node._element.hidden).toBe(true);
		});
	});

	describe('role', () => {
		it('reflects the element role attribute', () => {
			const node = new CompTestNode();
			expect(node.role).toBe(node._element.getAttribute('role') ?? null);

			node._element.setAttribute('role', 'alertdialog');
			expect(node.role).toBe('alertdialog');

			node._element.removeAttribute('role');
			expect(node.role).toBeUndefined();
		});

		it('sets the element role attribute', () => {
			const node = new CompTestNode();

			node.role = 'alertdialog';
			expect(node._element.getAttribute('role')).toBe('alertdialog');

			node.role = undefined;
			expect(node._element.hasAttribute('role')).toBe(false);
		});
	});

	describe('animate', () => {
		it('sets up an animation on the element', () => {
			const node = new CompTestNode();
			const animation = node.animate(undefined, {});
			expect(node._element.getAnimations().includes(animation)).toBe(
				true,
			);
		});
	});

	describe('getAnimations', () => {
		it('returns animations of the element', () => {
			const node = new CompTestNode();
			const animation = node._element.animate(null, {});
			expect(node.getAnimations().includes(animation)).toBe(true);
		});
	});

	describe('addEventListener', () => {
		it('sets the event listener on the element', () => {
			const node = new CompTestNode();
			let clicked = false;
			node.addEventListener('click', () => {
				clicked = true;
			});
			node._element.dispatchEvent(new Event('click'));
			expect(clicked).toBe(true);
		});
	});

	describe('dispatchEvent', () => {
		it('dispatches events on the element', () => {
			const node = new CompTestNode();
			let clicked = false;
			node._element.addEventListener('click', () => {
				clicked = true;
			});
			node.dispatchEvent(new Event('click'));
			expect(clicked).toBe(true);
		});
	});

	describe('removeEventListener', () => {
		it('removes events defined via the element', () => {
			const node = new CompTestNode();
			let clicked = false;
			const listener = () => {
				clicked = true;
			};

			node._element.addEventListener('click', listener);
			node.removeEventListener('click', listener);
			node._element.dispatchEvent(new Event('click'));
			expect(clicked).toBe(false);
		});

		it('removes events defined via CompNode', () => {
			const node = new CompTestNode();
			let clicked = false;
			const listener = () => {
				clicked = true;
			};

			node.addEventListener('click', listener);
			node.removeEventListener('click', listener);
			node.dispatchEvent(new Event('click'));
			expect(clicked).toBe(false);
		});
	});

	describe('disposeAndSetFocus', () => {
		it('disposes the current node', () => {
			const node = new CompTestNode();
			expect(node.disposed).toBe(false);
			node.disposeAndSetFocus();
			expect(node.disposed).toBe(true);
		});
	});
});

describe('tryRemovingFromParent', () => {
	class CompStaticNode extends CompNode {
		override get activeDescendant() {
			return undefined;
		}

		override dispose(): void {
			// Do nothing
		}
	}

	class CompDynamicNode extends CompNode {
		override get activeDescendant() {
			return undefined;
		}

		override remove(oldChild: CompNode): void {
			oldChild._element.remove();
		}

		override dispose(): void {
			// Do nothing
		}
	}

	it('does nothing if it has no parents', () => {
		const node = new CompStaticNode();
		expect(node.parent).toBeUndefined();
		tryRemovingFromParent(node);
		expect(node.parent).toBeUndefined();
	});

	it('does nothing if parent is not removable', () => {
		const node = new CompStaticNode();
		const parent = new CompStaticNode();
		parent._element.append(node._element);

		expect(node.parent).toBe(parent);
		// This will cause a warning to be shown.
		tryRemovingFromParent(node);
		expect(node.parent).toBe(parent);
	});

	it('removes itself from the parent if removable', () => {
		const node = new CompStaticNode();
		const parent = new CompDynamicNode();
		parent._element.append(node._element);

		expect(node.parent).toBe(parent);
		tryRemovingFromParent(node);
		expect(node.parent).toBeUndefined();
	});
});
