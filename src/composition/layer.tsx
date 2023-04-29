import {type ComponentChild, render, createContext} from 'preact';
import {useContext, useMemo} from 'preact/hooks';
import assert from '../assert.js';
import {CompNode, tryRemovingFromParent} from './node.js';

export const compLayer = createContext<CompLayer | undefined>(undefined);

if (import.meta.env.DEV) {
	compLayer.displayName = 'compLayer';
}

export class CompLayer extends CompNode {
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

	render(vnode: ComponentChild) {
		render(
			typeof vnode === 'object' && vnode !== null ? (
				<compLayer.Provider value={this}>{vnode}</compLayer.Provider>
			) : (
				vnode
			),
			this._element,
		);
	}

	blur() {
		this._element.blur();
	}

	focus(options?: FocusOptions) {
		this._element.focus(options);
	}

	dispose() {
		this.render(null);
		tryRemovingFromParent(this);
	}
}

export function useCompLayer() {
	const layer = useContext(compLayer);
	assert(layer, 'Called outside of the compositor');
	return layer;
}

export function useCompNode<T extends CompNode>(
	AncestorClass: abstract new (...args: any[]) => T,
) {
	const layer = useCompLayer();

	return useMemo(() => {
		const ancestor = layer.findNearest(AncestorClass);
		assert(ancestor, `Matching ${AncestorClass.name} ancestor not found`);
		return ancestor;
	}, [layer]);
}
