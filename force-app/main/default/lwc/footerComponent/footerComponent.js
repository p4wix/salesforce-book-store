import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import LOGO from '@salesforce/resourceUrl/img';

export default class FooterComponent extends NavigationMixin(LightningElement) {
	LOGO = LOGO;
	handleRefClickHome = (e) => {
		e.preventDefault();

		let navigationTarget = {
			type: 'comm__namedPage',
			attributes: {
				name: 'Home'
			}
		};

		this[NavigationMixin.Navigate](navigationTarget);
	};

	handleRefClickAllBooks(e) {
		e.preventDefault();

		let navigationTarget = {
			type: 'comm__namedPage',
			attributes: {
				name: 'allBooks__c'
			}
		};

		this[NavigationMixin.Navigate](navigationTarget);
	}
}
