import { LightningElement, track } from 'lwc';
import getUserOrders from '@salesforce/apex/OrderBookService.getUserOrders';

const columns = [
	{ label: 'Name', fieldName: 'Name' },
	{ label: 'Order Date', fieldName: 'Date', type: 'date' },
	{ label: 'Price', fieldName: 'Price', type: 'currency' },
	{ label: 'Status', fieldName: 'Status' }
];

export default class OrderList extends LightningElement {
	columnsList = columns;
	error;
	@track result;

	connectedCallback() {
		this.getUserOrdersFromApex();
	}

	getUserOrdersFromApex() {
		getUserOrders()
			.then((data) => {
				console.log('Data', data);
				data.forEach((order) => {
					order.Date = order.Order_Date__c;
					order.Status = order.Status__c;
					order.Price = order.Book_Orders__r.reduce(
						(acc, v) => acc + v.Book__r.Price__c * v.Amount_of_book__c,
						0
					);
				});
				this.result = data;
				this.error = undefined;
			})
			.catch((error) => {
				this.result = undefined;
				this.error = error;
				console.error('Error:', error);
			});
	}

	get getResult() {
		return this.result;
	}
}
