export type GamepadType =
	| `playstation-${'3' | '4' | '5'}`
	| 'xbox'
	| `switch-${'l' | 'r' | 'pro'}`;

type Database = ReadonlyArray<{
	/** The regexp may have neither the global (`g`) nor the sticky (`y`) flags. */
	readonly pattern: RegExp;
	readonly is: GamepadType;
}>;

/**
 * The following database of gamepads is originally compiled from [Gamepad
 * Tester][]'s list of “Top controllers” and [Device Hunt][].
 *
 * There may be some wrong or missing entries in the database. If you would like
 * to fix that, please [send an issue][] containing the id of the gamepad. If
 * you can, please also test the same device in both firefox and chrome. The
 * browsers may have some differences in reporting the id (specially in linux).
 *
 * My sincerest apologies to those unfamiliar with the accursed RegExp.
 *
 * [Gamepad Tester]: https://gamepad-tester.com/
 * [Device Hunt]: https://devicehunt.com/
 * [send an issue]: https://github.com/esdmr/rte/issues/new?labels=gamepad%20database
 */
const database: Database = [
	// Matches: 054c:0268, 054c:0cda
	{pattern: /\b054c\b.*?\b0(?:268|cda)\b/i, is: 'playstation-3'},

	// Matches: 0810:0001, 0810:0003
	{pattern: /\b0810\b.*?\b000[13]\b/i, is: 'playstation-3'},

	// Matches: 054c:05c4, 054c:09cc, 054c:0ba0
	{pattern: /\b054c\b.*?\b0(?:5c4|9cc|ba0)\b/i, is: 'playstation-4'},

	{pattern: /\b054c\b.*?\b0ce6\b/i, is: 'playstation-5'},
	{pattern: /\b057e\b.*?\b2006\b/i, is: 'switch-l'},
	{pattern: /\b057e\b.*?\b2007\b/i, is: 'switch-r'},

	// Matches: 057e:2009, 057e:200e
	{pattern: /\b057e\b.*?\b200[9e]\b/i, is: 'switch-pro'},

	// Matches: 045e:0202, 045e:0285, 045e:0288, 045e:0289, 045e:028e,
	// 045e:028f, 045e:0291, 045e:02a1, 045e:02d1, 045e:02dd, 045e:02e3,
	// 045e:02e6, 045e:02ea, 045e:02fd, 045e:0719, 045e:0b12
	{
		pattern:
			/\b045e\b.*?\b0(?:202|28[589ef]|291|2a1|2d[1d]|2e[36a]|2fd|719|b12)\b/i,
		is: 'xbox',
	},

	// PlayStation or its shorthand ‘ps’, followed by an optional trademark sign,
	// optional space, and type: x, 1, 2, 3, or classic.
	{
		pattern: /\b(?:playstation|ps)(?:\(r\))? ?(?:[x123]|classic)\b/i,
		is: 'playstation-3',
	},

	// PlayStation, its shorthand ‘ps’, or DualShock, followed by an optional
	// trademark sign, optional space, and the digit 4.
	{
		pattern: /\b(?:playstation|ps|dualshock)(?:\(r\))? ?4\b/i,
		is: 'playstation-4',
	},

	{pattern: /\bdualsense\b/i, is: 'playstation-5'},

	// PlayStation or its shorthand ‘ps’, followed by an optional
	// trademark sign, optional space, and the digit 5.
	{pattern: /\b(?:playstation|ps)(?:\(r\))? ?5\b/i, is: 'playstation-5'},

	{pattern: /\bjoy-con l\b/i, is: 'switch-l'},
	{pattern: /\bjoy-con r\b/i, is: 'switch-r'},
	{pattern: /\bpro controller\b/i, is: 'switch-pro'},
	{pattern: /\bswitch pro\b/i, is: 'switch-pro'},
	{pattern: /\bx-?box\b/i, is: 'xbox'},
	{pattern: /\bxinput\b/i, is: 'xbox'},
];

const gamepadTypesCache = new Map<string, GamepadType | undefined>();

export const detectGamepadType = (id: string): GamepadType | undefined => {
	if (gamepadTypesCache.has(id)) {
		return gamepadTypesCache.get(id);
	}

	const type = database.find(({pattern}) => pattern.test(id))?.is;

	gamepadTypesCache.set(id, type);

	return type;
};
