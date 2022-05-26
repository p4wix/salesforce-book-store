import { LightningElement, api } from 'lwc';

export default class ShoppingCartItem extends LightningElement {
	@api item;

	handleClick(event) {
		event.preventDefault();
		const removeBookOrder = new CustomEvent('remove', {
			detail: {
				bookId: event.target.dataset.id
			}
		});
		this.dispatchEvent(removeBookOrder);
	}

	handleChange(event) {
		event.preventDefault();
		const changeAmount = new CustomEvent('changeinput', {
			detail: {
				bookId: event.target.dataset.id,
				amount: event.target.value
			}
		});
		this.dispatchEvent(changeAmount);
	}

	get getItemPrice() {
		return (
			parseInt(this.item.Book__r.Price__c, 10) *
			parseInt(this.item.Amount_of_book__c, 10)
		);
	}
}
