import assert from '../assert.js';
import type {CompNode} from './node.js';

export const compNodeOfElement = new WeakMap<Element, CompNode>();

export function getCompNodeOf(
	// eslint-disable-next-line @typescript-eslint/ban-types
	element: Element | null,
	what: string,
) {
	if (!element) {
		return undefined;
	}

	const child = compNodeOfElement.get(element);
	assert(child, `Child of ${what} is not a compositor node`);
	return child;
}
