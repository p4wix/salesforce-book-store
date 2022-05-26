import { LightningElement } from 'lwc';

export default class CustomCounter extends LightningElement {
	handleIncrement() {
		this.dispatchEvent(new CustomEvent('increment'));
	}

	handleDecrement() {
		this.dispatchEvent(new CustomEvent('decrement'));
	}
}
