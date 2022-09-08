import {
	cloneElement,
	createContext,
	Ref,
	toChildArray,
	type ComponentChildren,
	type FunctionComponent,
	type VNode,
} from 'preact';
import {useContext, useEffect, useMemo} from 'preact/hooks';
import assert from '../../assert.js';

// eslint-disable-next-line @typescript-eslint/ban-types
function setRef<T>(ref: Ref<T> | null | undefined, value: T | null) {
	if (typeof ref === 'function') {
		ref(value);
	} else if (ref) {
		ref.current = value;
	}
}

function isVnodeFocusable(vnode: VNode<Record<string, unknown>>) {
	const hasHref = typeof vnode.props.href === 'string';
	const hasTabIndex =
		Boolean(vnode.props.tabIndex) || Boolean(vnode.props.tabindex);
	const isContentEditable =
		Boolean(vnode.props.contentEditable) ||
		Boolean(vnode.props.contenteditable);
	const isNotDisabled = !vnode.props.disabled;

	return (
		(vnode.type === 'a' && hasHref) ||
		(vnode.type === 'area' && hasHref) ||
		(vnode.type === 'input' && isNotDisabled) ||
		(vnode.type === 'select' && isNotDisabled) ||
		(vnode.type === 'textarea' && isNotDisabled) ||
		(vnode.type === 'button' && isNotDisabled) ||
		vnode.type === 'iframe' ||
		vnode.type === 'object' ||
		vnode.type === 'embed' ||
		hasTabIndex ||
		isContentEditable
	);
}

export class NavState {
	selected: NavNode | undefined;
	readonly elementToNode = new WeakMap<HTMLElement, NavNode>();
	readonly nodeToElement = new WeakMap<NavNode, HTMLElement>();

	deselect() {
		this.selected?.deselect();
		this.selected = undefined;
	}

	next() {
		this.selected?.parent?.getNextLeaf(this.selected, 'next')?.select();
	}

	up() {
		this.selected?.parent?.getNextLeaf(this.selected, 'up')?.select();
	}

	down() {
		this.selected?.parent?.getNextLeaf(this.selected, 'down')?.select();
	}

	left() {
		this.selected?.parent?.getNextLeaf(this.selected, 'left')?.select();
	}

	right() {
		this.selected?.parent?.getNextLeaf(this.selected, 'right')?.select();
	}
}

export class NavChildToken {
	constructor(readonly parent: NavNode, private readonly index: number) {}

	get child() {
		return this.parent.children[this.index];
	}

	set child(node: NavNode | undefined) {
		if (node !== undefined) {
			assert(
				this.parent.children[this.index] === undefined,
				'more than one child node assigned to token',
			);
		}

		this.parent.children[this.index] = node;
	}
}

export type NavDirection = 'next' | 'up' | 'down' | 'left' | 'right';

export interface NavHooks {
	select?(this: NavNode): void;
	deselect?(this: NavNode): void;
	getLeaf?(this: NavNode, via: NavDirection): NavNode | undefined;
	getNextLeaf?(
		this: NavNode,
		child: NavNode,
		dir: NavDirection,
	): NavNode | undefined;
}

export class NavNode {
	static for(childToken: NavChildToken, hooks: NavHooks) {
		const node = new NavNode(childToken.parent, hooks);
		childToken.child = node;
		return node;
	}

	readonly state: NavState;
	readonly children: Array<NavNode | undefined> = [];
	private isDisposed = false;

	get isSelected() {
		assert(!this.isDisposed, 'node is disposed');
		return this.state.selected === this;
	}

	get ref() {
		return this.state.nodeToElement.get(this);
	}

	set ref(current: HTMLElement | undefined) {
		const old = this.ref;

		if (old !== undefined) {
			this.state.nodeToElement.delete(this);
			this.state.elementToNode.delete(old);
		}

		if (current !== undefined) {
			this.state.nodeToElement.set(this, current);
			this.state.elementToNode.set(current, this);
		}
	}

	constructor(
		readonly parent: NavNode | undefined,
		private readonly hooks: NavHooks,
	) {
		this.parent = parent;
		this.state = parent?.state ?? new NavState();
	}

	newChildToken() {
		assert(!this.isDisposed, 'node is disposed');
		const index = this.children.push(undefined) - 1;
		return new NavChildToken(this, index);
	}

	dispose() {
		if (this.isDisposed) {
			return;
		}

		for (const [index, child] of this.children.entries()) {
			child?.dispose();
			this.children[index] = undefined;
		}

		if (this.isSelected) {
			this.state.deselect();
			this.parent?.getNextLeaf(this, 'next')?.select();
		}

		this.isDisposed = true;
		this.ref = undefined;
	}

	select() {
		assert(!this.isDisposed, 'node is disposed');
		assert(this.hooks.select !== undefined, 'select hook is undefined');

		if (this.isSelected) {
			return;
		}

		this.state.deselect();
		this.state.selected = this;
		this.hooks.select.call(this);
	}

	deselect() {
		assert(!this.isDisposed, 'node is disposed');
		assert(this.isSelected, 'node is not selected');
		assert(this.hooks.deselect !== undefined, 'deselect hook is undefined');
		this.hooks.deselect.call(this);
	}

	getLeaf(via: NavDirection) {
		assert(!this.isDisposed, 'node is disposed');
		return this.hooks.getLeaf?.call(this, via);
	}

	getNextLeaf(child: NavNode, via: NavDirection) {
		assert(!this.isDisposed, 'node is disposed');
		assert(this.children.includes(child), 'node is not a child');
		return this.hooks.getNextLeaf?.call(this, child, via);
	}
}

function* iterateToStart(nodes: Array<NavNode | undefined>, from: number) {
	const length = nodes.length;
	assert(length > 0, 'empty node list');

	for (let index = from; index >= 0; index--) {
		yield nodes[index];
	}
}

function* iterateToEnd(nodes: Array<NavNode | undefined>, from: number) {
	const length = nodes.length;
	assert(length > 0, 'empty node list');

	for (let index = from; index < length; index++) {
		yield nodes[index];
	}
}

function getAnyLeaf(nodes: Iterable<NavNode | undefined>, via: NavDirection) {
	for (const node of nodes) {
		const leaf = node?.getLeaf(via);

		if (leaf !== undefined) {
			return leaf;
		}
	}

	return undefined;
}

const navRowHooks: NavHooks = {
	getLeaf(via) {
		return via === 'left'
			? getAnyLeaf(iterateToStart(this.children, this.children.length - 1), via)
			: getAnyLeaf(iterateToEnd(this.children, 0), via);
	},
	getNextLeaf(child, dir) {
		switch (dir) {
			case 'next': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateToEnd(this.children, index + 1), 'right') ??
					getAnyLeaf(iterateToStart(this.children, index - 1), 'left') ??
					this.parent?.getNextLeaf(this, 'next')
				);
			}

			case 'left': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateToStart(this.children, index - 1), 'left') ??
					this.parent?.getNextLeaf(this, dir)
				);
			}

			case 'right': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateToEnd(this.children, index + 1), 'left') ??
					this.parent?.getNextLeaf(this, dir)
				);
			}

			default:
				return this.parent?.getNextLeaf(this, dir);
		}
	},
};

export const navColumnHooks: NavHooks = {
	getLeaf(via) {
		return via === 'up'
			? getAnyLeaf(iterateToStart(this.children, this.children.length - 1), via)
			: getAnyLeaf(iterateToEnd(this.children, 0), via);
	},
	getNextLeaf(child, dir) {
		switch (dir) {
			case 'next': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateToEnd(this.children, index + 1), 'down') ??
					getAnyLeaf(iterateToStart(this.children, index - 1), 'up') ??
					this.parent?.getNextLeaf(this, 'next')
				);
			}

			case 'up': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateToStart(this.children, index - 1), 'up') ??
					this.parent?.getNextLeaf(this, dir)
				);
			}

			case 'down': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateToEnd(this.children, index + 1), 'down') ??
					this.parent?.getNextLeaf(this, dir)
				);
			}

			default:
				return this.parent?.getNextLeaf(this, dir);
		}
	},
};

const navItemHooks: NavHooks = {
	select() {
		const {ref} = this;
		assert(ref, 'no ref to select');
		ref.focus();
	},
	deselect() {
		const {ref} = this;
		assert(ref, 'no ref to deselect');
		ref.blur();
	},
	getLeaf() {
		return this;
	},
	getNextLeaf(_, dir) {
		return this.parent?.getNextLeaf(this, dir);
	},
};

export const navigation = createContext<NavChildToken | undefined>(undefined);

if (import.meta.env.DEV) {
	navigation.displayName = 'navigation';
}

export function useChildToken() {
	const childToken = useContext(navigation);
	assert(childToken !== undefined, 'navigation context was not setup');

	useEffect(
		() => () => {
			childToken.child?.dispose();
			childToken.child = undefined;
		},
		[],
	);

	return childToken;
}

function wrapNavChildren(node: NavNode, children: ComponentChildren) {
	return (
		<>
			{toChildArray(children).map((child) =>
				typeof child === 'object' ? (
					<navigation.Provider
						value={node.newChildToken()}
						key={child.key as unknown}
					>
						{child}
					</navigation.Provider>
				) : (
					child
				),
			)}
		</>
	);
}

export const NavRoot: FunctionComponent = ({children}) => {
	const rootNode = useMemo(() => new NavNode(undefined, navColumnHooks), []);

	useEffect(() => {
		console.debug({rootNode});

		// FIXME: Remove.
		(globalThis as any).rootNode = rootNode;

		// FIXME: Move to separate API.
		const controller = new AbortController();

		document.body.addEventListener(
			'keydown',
			(event) => {
				if (!/^Arrow(?:Up|Down|Left|Right)$/.test(event.code)) {
					return;
				}

				event.preventDefault();

				if (!rootNode.state.selected) {
					rootNode.getLeaf('next')?.select();
					return;
				}

				switch (event.code) {
					case 'ArrowUp':
						rootNode.state.up();
						break;

					case 'ArrowDown':
						rootNode.state.down();
						break;

					case 'ArrowLeft':
						rootNode.state.left();
						break;

					case 'ArrowRight':
						rootNode.state.right();
						break;

					// No default
				}
			},
			{signal: controller.signal},
		);

		document.body.addEventListener(
			'focusin',
			(event) => {
				if (event.target instanceof HTMLElement) {
					const node = rootNode.state.elementToNode.get(event.target);
					node?.select();
				}
			},
			{signal: controller.signal},
		);

		return () => {
			rootNode.state.deselect();

			// FIXME: Move to separate API.
			controller.abort();
		};
	}, []);

	return wrapNavChildren(rootNode, children);
};

export const NavRow: FunctionComponent = ({children}) => {
	const childToken = useChildToken();
	const node = useMemo(() => NavNode.for(childToken, navRowHooks), []);
	return wrapNavChildren(node, children);
};

export const NavColumn: FunctionComponent = ({children}) => {
	const childToken = useChildToken();
	const node = useMemo(() => NavNode.for(childToken, navColumnHooks), []);
	return wrapNavChildren(node, children);
};

export const NavItem: FunctionComponent<{children: VNode}> = ({children}) => {
	const childToken = useChildToken();
	const node = useMemo(() => NavNode.for(childToken, navItemHooks), []);

	const vnode: VNode<{
		contenteditable?: string | boolean;
		contentEditable?: string | boolean;
		disabled?: boolean;
		href?: string;
		tabindex?: string | number;
		tabIndex?: string | number;
	}> = children;

	assert(typeof vnode.type === 'string', 'NavItem on a component');

	const oldRef = vnode.ref;
	const propsIfNotFocusable = isVnodeFocusable(vnode)
		? undefined
		: {
				tabIndex: -1,
		  };

	return (
		<navigation.Provider value={undefined}>
			{cloneElement(vnode, {
				ref(value: unknown) {
					if (value instanceof HTMLElement) {
						node.ref = value;
						setRef(oldRef, value);
					} else if (value === null || value === undefined) {
						node.ref = undefined;
						setRef(oldRef, value);
					} else {
						throw new TypeError('NavItem with a non-HTMLElement ref');
					}
				},
				...propsIfNotFocusable,
			})}
		</navigation.Provider>
	);
};
