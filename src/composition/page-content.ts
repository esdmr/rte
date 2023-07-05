import {CompLayer} from './layer.js';
import * as css from './page.module.css';

export class CompPageContent extends CompLayer {
	showPageCloseButton = true;

	constructor(element?: HTMLElement) {
		super(element);
		this.classList.add(css.pageContent);
	}
}
