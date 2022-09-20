import type {FunctionComponent} from 'preact';
import {useEffect, useMemo} from 'preact/hooks';
import {pageStateContext, usePageState} from './global.js';
import {PageStateNode} from './node.js';

export const DebugPageNode: FunctionComponent = ({children}) => {
	const parentPageState = usePageState();
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
