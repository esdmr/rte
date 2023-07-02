import {type FunctionComponent, type VNode, cloneElement} from 'preact';
import {useMemo} from 'preact/hooks';
import assert from '../assert.js';
import {makeFocusVisible, removeFocusVisible} from '../focus-visible.js';
import {navChildToken, useChildToken} from './child-token.js';
import {type NavHooks, NavNode} from './node.js';
import {isVnodeFocusable, setRef} from './utils.js';

const navItemHooks: NavHooks = {
	type: 'item',
	onSelect(options) {
		const {ref} = this;
		assert(ref, 'no ref to select');
		ref.dataset.skipFocusEvent = '';
		ref.focus();

		if (options?.focusVisible) {
			makeFocusVisible();
		} else {
			removeFocusVisible();
		}
	},
	getLeaf() {
		return this;
	},
	getNextLeaf(_, dir) {
		return this.parent?.getNextLeaf(this, dir);
	},
};

export const NavItem: FunctionComponent<{
	children: VNode;
}> = (props) => {
	const childToken = useChildToken();
	const node = useMemo(
		() => NavNode.for(childToken, navItemHooks),
		[childToken],
	);

	assert(isVnodeFocusable(props.children), 'dom node is not focusable');
	const oldRef = props.children.ref;

	return (
		<navChildToken.Provider value={undefined}>
			{cloneElement(props.children, {
				ref(value: unknown) {
					if (value instanceof HTMLElement) {
						node.ref = value;
						setRef(oldRef, value);
					} else if (value === null || value === undefined) {
						node.ref = undefined;
						setRef(oldRef, value);
					} else {
						throw new TypeError(
							'NavItem with a non-HTMLElement ref',
						);
					}
				},
			})}
		</navChildToken.Provider>
	);
};
