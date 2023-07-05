import {beforeEach} from 'vitest';
import {render, type RenderResult} from '@testing-library/preact';
import type {ComponentChild} from 'preact';
import {CompLayer} from './layer.js';
import {compNodeOfElement} from './registry.js';

export let lastRender: RenderResult | undefined;

function testRenderer(vnode: ComponentChild, parent: HTMLElement) {
	lastRender = render(vnode, {container: parent});
}

export function setTestRenderer() {
	beforeEach(() => {
		CompLayer._renderer = testRenderer;
		lastRender = undefined;
		compNodeOfElement.delete(document.body);
	});
}
