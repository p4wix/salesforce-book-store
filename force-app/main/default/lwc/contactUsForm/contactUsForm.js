import { LightningElement, track } from 'lwc';
import createContactUsRecord from '@salesforce/apex/ContactUsServices.createContactUsRecord';

export default class ContactUsForm extends LightningElement {
	__error;
	@track contactUsRecord = {
		name: '',
		email: '',
		topic: '',
		message: ''
	};

	// { props: { bookId: this.bookId, amountBook: this.count } }

	// ====================== Setting tmpRecord ======================

	handleChange(event) {
		let value = event.target.value;
		let name = event.target.name;
		this.contactUsRecord[name] = value;
	}

	// ====================== Sending data ======================

	handleSubmitData() {
		createContactUsRecord({ props: this.contactUsRecord })
			.then((result) => {
				console.log('Record Saved ', result);
			})
			.catch((err) => {
				console.log('handleSubmitData Error ', err);
			});
		this.handleResetData();
	}

	// ====================== Clear data ======================

	handleResetData() {
		// Clear inputs
		this.template
			.querySelectorAll('input[data-reset="reset"]')
			.forEach((element) => {
				element.value = null;
			});
	}
}
