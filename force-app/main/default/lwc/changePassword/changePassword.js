import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import resetPassword from '@salesforce/apex/UserUtility.resetPassword';

export default class ChangePassword extends NavigationMixin(LightningElement) {
	handleClick() {
		let data = {
			oldPassword: this.template.querySelector("[data-field='oldPassword']")
				.value,
			newPassword: this.template.querySelector("[data-field='newPassword']")
				.value,
			verifyNewPassword: this.template.querySelector(
				"[data-field='verifyNewPassword']"
			).value
		};
		resetPassword({
			oldPassword: data.oldPassword,
			newPassword: data.newPassword,
			verifyNewPassword: data.verifyNewPassword
		});
		this.handleNavigate();
	}

	handleNavigate() {
		this[NavigationMixin.Navigate]({
			type: 'comm__namedPage',
			attributes: {
				name: 'EditProfile__c'
			}
		});
	}
}
