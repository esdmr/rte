import {beforeEach} from 'vitest';
import {render, type RenderResult} from '@testing-library/preact';
import {CompLayer} from './layer.js';

let setup = false;
export let lastRender: RenderResult | undefined;

export function setTestRenderer() {
	if (!setup) {
		CompLayer._renderer = (vnode, parent) => {
			lastRender = render(vnode, {container: parent});
		};

		setup = true;
	}

	beforeEach(() => {
		lastRender = undefined;
	});
}
