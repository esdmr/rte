/**
 * In {@link HTMLElement.focus}, `options.focusVisible` is not fully supported
 * everywhere[^1]. This file manually adds a class to handle the styling in CSS.
 *
 * [^1]: https://caniuse.com/mdn-api_htmlelement_focus_options_focusvisible_parameter
 */
/***/
let lastElement: HTMLElement | undefined;
const className = 'focus-visible';

export const removeFocusVisible = () => {
	lastElement?.classList.remove(className);
	lastElement = undefined;
};

export const makeFocusVisible = () => {
	const {activeElement} = document;
	removeFocusVisible();

	if (!(activeElement instanceof HTMLElement)) {
		return;
	}

	activeElement.classList.add(className);
	lastElement = activeElement;
};

export const isFocusVisible = () => {
	return lastElement !== undefined;
};
