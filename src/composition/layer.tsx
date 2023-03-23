import {type ComponentChild, render, createContext} from 'preact';
import {useContext, useMemo} from 'preact/hooks';
import assert from '../assert.js';
import {groupParentOf} from './group.js';
import {CompositorNode} from './node.js';

export const compositorLayer = createContext<CompositorLayer | undefined>(
	undefined,
);

if (import.meta.env.DEV) {
	compositorLayer.displayName = 'compositorLayer';
}

export class CompositorLayer extends CompositorNode {
	constructor(element = document.createElement('section')) {
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
				<compositorLayer.Provider value={this}>
					{vnode}
				</compositorLayer.Provider>
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
		groupParentOf(this)?.remove(this);
		this.render(null);
	}
}

export function useCompositorLayer() {
	const layer = useContext(compositorLayer);
	assert(layer, 'Called outside of the compositor');
	return layer;
}

export function useCompositorNode<T extends CompositorNode>(
	AncestorClass: abstract new (...args: any[]) => T,
) {
	const layer = useCompositorLayer();

	return useMemo(() => {
		const ancestor = layer.findNearest(AncestorClass);
		assert(ancestor, `Matching ${AncestorClass.name} ancestor not found`);
		return ancestor;
	}, [layer]);
}
