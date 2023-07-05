import type {InputGuideEntry} from './InputGuide.js';
import type {GamepadClone} from './diff.js';

export class GamepadEvent extends Event {
	static get eventName() {
		return 'Gamepad' as const;
	}

	constructor(readonly gamepads: readonly GamepadClone[]) {
		super(GamepadEvent.eventName, {
			bubbles: true,
			composed: true,
		});
	}
}

export class InputGuideUpdateEvent extends Event {
	static get eventName() {
		return 'InputGuideUpdate' as const;
	}

	readonly entries: InputGuideEntry[] = [];

	constructor() {
		super(InputGuideUpdateEvent.eventName, {
			bubbles: true,
			composed: true,
			cancelable: true,
		});
	}
}
