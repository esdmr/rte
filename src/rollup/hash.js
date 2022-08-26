import {createHash} from 'node:crypto';

/** @param {import('rollup').OutputAsset | import('rollup').OutputChunk} output */
export function getOutputHash(output) {
	const dotIndex = output.fileName.lastIndexOf('.');

	if (dotIndex === -1) {
		throw new RangeError('Expected asset to have an extension');
	}

	const name = output.fileName.slice(0, dotIndex);

	const hash = createHash('sha256')
		.update(name)
		.update(':')
		.update(output.type === 'chunk' ? output.code : output.source)
		.digest('hex');

	const integrity
		= 'sha256-'
		+ createHash('sha256')
			.update(output.type === 'chunk' ? output.code : output.source)
			.digest('base64');

	return {
		name,
		hash,
		integrity,
		shortHash: hash.slice(0, 8),
	};
}
