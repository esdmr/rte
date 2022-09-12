import type {FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';
import assert from '../assert.js';
import {useChildToken, wrapNavChildren} from './child-token.js';
import {type NavHooks, NavNode} from './node.js';
import {getAnyLeaf, iterateChildren} from './utils.js';

const gridWidths = new WeakMap<NavNode, number>();

function* iterateRow(grid: NavNode, from: number, dir: 1 | -1) {
	const width = gridWidths.get(grid);
	assert(width, 'grid width not found');

	const row = Math.trunc(from / width);
	const to = row * width + (dir > 0 ? width : -1);
	const {children} = grid;

	for (let index = from + dir; index !== to; index += dir) {
		const node = children[index];

		if (node !== undefined) {
			yield node;
		}
	}
}

function* iterateColumn(grid: NavNode, from: number, dir: 1 | -1) {
	// FIXME: Optimize.
	const width = gridWidths.get(grid);
	assert(width, 'grid width not found');
	const {children} = grid;
	const column = from % width;
	const to =
		dir > 0
			? (() => {
					const lastIndex = children.length - 1;
					const row = Math.trunc(lastIndex / width);
					return row * width + width + column;
			  })()
			: column - width;

	for (let index = from + dir * width; index !== to; index += dir * width) {
		const node = children[index];

		if (node !== undefined) {
			yield node;
		}
	}
}

const navGridHooks: NavHooks = {
	dispose() {
		gridWidths.delete(this);
	},
	getLeaf(via) {
		return via === 'left' || via === 'up'
			? getAnyLeaf(iterateChildren(this, this.children.length, -1), via)
			: getAnyLeaf(iterateChildren(this, -1, 1), via);
	},
	getNextLeaf(child, dir) {
		const index = this.children.indexOf(child);

		switch (dir) {
			case 'next':
				return (
					getAnyLeaf(iterateChildren(this, index, 1), 'right') ??
					getAnyLeaf(iterateChildren(this, index, -1), 'left') ??
					this.parent?.getNextLeaf(this, 'next')
				);

			case 'up':
				return (
					getAnyLeaf(iterateColumn(this, index, -1), 'up') ??
					this.parent?.getNextLeaf(this, dir)
				);

			case 'down':
				return (
					getAnyLeaf(iterateColumn(this, index, 1), 'down') ??
					this.parent?.getNextLeaf(this, dir)
				);

			case 'left':
				return (
					getAnyLeaf(iterateRow(this, index, -1), 'left') ??
					this.parent?.getNextLeaf(this, dir)
				);

			case 'right':
				return (
					getAnyLeaf(iterateRow(this, index, 1), 'right') ??
					this.parent?.getNextLeaf(this, dir)
				);

			default:
				return this.parent?.getNextLeaf(this, dir);
		}
	},
};

export const NavGrid: FunctionComponent<{
	width: number;
}> = ({children, width}) => {
	assert(width, 'grid width may not be zero');

	const childToken = useChildToken();
	const node = useMemo(
		() => NavNode.for(childToken, navGridHooks),
		[childToken],
	);

	gridWidths.set(node, width);
	return wrapNavChildren(node, children);
};
