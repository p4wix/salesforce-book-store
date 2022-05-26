import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import USER_IMG from '@salesforce/resourceUrl/user_img';
import getCurrentContact from '@salesforce/apex/UserUtility.getCurrentContact';
import updateContact from '@salesforce/apex/UserUtility.updateContact';

//import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
//import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
//import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
//import MAILING_CITY_FIELD from '@salesforce/schema/Contact.MailingCity';
//import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
//import ID_FIELD from '@salesforce/schema/Contact.Id';

export default class EditProfile extends NavigationMixin(LightningElement) {
	USER_IMG = USER_IMG;
	// Temporary
	@track contactToUpdate = {
		FirstName: '',
		LastName: '',
		Email: '',
		MailingCity: '',
		Phone: ''
	};

	@track data;
	__errors;
	//From database

	connectedCallback() {
		getCurrentContact({})
			.then((response) => {
				this.data = response;
				//this.data.push(response);
				console.log('Response: ', response);
				console.log('data: ', typeof this.data);
				console.log('id: ', this.data.Id);
			})
			.catch((error) => {
				console.log('Error: ' + error.body.message);
				this.__errors = error;
			});
	}
	//handleChange(event) {
	//	let value = event.target.value;
	//	let name = event.target.name;
	//	this.contactToUpdate[name] = value;
	//}

	handleSaveData() {
		const allValid = [
			...this.template.querySelectorAll('lightning-input')
		].reduce((validSoFar, inputFields) => {
			inputFields.reportValidity();
			return validSoFar && inputFields.checkValidity();
		}, true);

		if (allValid) {
			let data = {
				FirstName: this.template.querySelector("[data-field='FirstName']")
					.value,
				LastName: this.template.querySelector("[data-field='LastName']")
					.value,
				Email: this.template.querySelector("[data-field='Email']").value,
				MailingCity: this.template.querySelector(
					"[data-field='MailingCity']"
				).value,
				Phone: this.template.querySelector("[data-field='Phone']").value
			};

			updateContact({ data })
				.then((result) => {
					console.log(result);
					this.handleResetUsingDataReset();
					return getCurrentContact();
				})
				.then((response) => {
					this.data = response;
				})
				.catch((error) => console.log(error));
		} else {
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

	handleChangePassClick() {
		this[NavigationMixin.Navigate]({
			type: 'comm__namedPage',
			attributes: {
				name: 'ChangePassword__c'
			}
		});
	}

	get getContact() {
		return this.data;
	}
}
