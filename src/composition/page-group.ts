import {CompGroup} from './group.js';
import type {CompPage} from './page.js';

export class CompPageGroup extends CompGroup<CompPage> {
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
