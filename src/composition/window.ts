import {CompList} from './list.js';
import {type CompLayer} from './layer.js';
import {CompNode} from './node.js';
import {CompPageList} from './page-list.js';

export class CompWindow extends CompNode {
	readonly pages = new CompPageList();
	readonly overlays = new CompList<CompLayer>();

	constructor(element?: HTMLElement) {
		super(element);
		this._element.append(this.pages._element, this.overlays._element);
	}

	get activeDescendant() {
		return this.pages.activeDescendant;
	}

	dispose() {
		this.pages.dispose();
		this.overlays.dispose();
	}
}
