import type {InputGuideUpdateEvent, GamepadEvent} from '../gamepad/event.js';

export type EventMap = {
	[GamepadEvent.eventName]: GamepadEvent;
	ChildrenUpdate: Event;
	LayerDispose: Event;
	Refocus: Event;
} & HTMLElementEventMap;

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace preact.JSX {
		export type TargetedGamepadEvent<Target extends EventTarget> =
			TargetedEvent<Target, GamepadEvent>;
		export type GamepadEventHandler<Target extends EventTarget> =
			EventHandler<TargetedGamepadEvent<Target>>;
		export type TargetedInputGuideUpdateEvent<Target extends EventTarget> =
			TargetedEvent<Target, InputGuideUpdateEvent>;
		export type InputGuideUpdateEventHandler<Target extends EventTarget> =
			EventHandler<TargetedInputGuideUpdateEvent<Target>>;

		type CompositorExtraEvents<Target extends EventTarget> = {
			[K in `on${typeof GamepadEvent.eventName}${'' | 'Capture'}`]?:
				| GamepadEventHandler<Target>
				| undefined;
		} & {
			[K in `on${typeof InputGuideUpdateEvent.eventName}${
				| ''
				| 'Capture'}`]?:
				| InputGuideUpdateEventHandler<Target>
				| undefined;
		};

		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/naming-convention
		export interface DOMAttributes<Target extends EventTarget>
			extends PreactDOMAttributes,
				CompositorExtraEvents<Target> {}
	}
}
