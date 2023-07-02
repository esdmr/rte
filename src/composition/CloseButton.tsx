import {mdiArrowLeft, mdiClose} from '@mdi/js';
import {Icon} from '@mdi/react';
import {type FunctionComponent} from 'preact';
import {CircularButton} from '../CircularButton.js';
import assert from '../assert.js';
import {useCompLayer} from './layer.js';
import {CompPageContent} from './page-content.js';
import {CompPage} from './page.js';
import {CompDialog} from './dialog.js';

const closePage = (layer: CompPageContent) => () => {
	const page = layer.findNearest(CompPage);
	assert(page, 'Not in a page');
	page.dispose();
};

const closeDialog = (layer: CompDialog<unknown>) => () => {
	layer.result.abort('CloseButton clicked');
};

export const CloseButton: FunctionComponent = () => {
	const layer = useCompLayer();

	if (layer instanceof CompPageContent) {
		return layer.showPageCloseButton ? (
			<CircularButton onClick={closePage(layer)} title="Back">
				<Icon path={mdiArrowLeft} />
			</CircularButton>
		) : null;
	}

	if (layer instanceof CompDialog) {
		return (
			<CircularButton onClick={closeDialog(layer)} title="Close">
				<Icon path={mdiClose} />
			</CircularButton>
		);
	}

	throw new TypeError('CloseButton outside a page or dialog');
};
