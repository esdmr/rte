import {CompGroup} from './group.js';
import {type CompLayer} from './layer.js';
import {CompNode} from './node.js';
import {CompPageGroup} from './page-group.js';

export class CompGlobalGroup extends CompNode {
	readonly pages = new CompPageGroup();
	readonly overlays = new CompGroup<CompLayer>();

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
