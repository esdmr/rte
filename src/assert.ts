export default function assert(
	condition: unknown,
	description: string,
): asserts condition {
	if (!condition) {
		throw new Error(`Assertion failed: ${description}`);
	}
}
