import { LightningElement, api } from 'lwc';

export default class BookTile extends LightningElement {
	@api book;

	handleClick(event) {
		event.preventDefault();
		const selectBook = new CustomEvent('select', {
			detail: {
				bookId: this.book.Id
			}
		});
		this.dispatchEvent(selectBook);
	}
}
