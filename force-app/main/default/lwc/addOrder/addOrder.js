import { LightningElement, track, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import getSingleOrder from '@salesforce/apex/getSingleOrderService.getSingleOrder';
import sendEmail from '@salesforce/apex/EmailHandler.sendEmail';

//import ORDER_OBJECT from '@salesforce/schema/Order__c';
import ID_FIELD from '@salesforce/schema/Order__c.Id';
import Email__c from '@salesforce/schema/Order__c.Email__c';
import First_Name__c from '@salesforce/schema/Order__c.First_Name__c';
import Last_Name__c from '@salesforce/schema/Order__c.Last_Name__c';
import Address__c from '@salesforce/schema/Order__c.Address__c';
import Postal_Code__c from '@salesforce/schema/Order__c.Postal_Code__c';
import City__c from '@salesforce/schema/Order__c.City__c';
import Phone__c from '@salesforce/schema/Order__c.Phone__c';
import isOpen__c from '@salesforce/schema/Order__c.isOpen__c';
import Status__c from '@salesforce/schema/Order__c.Status__c';

export default class AddOrder extends NavigationMixin(LightningElement) {
	@track orderRecord = {
		Email__c: '',
		First_Name__c: '',
		Last_Name__c: '',
		Address__c: '',
		Postal_Code__c: null,
		City__c: '',
		Phone__c: null
	};

	@track error;

	@wire(getSingleOrder)
	order;

	handleChange(event) {
		let value = event.target.value;
		let name = event.target.name;
		this.orderRecord[name] = value;
	}

	updateOrder() {
		const allValid = [
			...this.template.querySelectorAll('lightning-input')
		].reduce((validSoFar, inputFields) => {
			inputFields.reportValidity();
			return validSoFar && inputFields.checkValidity();
		}, true);

		console.log('id: ', this.order.data.Id);

		if (allValid) {
			const fields = {};
			fields[ID_FIELD.fieldApiName] = this.order.data.Id;
			fields[Email__c.fieldApiName] = this.orderRecord.Email__c;
			fields[First_Name__c.fieldApiName] = this.orderRecord.First_Name__c;
			fields[Last_Name__c.fieldApiName] = this.orderRecord.Last_Name__c;
			fields[Address__c.fieldApiName] = this.orderRecord.Address__c;
			fields[Postal_Code__c.fieldApiName] = this.orderRecord.Postal_Code__c;
			fields[City__c.fieldApiName] = this.orderRecord.City__c;
			fields[Phone__c.fieldApiName] = this.orderRecord.Phone__c;
			// Close the order
			fields[isOpen__c.fieldApiName] = false;
			fields[Status__c.fieldApiName] = 'In progress';

			const recordInput = { fields };

			updateRecord(recordInput)
				.then((result) => {
					console.log(result.fields.Email__c.value);
					this.sendEmailHandler(result.fields.Email__c.value);
					this.handleResetUsingDataReset();
					this.handleRedirectPage();
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			// The form is not valid
			console.log('Form is not valid');
		}
	}

	handleResetUsingDataReset() {
		this.template
			.querySelectorAll('lightning-input[data-reset="reset"]')
			.forEach((element) => {
				element.value = null;
			});
	}

	handleRedirectPage() {
		this[NavigationMixin.Navigate]({
			type: 'comm__namedPage',
			attributes: {
				name: 'Home'
			}
		});
	}

	sendEmailHandler(email) {
		const dispOrder = `
		<div>
			<h1>Dear ${this.orderRecord.First_Name__c} ${this.orderRecord.Last_Name__c}</h1>
			<h2>Order ${this.order.data.Name}</h2>
			<h3>Status: In progress</h3>
			<p>
				And after all in your free time it would be good if you gave feedback on the book :D</br>
				Under this link ${'https://book-shop-developer-edition.fra19.sfdc-urlt2q.force.com/bookstore'}
			</p>
		</div></br></br>
		Best, BookStore
		`;

		sendEmail({
			toAddress: email,
			subject: `Your order is on the way`,
			body: dispOrder
		});

		console.log(this.orderRecord);
		console.log(this.order.data);
	}
}
