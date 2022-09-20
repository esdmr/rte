import {createContext} from 'preact';
import {useContext} from 'preact/hooks';
import {PageStateNode} from './node.js';

export const rootState = new PageStateNode(undefined, {});
export const pageStateContext = createContext(rootState);

if (import.meta.env.DEV) {
	pageStateContext.displayName = 'pageState';
}

export const usePageState = () => useContext(pageStateContext);
