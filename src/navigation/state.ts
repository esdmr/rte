import type {NavNode, NavSelectOptions} from './node.js';

export class NavState {
	selected: NavNode | undefined;
	readonly elementToNode = new Map<HTMLElement, NavNode>();

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
