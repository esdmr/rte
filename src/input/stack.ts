export type InputMode = {
	onKeyDown?(event: KeyboardEvent): boolean;
	onFocusIn?(event: FocusEvent): boolean;
};

const stack: InputMode[] = [];

const onKeyDown = (event: KeyboardEvent) => {
	for (const mode of iterateStack()) {
		if (mode.onKeyDown?.(event)) {
			return;
		}
	}
};

const onFocusIn = (event: FocusEvent) => {
	for (const mode of iterateStack()) {
		if (mode.onFocusIn?.(event)) {
			return;
		}
	}
};

const enabledEvents = new Map<string, boolean>();

const toggleEvent = <T extends keyof HTMLElementEventMap>(
	name: T,
	enabled: boolean,
	handler: (event: HTMLElementEventMap[T]) => void,
) => {
	if (enabled === enabledEvents.get(name)) {
		return;
	}

	if (enabled) {
		document.body.addEventListener(name, handler);
	} else {
		document.body.removeEventListener(name, handler);
	}

	enabledEvents.set(name, enabled);
};

const updateEvents = () => {
	let keyDownHandlerFound = false;
	let focusInHandlerFound = false;

	for (const item of stack) {
		if (item.onKeyDown) {
			keyDownHandlerFound = true;
		}

		if (item.onFocusIn) {
			focusInHandlerFound = true;
		}
	}

	toggleEvent('keydown', keyDownHandlerFound, onKeyDown);
	toggleEvent('focusin', focusInHandlerFound, onFocusIn);
};

export const push = (mode: InputMode) => {
	stack.push(mode);
	updateEvents();
};

export const pop = () => {
	stack.pop();
	updateEvents();
};

function* iterateStack() {
	for (let index = stack.length - 1; index >= 0; index--) {
		yield stack[index]!;
	}
}
