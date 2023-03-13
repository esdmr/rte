import {groupParentOf} from './group.js';
import {CompositorLayer} from './layer.js';
import {Result} from './result.js';

export class CompositorDialog<T = void> extends CompositorLayer {
	readonly result = new Result<T>();

	constructor(element?: HTMLElement) {
		super(element);

		this.result.promise
			.catch(() => undefined)
			.finally(() => {
				groupParentOf(this)?.remove(this);
			});
	}
}
