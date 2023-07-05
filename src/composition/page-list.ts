import {CompList} from './list.js';
import type {CompPage} from './page.js';

export class CompPageList extends CompList<CompPage> {
	constructor(element?: HTMLElement) {
		super(element);

		this.addEventListener('ChildrenUpdate', () => {
			const {lastChild} = this;

			for (const child of this) {
				child.hidden = child !== lastChild;
			}
		});
	}
}
