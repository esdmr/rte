import type {FunctionComponent} from 'preact';
import {useEffect} from 'preact/hooks';
import {useCompLayer} from './composition/layer.js';

/** @deprecated */
export const AllowScroll: FunctionComponent = () => {
	const layer = useCompLayer();

	useEffect(() => {
		layer.classList.add('scroll');

		return () => {
			layer.classList.remove('scroll');
		};
	}, [layer]);

	return null;
};
