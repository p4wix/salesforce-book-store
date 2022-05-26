import { LightningElement } from 'lwc';

export default class CustomLogoutButton extends LightningElement {
	handleLogout() {
		this.dispatchEvent(new CustomEvent('logout'));
	}
}
