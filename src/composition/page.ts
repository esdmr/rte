import type {ComponentChild} from 'preact';
import assert from '../assert.js';
import type {CompDialog} from './dialog.js';
import {CompWindow} from './window.js';
import {CompGroup, groupParentOf} from './group.js';
import {CompLayer} from './layer.js';
import {CompNode} from './node.js';
import * as css from './page.module.css';

export class CompPage extends CompNode {
	readonly content = new CompLayer(document.createElement('main'));
	readonly dialogs = new CompGroup<CompDialog<any>>();

	constructor(element?: HTMLElement) {
		super(element);
		this._element.append(this.content._element, this.dialogs._element);
		this.content.classList.add(css.pageContent);

		this.dialogs.addEventListener('ChildrenUpdate', () => {
			const activeChild = this.dialogs.lastChild ?? this.content;
			this.content.inert = this.content !== activeChild;

			for (const item of this.dialogs.children) {
				activeChild.inert = item !== activeChild;
			}
		});
	}

	override get activeDescendant() {
		return this.dialogs.activeDescendant ?? this.content.activeDescendant;
	}

	dispose() {
		this.content.dispose();
		this.dialogs.dispose();
		groupParentOf(this)?.remove(this);
	}
}

export function createPage(options: {
	readonly window?: CompWindow;
	readonly page?: CompPage;
	readonly replace?: boolean;
	readonly content: ComponentChild;
	readonly classes: readonly string[];
}) {
	const window = options.window ?? options.page?.findNearest(CompWindow);
	assert(window, 'Either window or page needs to be provided');

	const newPage = new CompPage();

	if (options.replace) {
		assert(options.page, 'You must provide a page to replace');
		window.pages.replace(options.page, newPage);
		options.page.dispose();
	} else if (options.page) {
		window.pages.after(options.page, newPage);
	} else {
		window.pages.append(newPage);
	}

	newPage.content.classList.add(...options.classes);
	newPage.content.render(options.content);
	newPage.content.focus();

	return newPage;
}
