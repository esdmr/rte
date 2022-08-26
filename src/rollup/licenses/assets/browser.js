/* eslint-env browser */
const cleanUpThreshold = 0x40_00;
let currentSize = 0;

for (const element of document.querySelectorAll('details[data-load-url]')) {
	if (!(element instanceof HTMLDetailsElement)) {
		continue;
	}

	const url = element.dataset.loadUrl ?? '';

	if (!url) {
		console.error('Invalid url for', element);
	}

	let isLoading = false;
	let elementSize = 0;

	element.addEventListener('toggle', async () => {
		if (!element.open || isLoading) {
			if (currentSize > cleanUpThreshold) {
				window.dispatchEvent(new CustomEvent('try-clean-up'));
			}

			return;
		}

		const pre = element.querySelector('pre');

		if (!pre) {
			console.error(element, 'has no pre to load file into');
			return;
		}

		try {
			isLoading = true;
			element.ariaBusy = 'true';
			pre.ariaBusy = 'true';
			pre.textContent = 'Loading...';

			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(
					`Fetch failed: ${response.status} ${response.statusText}`,
				);
			}

			const text = await response.text();
			pre.textContent = text;
			elementSize = text.length;
			currentSize += text.length;
		} catch (error) {
			isLoading = false;
			console.error('Error while loading', element, error);
			pre.textContent = 'Failed to load.';
		} finally {
			element.ariaBusy = null;
			pre.ariaBusy = null;
		}
	});

	window.addEventListener('try-clean-up', () => {
		if (element.open || !isLoading) {
			return;
		}

		const pre = element.querySelector('pre');

		if (!pre) {
			return;
		}

		pre.replaceChildren();
		currentSize -= elementSize;
		elementSize = 0;
		isLoading = false;
	});
}
