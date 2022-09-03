export default function assert(condition: boolean, description: string): asserts condition {
	if (!condition) {
		throw new Error(`Assertion failed: ${description}`);
	}
}
