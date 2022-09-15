import type {FunctionComponent} from 'preact';
import {useContext, useMemo, useEffect} from 'preact/hooks';
import {pageStateContext} from './global.js';
import {PageStateNode} from './node.js';

export const DebugPageNode: FunctionComponent = ({children}) => {
	const parentPageState = useContext(pageStateContext);
	const pageState = useMemo(
		() => new PageStateNode(parentPageState, {}),
		[parentPageState],
	);

	useEffect(() => {
		parentPageState.child = pageState;

		return () => {
			pageState.dispose();
		};
	}, [parentPageState]);

	return (
		<pageStateContext.Provider value={pageState}>
			{children}
		</pageStateContext.Provider>
	);
};
