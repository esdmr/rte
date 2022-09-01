export function useClass(...classes: Array<string | undefined>) {
	return classes.filter(Boolean).join(' ');
}
