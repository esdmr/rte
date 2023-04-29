import assert from '../assert.js';
import {type CompLayer} from './layer.js';
import {CompList} from './list.js';
import {CompPageList} from './page-list.js';
import {CompRecord} from './record.js';

export class CompWindow extends CompRecord<{
	pages: CompPageList;
	overlays: CompList<CompLayer>;
}> {
	get pages() {
		const pages = this.get('pages');
		assert(pages, 'Window is missing its page list');
		return pages;
	}

	get overlays() {
		const overlays = this.get('overlays');
		assert(overlays, 'Window is missing its overlay list');
		return overlays;
	}

	constructor(element?: HTMLElement) {
		super(element, {
			pages: new CompPageList(),
			overlays: new CompList<CompLayer>(),
		});
	}

	get activeDescendant() {
		return this.pages.activeDescendant;
	}
}
