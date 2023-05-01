import type {FunctionComponent} from 'preact';
import {useEffect} from 'preact/hooks';
import {useCompLayer} from './composition/layer.js';
import * as css from './AllowScroll.module.css';

/** @deprecated */
export const AllowScroll: FunctionComponent = () => {
	const layer = useCompLayer();

	useEffect(() => {
		layer.classList.add(css.scroll);

		return () => {
			layer.classList.remove(css.scroll);
		};
	}, [layer]);

	return null;
};
