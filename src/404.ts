export const main = () => {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	const pathname = location.pathname.startsWith(base)
		? location.pathname.slice(base.length) || '/'
		: '/';

	const url = new URL(base, location.origin);
	url.hash = '#' + pathname;
	location.replace(url);
};

if (!import.meta.vitest) {
	main();
}
