import {CompositorGroup} from './group.js';
import type {CompositorPage} from './page.js';
import * as css from './page.module.css.js';

export class CompositorPageGroup extends CompositorGroup<CompositorPage> {
	protected override _onChildrenUpdated() {
		const {lastChild} = this;

		for (const child of this.children) {
			child.content.classList.toggle(css.last, child === lastChild);
		}
	}
}
