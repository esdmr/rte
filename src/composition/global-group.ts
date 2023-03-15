import {CompositorGroup} from './group.js';
import {useCompositorNode, type CompositorLayer} from './layer.js';
import {CompositorNode} from './node.js';
import {CompositorPageGroup} from './page-group.js';

export class CompositorGlobalGroup extends CompositorNode {
	readonly pages = new CompositorPageGroup();
	readonly overlays = new CompositorGroup<CompositorLayer>();

	constructor(element?: HTMLElement) {
		super(element);
		this._element.append(this.pages._element, this.overlays._element);
	}

	get activeDescendant() {
		return this.pages.activeDescendant;
	}

	dispose(): void {
		this.pages.dispose();
		this.overlays.dispose();
	}
}

export function useCompositorGlobalGroup() {
	return useCompositorNode(CompositorGlobalGroup);
}
