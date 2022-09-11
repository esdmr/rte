export const classes = (...names: Array<string | undefined>) => {
	return names.filter(Boolean).join(' ');
};
