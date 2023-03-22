import type {CompositorNode} from './node.js';

export const compositorNodeOfElement = new WeakMap<Element, CompositorNode>();
