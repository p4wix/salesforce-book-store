import { LightningElement } from 'lwc';

export default class SearchBookComponent extends LightningElement {
	keyWord = '';
	selectedValue;

	handleKeyChange(event) {
		this.keyWord = event.target.value;
		this.dispatchEvent(
			new CustomEvent('search', {
				detail: {
					keyWord: this.keyWord
				}
			})
		);
	}

	handleClearInput() {
		this.keyWord = '';
	}

	handleSelect(event) {
		this.selectedValue = event.target.value;
		this.dispatchEvent(
			new CustomEvent('choise', {
				detail: {
					selectedValue: this.selectedValue
				}
			})
		);
	}
}
