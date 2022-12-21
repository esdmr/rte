import type {FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';
import {useChildToken, wrapNavChildren} from './child-token.js';
import {type NavHooks, NavNode} from './node.js';
import {getAnyLeaf, iterateChildren} from './utils.js';

const navFlowHooks: NavHooks = {
	type: '⇉',
	getLeaf(via) {
		return via === 'left' || via === 'up'
			? getAnyLeaf(iterateChildren(this, this.children.length, -1), via)
			: getAnyLeaf(iterateChildren(this, -1, 1), via);
	},
	getNextLeaf(child, dir) {
		switch (dir) {
			case 'next': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateChildren(this, index, 1), 'down') ??
					getAnyLeaf(iterateChildren(this, index, -1), 'up') ??
					this.parent?.getNextLeaf(this, 'next')
				);
			}

			case 'up':
			case 'left': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateChildren(this, index, -1), 'up') ??
					this.parent?.getNextLeaf(this, dir)
				);
			}

			case 'down':
			case 'right': {
				const index = this.children.indexOf(child);
				return (
					getAnyLeaf(iterateChildren(this, index, 1), 'down') ??
					this.parent?.getNextLeaf(this, dir)
				);
			}

			default: {
				return this.parent?.getNextLeaf(this, dir);
			}
		}
	},
};

export const NavFlow: FunctionComponent = ({children}) => {
	const childToken = useChildToken();
	const node = useMemo(
		() => NavNode.for(childToken, navFlowHooks),
		[childToken],
	);

	return <>{wrapNavChildren(node, children)}</>;
};
