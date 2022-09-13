import type {NavNode} from './node.js';

export class NavState {
	selected: NavNode | undefined;

	// Below are two maps, where the value of one map is the key of the other.
	// Because of this, it is not necessary to convert any of them to a
	// WeakMap.
	readonly elementToNode = new Map<HTMLElement, NavNode>();
	readonly nodeToElement = new Map<NavNode, HTMLElement>();

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
