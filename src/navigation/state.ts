import type {NavNode, NavSelectOptions} from './node.js';

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

	next(options?: NavSelectOptions) {
		this.selected?.parent?.getNextLeaf(this.selected, 'next')?.select(options);
	}

	up(options?: NavSelectOptions) {
		this.selected?.parent?.getNextLeaf(this.selected, 'up')?.select(options);
	}

	down(options?: NavSelectOptions) {
		this.selected?.parent?.getNextLeaf(this.selected, 'down')?.select(options);
	}

	left(options?: NavSelectOptions) {
		this.selected?.parent?.getNextLeaf(this.selected, 'left')?.select(options);
	}

	right(options?: NavSelectOptions) {
		this.selected?.parent?.getNextLeaf(this.selected, 'right')?.select(options);
	}
}
