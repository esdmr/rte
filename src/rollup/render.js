import {minify} from 'html-minifier';
import {renderToString} from 'preact-render-to-string';

/**
 * @param {import('preact').VNode} vNode
 */
export default function render(vNode) {
	return (
		minify('<!DOCTYPE html>' + renderToString(vNode), {
			caseSensitive: false,
			collapseBooleanAttributes: true,
			collapseWhitespace: true,
			decodeEntities: true,
			removeAttributeQuotes: true,
			removeRedundantAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
		}) + '\n'
	);
}
