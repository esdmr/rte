import type {FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';
import {useChildToken, wrapNavChildren} from './child-token.js';
import {type NavHooks, NavNode} from './node.js';
import {getAnyLeaf, iterateChildren} from './utils.js';

const navRowHooks: NavHooks = {
	type: 'row',
	getLeaf(via) {
		return via === 'left'
			? getAnyLeaf(iterateChildren(this, this.children.length, -1), via)
			: getAnyLeaf(iterateChildren(this, -1, 1), via);
	},
	getNextLeaf(child, dir) {
		switch (dir) {
			case 'next': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateChildren(this, index, 1), 'right') ??
					getAnyLeaf(iterateChildren(this, index, -1), 'left') ??
					this.parent?.getNextLeaf(this, 'next')
				);
			}

			case 'left': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateChildren(this, index, -1), 'left') ??
					this.parent?.getNextLeaf(this, dir)
				);
			}

			case 'right': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateChildren(this, index, 1), 'right') ??
					this.parent?.getNextLeaf(this, dir)
				);
			}

			default: {
				return this.parent?.getNextLeaf(this, dir);
			}
		}
	},
};

export const NavRow: FunctionComponent = ({children}) => {
	const childToken = useChildToken();
	const node = useMemo(
		() => NavNode.for(childToken, navRowHooks),
		[childToken],
	);

	return <>{wrapNavChildren(node, children)}</>;
};
