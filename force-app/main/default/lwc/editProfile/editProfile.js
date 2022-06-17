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

	checkPhone(phoneNumber) {
		if (phoneNumber.length === 0) {
			return true;
		}
		let numbers = /^[0-9]+$/;
		if (phoneNumber.match(numbers) && phoneNumber.length === 9) {
			return true;
		}
		return false;
	}

	checkFirstName(name) {
		if (name.length <= 32) {
			return true;
		}
		return false;
	}

	checkEmail(email) {
		if (email.length === 0) {
			return true;
		}
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	}

	checkForm(data) {
		let isFirstNameValid = this.checkFirstName(data.FirstName),
			isLastNameValid = this.checkFirstName(data.LastName),
			isEmailValid = this.checkEmail(data.Email),
			isMailingCityValid = this.checkFirstName(data.MailingCity),
			isPhoneValid = this.checkPhone(data.Phone);

		let isFormValid =
			isFirstNameValid &&
			isLastNameValid &&
			isEmailValid &&
			isMailingCityValid &&
			isPhoneValid;

		console.log(
			isFirstNameValid,
			isLastNameValid,
			isEmailValid,
			isMailingCityValid,
			isPhoneValid
		);

		if (isFormValid) {
			return true;
		}
		return false;
	}

	handleSaveData() {
		let data = {
			FirstName: this.template.querySelector("[data-field='FirstName']")
				.value,
			LastName: this.template.querySelector("[data-field='LastName']").value,
			Email: this.template.querySelector("[data-field='Email']").value,
			MailingCity: this.template.querySelector("[data-field='MailingCity']")
				.value,
			Phone: this.template.querySelector("[data-field='Phone']").value
		};

		const allValid = this.checkForm(data);

		if (allValid) {
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
