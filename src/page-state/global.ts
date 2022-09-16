import {createContext} from 'preact';
import {PageStateNode} from './node.js';

export const rootState = new PageStateNode(undefined, {});
export const pageStateContext = createContext(rootState);

if (import.meta.env.DEV) {
	pageStateContext.displayName = 'pageState';
}
