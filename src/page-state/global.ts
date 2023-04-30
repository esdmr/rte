import {createContext} from 'preact';
import {useContext} from 'preact/hooks';
import {PageStateNode} from './node.js';

declare global {
	/**
	 * Used for debugging. Only available in development mode.
	 * @deprecated
	 */
	// eslint-disable-next-line no-var
	var rootPageState: PageStateNode | undefined;
}

/** @deprecated */
export const rootState = new PageStateNode(undefined, {});
/** @deprecated */
export const pageStateContext = createContext(rootState);

if (import.meta.env.DEV) {
	pageStateContext.displayName = 'pageState';
	globalThis.rootPageState = rootState;
}

/** @deprecated */
export const usePageState = () => useContext(pageStateContext);
