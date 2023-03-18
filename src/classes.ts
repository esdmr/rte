export const classes = (...names: Array<string | false | undefined>) =>
	names.filter(Boolean).join(' ');
