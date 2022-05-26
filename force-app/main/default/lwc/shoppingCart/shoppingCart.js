import { LightningElement, track } from 'lwc';
import getBookOrders from '@salesforce/apex/OrderBookService.getBookOrders';
import { deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

//import BOOK_ORDER_OBJECT from '@salesforce/schema/BookOrder__c';
import ID_FIELD from '@salesforce/schema/BookOrder__c.Id';
import Amount_of_book__c from '@salesforce/schema/BookOrder__c.Amount_of_book__c';

export default class ShoppingCart extends NavigationMixin(LightningElement) {
	@track data = [];
	__errors;

	connectedCallback() {
		getBookOrders({})
			.then((response) => {
				this.data = response;
				console.log(response);
				console.log('data ', this.data);
			})
			.catch((error) => {
				console.log('Error: ' + error.body.message);
			});
	}

	// ================================  ==============================

	handleOnChangeInput(event) {
		const fields = {};

		fields[ID_FIELD.fieldApiName] = event.detail.bookId;
		fields[Amount_of_book__c.fieldApiName] = event.detail.amount;

		const recordInput = {
			fields: fields
		};

		updateRecord(recordInput)
			.then((result) => {
				console.log('Result ', result);
				getBookOrders({})
					.then((response) => {
						this.data = response;
						console.log('response ', response);
						console.log('data ', this.data);
					})
					.catch((error) => {
						console.log('Error: ' + error.body.message);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleClickRemoveBtn(event) {
		let deleteId = event.detail.bookId; //to co przychodzi z eventu z shoppingCardItem
		console.log(deleteId);
		deleteRecord(deleteId)
			.then(() => {
				// To delete the record from UI
				for (let i in this.data) {
					if (this.data[i].Id === deleteId) {
						this.data.splice(i, 1);
						break;
					}
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	get getData() {
		return this.data;
	}

	get getTotalPrice() {
		return this.data.reduce(
			(acc, v) =>
				acc +
				parseInt(v.Book__r.Price__c, 10) *
					parseInt(v.Amount_of_book__c, 10),
			0
		);
	}

	handleClick(e) {
		if (this.data.length !== 0) {
			e.preventDefault();
			let navigationTarget = {
				type: 'comm__namedPage',
				attributes: {
					name: 'addOrder__c'
				}
			};

			this[NavigationMixin.Navigate](navigationTarget);
		} else {
			console.log('pusty koszyk');
		}
	}
}
