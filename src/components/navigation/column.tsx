import type {FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';
import {useChildToken} from './child-token.js';
import {wrapNavChildren} from './context.js';
import {type NavHooks, NavNode} from './node.js';
import {getAnyLeaf, iterateToStart, iterateToEnd} from './utils.js';

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

export const NavColumn: FunctionComponent = ({children}) => {
	const childToken = useChildToken();
	const node = useMemo(
		() => NavNode.for(childToken, navColumnHooks),
		[childToken],
	);

	return wrapNavChildren(node, children);
};
