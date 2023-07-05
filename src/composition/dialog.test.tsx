import {assert, describe, expect, it} from 'vitest';
import {waitFor} from '@testing-library/preact';
import {CompDialog, CompDialogBuilder} from './dialog.js';
import {CompList} from './list.js';
import {CompPage} from './page.js';
import {lastRender, setTestRenderer} from './test-renderer.js';

setTestRenderer();

describe('CompDialog', () => {
	describe('constructor', () => {
		it('sets the default role to alertdialog', () => {
			expect(new CompDialog().role).toBe('alertdialog');
		});

		it('closes the dialog when result is fulfilled', async () => {
			const list = new CompList<CompDialog<void>>();

			const a = new CompDialog<void>();
			list.append(a);
			a.result.resolve();
			await a.result.promise;
			await waitFor(() => {
				expect(list.childrenCount).toBe(0);
			});

			const b = new CompDialog<void>();
			list.append(b);
			b.result.reject();
			await a.result.promise;
			await waitFor(() => {
				expect(list.childrenCount).toBe(0);
			});
		});
	});

	describe('dispose', () => {
		it('throws if dialog is still pending', () => {
			expect(() => {
				new CompDialog().dispose();
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Cannot dispose a pending dialog"',
			);
		});

		it('removes itself from the parent (if any)', async () => {
			const list = new CompList<CompDialog<void>>();

			const a = new CompDialog<void>();
			list.append(a);
			a.result.abort();
			await waitFor(() => {
				expect(list.childrenCount).toBe(0);
			});

			const b = new CompDialog<void>();
			b.result.abort();
		});
	});
});

describe('CompDialogBuilder', () => {
	describe('withType', () => {
		it('should return the builder back', () => {
			const builder = new CompDialogBuilder(() => null, {});
			expect(builder.withType()).toBe(builder);
		});
	});

	describe('copy', () => {
		it('should return a new builder', () => {
			const builder = new CompDialogBuilder(() => null, {});
			builder.classList.push('a', 'b');

			const newBuilder = builder.copy();

			expect(newBuilder.content).toBe(builder.content);
			expect(newBuilder.parameters).toBe(builder.parameters);
			expect(newBuilder.classList.join(' ')).toBe('a b');
		});
	});

	describe('append', () => {
		it('adds element to the page', () => {
			const page = new CompPage();
			new CompDialogBuilder(() => <div />, {}).append(page);
			assert(lastRender);
			expect(lastRender.container.childElementCount).toBe(1);
			expect(page.dialogs.childrenCount).toBe(1);
		});
	});
});
