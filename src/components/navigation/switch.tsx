import {cloneElement, type FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';
import {Switch, type SwitchProps} from 'wouter-preact';
import {useChildToken} from './child-token.js';
import {navColumnHooks} from './column.js';
import {navigation} from './context.js';
import {NavNode} from './node.js';

export const NavSwitch: FunctionComponent<SwitchProps> = (props) => {
	const childToken = useChildToken();
	const node = useMemo(() => NavNode.for(childToken, navColumnHooks), []);

	return (
		<Switch>
			{props.children.map((vnode) =>
				cloneElement(vnode, {
					children: (parameters: any) => (
						<navigation.Provider value={node.newChildToken()}>
							{typeof vnode.props.children === 'function'
								? vnode.props.children(parameters)
								: vnode.props.children}
						</navigation.Provider>
					),
				}),
			)}
		</Switch>
	);
};

if (import.meta.env.DEV) {
	NavSwitch.displayName = 'WrappedSwitch(Switch)';
}
