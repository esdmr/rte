import {fireEvent, render, waitFor} from '@testing-library/preact';
import {assert, describe, expect, it} from 'vitest';
import {NavRoot} from '../navigation/NavRoot.js';
import {CloseButton} from './CloseButton.js';
import {CompDialog} from './dialog.js';
import {CompPageList} from './page-list.js';
import {CompPage} from './page.js';
import {lastRender, setTestRenderer} from './test-renderer.js';
import {CompLayer} from './layer.js';

describe('CloseButton', () => {
	setTestRenderer();

	it('Throws an error outside of compositor', () => {
		expect(() => {
			render(
				<NavRoot>
					<CloseButton />
				</NavRoot>,
			);
		}).toThrowErrorMatchingInlineSnapshot(
			'"Assertion failed: Called outside of the compositor"',
		);
	});

	it('Throws an error outside of a page or dialog', () => {
		const layer = new CompLayer();

		expect(() => {
			layer.render(
				<NavRoot>
					<CloseButton />
				</NavRoot>,
			);
		}).toThrowErrorMatchingInlineSnapshot(
			'"CloseButton outside a page or dialog"',
		);
	});

	it('should render inside a page', () => {
		const page = new CompPage();
		page.content.render(
			<NavRoot>
				<CloseButton />
			</NavRoot>,
		);

		assert(lastRender);
		expect(lastRender.container.childElementCount).toBeGreaterThan(0);
	});

	it('should not render if showPageCloseButton is unset', () => {
		const page = new CompPage();
		page.content.showPageCloseButton = false;
		page.content.render(
			<NavRoot>
				<CloseButton />
			</NavRoot>,
		);

		assert(lastRender);
		expect(lastRender.container.childElementCount).toBe(0);
	});

	it('should render inside a dialog', () => {
		const dialog = new CompDialog();
		dialog.render(
			<NavRoot>
				<CloseButton />
			</NavRoot>,
		);

		assert(lastRender);
		expect(lastRender.container.childElementCount).toBeGreaterThan(0);
	});

	it('should close a page', async () => {
		const list = new CompPageList();
		const page = new CompPage();
		list.append(page);
		page.content.render(
			<NavRoot>
				<CloseButton />
			</NavRoot>,
		);

		assert(lastRender);
		fireEvent.click(lastRender.getByTitle('Back'));

		await waitFor(() => {
			expect(list.childrenCount).toBe(0);
			expect(page.parent).toBeUndefined();
		});
	});

	it('should close a dialog', async () => {
		const list = new CompPageList();
		const page = new CompPage();
		const dialog = new CompDialog();
		list.append(page);
		page.dialogs.append(dialog);
		dialog.render(
			<NavRoot>
				<CloseButton />
			</NavRoot>,
		);

		assert(lastRender);
		fireEvent.click(lastRender.getByTitle('Close'));

		await waitFor(() => {
			expect(page.parent).toBe(list);
			expect(page.dialogs.childrenCount).toBe(0);
			expect(dialog.parent).toBeUndefined();
		});
	});
});
