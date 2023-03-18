declare module 'get-pkg-repo' {
	function getPkgRepo(pkg: unknown): {browse(): string};
	export = getPkgRepo;
}
