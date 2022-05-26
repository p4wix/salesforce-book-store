import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import isGuest from '@salesforce/user/isGuest';
import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';
import LOGO from '@salesforce/resourceUrl/img';
import CART from '@salesforce/resourceUrl/cart';
import HAMBURGER from '@salesforce/resourceUrl/hamburger';
import XICON from '@salesforce/resourceUrl/xicon';
import basePath from '@salesforce/community/basePath';

export default class NavigationMenu extends NavigationMixin(LightningElement) {
	XICON = XICON;
	HAMBURGER = HAMBURGER;
	LOGO = LOGO;
	CART = CART;

	@track error;
	@track name;
	@wire(getRecord, {
		recordId: USER_ID,
		fields: [NAME_FIELD]
	})
	wireuser({ error, data }) {
		if (error) {
			this.error = error;
		} else if (data) {
			this.name = data.fields.Name.value;
		}
	}

	get isGuest() {
		return isGuest;
	}

	handleClick = (e) => {
		e.preventDefault();

		console.log(e.target.dataset.page);
		let link = e.target.dataset.page;

		let navigationTarget = {
			type: 'comm__namedPage',
			attributes: {
				name: String(link)
			}
		};

		this[NavigationMixin.Navigate](navigationTarget);
	};

	handleLogoutClick() {
		const path = basePath.replace('/s', '');
		window.open(`${path}/secur/logout.jsp?retUrl=${basePath}`, '_self');
	}

	// ================================ Mobile fun ==============================

	handleOpenMobileMenu() {
		const hamburgerElement = this.template.querySelector('.hamburger');
		const crossElement = this.template.querySelector('.cross');
		const menuElement = this.template.querySelector('.menu-wrap');

		menuElement.style.display = 'flex';
		menuElement.classList.add('active');

		hamburgerElement.style.display = 'none';
		crossElement.style.display = 'block';
	}

	handleCloseMobileMenu() {
		const hamburgerElement = this.template.querySelector('.hamburger');
		const crossElement = this.template.querySelector('.cross');
		const menuElement = this.template.querySelector('.menu-wrap');

		menuElement.style.display = 'none';
		menuElement.classList.remove('active');

		hamburgerElement.style.display = 'block';
		crossElement.style.display = 'none';
	}
}
