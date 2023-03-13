import {type ComponentChild, render} from 'preact';
import {CompositorNode} from './node.js';

export class CompositorLayer extends CompositorNode {
	constructor(element?: HTMLElement) {
		super(element);
		this._element.tabIndex = -1;
	}

	get activeDescendant() {
		return this;
	}

	render(vnode: ComponentChild) {
		render(vnode, this._element);
	}

	blur(): void {
		this._element.blur();
	}

	focus(options?: FocusOptions) {
		this._element.focus(options);
	}
}
