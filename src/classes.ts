export const classes = (...names: Array<string | undefined>) =>
	names.filter(Boolean).join(' ');
