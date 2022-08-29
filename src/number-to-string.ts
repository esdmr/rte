const numberFormat = /* @__PURE__ */ new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 20,
	notation: 'standard',
	useGrouping: false,
});

export function numberToString(number: number) {
	return numberFormat.format(number);
}
