import { LightningElement, api } from 'lwc';

export default class Pagination extends LightningElement {
	currentPage = 1;
	totalRecords;
	recordSize = 12;
	visibleRecords;
	totalPage = 0;

	@api
	set records(data) {
		if (data) {
			this.totalRecords = data;
			this.totalPage = Math.ceil(data.length / this.recordSize);
			this.updateRecords();
		}
	}

	get records() {
		return this.visibleRecords;
	}

	get disablePrevious() {
		return this.currentPage <= 1;
	}

	get disableNext() {
		return this.currentPage >= this.totalPage;
	}

	previusHandler() {
		if (this.currentPage > 1) {
			this.currentPage -= 1;
			this.updateRecords();
		}
	}

	nextHandler() {
		if (this.currentPage < this.totalPage) {
			this.currentPage += 1;
			this.updateRecords();
		}
	}

	updateRecords() {
		console.log('first');
		const start = (this.currentPage - 1) * this.recordSize;
		const end = this.recordSize * this.currentPage;
		this.visibleRecords = this.totalRecords.slice(start, end);
		this.dispatchEvent(
			new CustomEvent('update', {
				detail: {
					records: this.visibleRecords
				}
			})
		);
	}
}
