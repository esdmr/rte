if (typeof document.body.inert !== 'boolean') {
	await import('wicg-inert');
}

if (import.meta.env.DEV && typeof Element.prototype.animate !== 'function') {
	class AnimationStub {
		constructor(
			// eslint-disable-next-line @typescript-eslint/ban-types
			readonly keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
			readonly options?: number | KeyframeAnimationOptions | undefined,
		) {}
	}

	const animations = new WeakMap<Element, AnimationStub[]>();

	Element.prototype.animate = function (keyframes, options) {
		const instance = new AnimationStub(keyframes, options);

		if (animations.has(this)) {
			animations.get(this)!.push(instance);
		} else {
			animations.set(this, [instance]);
		}

		return instance as unknown as Animation;
	};

	Element.prototype.getAnimations = function () {
		return (animations.get(this) ?? []) as unknown as Animation[];
	};
}
