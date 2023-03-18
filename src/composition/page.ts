import type {ComponentChild} from 'preact';
import assert from '../assert.js';
import type {CompositorDialog} from './dialog.js';
import {CompositorGlobalGroup} from './global-group.js';
import {CompositorGroup, groupParentOf} from './group.js';
import {CompositorLayer, useCompositorNode} from './layer.js';
import {CompositorNode} from './node.js';
import * as css from './page.module.css';

export class CompositorPage extends CompositorNode {
	readonly content = new CompositorLayer(document.createElement('main'));
	readonly dialogs = new CompositorGroup<CompositorDialog<any>>();

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

	dispose(): void {
		this.content.dispose();
		this.dialogs.dispose();
		groupParentOf(this)?.remove(this);
	}
}

export function useCompositorPage() {
	return useCompositorNode(CompositorPage);
}

export function createPage(options: {
	readonly root?: CompositorGlobalGroup;
	readonly page?: CompositorPage;
	readonly replace?: boolean;
	readonly content: ComponentChild;
	readonly classes: readonly string[];
}) {
	const root =
		options.root ?? options.page?.findNearest(CompositorGlobalGroup);
	assert(root, 'Either root or page needs to be provided');

	const newPage = new CompositorPage();

	if (options.replace) {
		assert(options.page, 'You must provide a page to replace');
		root.pages.replace(options.page, newPage);
		options.page.dispose();
	} else if (options.page) {
		root.pages.after(options.page, newPage);
	} else {
		root.pages.append(newPage);
	}

	newPage.content.classList.add(...options.classes);
	newPage.content.render(options.content);
	newPage.content.focus();

	return newPage;
}
