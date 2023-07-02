import {type ComponentChild, render, createContext} from 'preact';
import {useContext} from 'preact/hooks';
import assert from '../assert.js';
import {CompNode, tryRemovingFromParent} from './node.js';

export const compLayer = createContext<CompLayer | undefined>(undefined);

if (import.meta.env.DEV) {
	compLayer.displayName = 'compLayer';
}

export class CompLayer extends CompNode {
	private _rendering = false;

	constructor(element = document.createElement('section')) {
		assert(
			element !== document.body,
			'Refusing to initialize compositor layer at document body',
		);

		super(element);
		this._element.tabIndex = -1;
		this.role = undefined;
	}

	get activeDescendant() {
		return this;
	}

	override get parent() {
		assert(
			!this._rendering,
			'accessed the parent of layer while rendering',
		);

		return super.parent;
	}

	render(vnode: ComponentChild) {
		this._rendering = true;

		render(
			typeof vnode === 'object' && vnode !== null ? (
				<compLayer.Provider value={this}>{vnode}</compLayer.Provider>
			) : (
				vnode
			),
			this._element,
		);

		this._rendering = false;
	}

	blur() {
		this._element.blur();
	}

	focus(options?: FocusOptions) {
		this._element.focus(options);
	}

	dispose() {
		this.dispatchEvent(new Event('LayerDispose'));
		this.render(null);
		tryRemovingFromParent(this);
	}
}

export function useCompLayer() {
	const layer = useContext(compLayer);
	assert(layer, 'Called outside of the compositor');
	return layer;
}
