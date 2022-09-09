import type {FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';
import {useChildToken} from './child-token.js';
import {wrapNavChildren} from './context.js';
import {type NavHooks, NavNode} from './node.js';
import {getAnyLeaf, iterateToStart, iterateToEnd} from './utils.js';

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

export const NavRow: FunctionComponent = ({children}) => {
	const childToken = useChildToken();
	const node = useMemo(
		() => NavNode.for(childToken, navRowHooks),
		[childToken],
	);

	return wrapNavChildren(node, children);
};
