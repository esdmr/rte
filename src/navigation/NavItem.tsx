import {type FunctionComponent, type VNode, cloneElement} from 'preact';
import {useMemo} from 'preact/hooks';
import assert from '../assert.js';
import {navChildToken, useChildToken} from './child-token.js';
import {type NavHooks, NavNode} from './node.js';
import {isVnodeFocusable, setRef} from './utils.js';

const navItemHooks: NavHooks = {
	onSelect() {
		const {ref} = this;
		assert(ref, 'no ref to select');
		ref.focus();
	},
	getLeaf() {
		return this;
	},
	getNextLeaf(_, dir) {
		return this.parent?.getNextLeaf(this, dir);
	},
};

export const NavItem: FunctionComponent<{children: VNode}> = ({children}) => {
	const childToken = useChildToken();
	const node = useMemo(
		() => NavNode.for(childToken, navItemHooks),
		[childToken],
	);

	const vnode: VNode<{
		contenteditable?: string | boolean;
		contentEditable?: string | boolean;
		disabled?: boolean;
		href?: string;
		tabindex?: string | number;
		tabIndex?: string | number;
	}> = children;

	assert(typeof vnode.type === 'string', 'NavItem on a component');
	assert(isVnodeFocusable(vnode), 'dom node is not focusable');

	const oldRef = vnode.ref;

	return (
		<navChildToken.Provider value={undefined}>
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
			})}
		</navChildToken.Provider>
	);
};
