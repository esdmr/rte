import type {Signal} from '@preact/signals';

declare global {
	/** Used for debugging. Only available in development mode. */
	// eslint-disable-next-line no-var
	var unlockSignal: ((signal: Signal) => void) | undefined;
	/** Used for debugging. Only available in development mode. */
	// eslint-disable-next-line no-var
	var lockSignal: (<T>(signal: Signal<T>, value?: T) => void) | undefined;
}

const signalLockDispose = new Map<Signal, () => void>();

globalThis.unlockSignal = (signal) => {
	signalLockDispose.get(signal)?.();
	signalLockDispose.delete(signal);
};

globalThis.lockSignal = (signal, value = signal.peek()) => {
	signalLockDispose.get(signal)?.();

	signalLockDispose.set(
		signal,
		signal.subscribe((newValue) => {
			if (newValue === value) {
				return;
			}

			queueMicrotask(() => {
				signal.value = value;
			});
		}),
	);

	signal.value = value;
};
