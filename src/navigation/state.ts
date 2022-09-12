import type {NavNode} from './node.js';

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
