export const main = () => {
	const githubUrlMatch = location.hostname.endsWith('.github.io')
		? /^(?<repo>\/[^/#?]+)(?<path>\/.*)?$/.exec(location.pathname)
		: null;
	const {repo = '', path = '/'} = githubUrlMatch?.groups ?? {};

	const base = repo + '/';
	const pathname = repo ? path : location.pathname;

	const url = new URL(base, location.href);
	url.hash = '#' + pathname;
	location.replace(url);
};

if (!import.meta.vitest) {
	main();
}
