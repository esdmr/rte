import {createContext} from 'preact';
import {useContext} from 'preact/hooks';
import {PageStateNode} from './node.js';

declare global {
	/** Used for debugging. Only available in development mode. */
	// eslint-disable-next-line no-var
	var rootPageState: PageStateNode | undefined;
}

export const rootState = new PageStateNode(undefined, {});
export const pageStateContext = createContext(rootState);

if (import.meta.env.DEV) {
	pageStateContext.displayName = 'pageState';
	globalThis.rootPageState = rootState;
}

export const usePageState = () => useContext(pageStateContext);
