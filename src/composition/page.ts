import {CompositorGroup} from './group.js';
import {CompositorLayer} from './layer.js';
import {CompositorNode} from './node.js';
import type {CompositorDialog} from './dialog.js';
import * as css from './page.module.css.js';

export class CompositorPage extends CompositorNode {
	readonly content = new CompositorLayer();
	readonly dialogs = new CompositorGroup<CompositorDialog>();

	constructor(element?: HTMLElement) {
		super(element);
		this._element.append(this.content._element, this.dialogs._element);
		this.content.classList.add(css.pageContent);
	}

	override get activeDescendant() {
		return this.dialogs.activeDescendant ?? this.content.activeDescendant;
	}
}
