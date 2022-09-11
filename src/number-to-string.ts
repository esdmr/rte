import assert from './assert.js';

const numberFormat = /* @__PURE__ */ new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 20,
	notation: 'standard',
	useGrouping: false,
});

export const numberToString = (number: number) => {
	assert(Number.isFinite(number), 'number must be finite');

	return numberFormat.format(number);
};
