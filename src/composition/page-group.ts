import {CompositorGroup} from './group.js';
import type {CompositorPage} from './page.js';

export class CompositorPageGroup extends CompositorGroup<CompositorPage> {
	constructor(element?: HTMLElement) {
		super(element);

		this.addEventListener('ChildrenUpdate', () => {
			const {lastChild} = this;

			for (const child of this.children) {
				child.hidden = child !== lastChild;
			}
		});
	}
}
