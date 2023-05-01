import {cloneElement, type FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';
import {Switch, type SwitchProps} from 'wouter-preact';
import {navChildToken, useChildToken} from './child-token.js';
import {navUnaryHooks} from './unary.js';
import {NavNode} from './node.js';

/** @deprecated */
export const NavSwitch: FunctionComponent<SwitchProps> = (props) => {
	const childToken = useChildToken();
	const node = useMemo(
		() => NavNode.for(childToken, navUnaryHooks),
		[childToken],
	);

	return (
		<Switch>
			{props.children.map((vnode) =>
				cloneElement(vnode, {
					children: (parameters: any) => (
						<navChildToken.Provider value={node.newChildToken()}>
							{typeof vnode.props.children === 'function'
								? vnode.props.children(parameters)
								: vnode.props.children}
						</navChildToken.Provider>
					),
				}),
			)}
		</Switch>
	);
};

if (import.meta.env.DEV) {
	NavSwitch.displayName = 'WrappedSwitch(Switch)';
}
