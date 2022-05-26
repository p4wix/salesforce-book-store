import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getBooks from '@salesforce/apex/GetAllBooks.getBooks';
import searchBooks from '@salesforce/apex/GetAllBooks.searchBooks';

export default class BookListComponent extends NavigationMixin(
	LightningElement
) {
	@track books;
	__errors;
	@track visibleBooks;
	@track tmp;

	// ====================== Fetching all books ======================

	@wire(getBooks)
	wiredGetBooks({ error, data }) {
		if (data) {
			console.log('Data', data);
			this.books = data;
			this.__errors = undefined;
		} else if (error) {
			console.error('Error:', error);
			this.books = undefined;
			this.__errors = error;
		}
	}

	// ====================== Pagination ======================

	updateBookHandler(event) {
		this.visibleBooks = [...event.detail.records];
		this.tmp = this.visibleBooks;
		console.log('updateBookHandler');
	}

	// ====================== Search Bar ======================

	searchBookHandler(event) {
		let keyWord = event.detail.keyWord;
		console.log(keyWord);

		searchBooks({ key: keyWord })
			.then((result) => {
				console.log('key word result:', result);
				this.visibleBooks = result;
			})
			.catch((err) => {
				console.log('error', err);
			});
	}

	// ====================== Book Detail ======================

	handleBookClick = (e) => {
		e.preventDefault();
		let selectedBookId = e.detail.bookId;

		let navigationTarget = {
			type: 'comm__namedPage',
			attributes: {
				name: 'bookDetails__c'
			},
			state: {
				bookId: selectedBookId,
				source: 'bookListPage'
			}
		};

		this[NavigationMixin.Navigate](navigationTarget);
	};

	// ====================== Option choise ======================

	optionChoiseHandler(event) {
		let selectedValue = event.detail.selectedValue;
		console.log(selectedValue);

		switch (selectedValue) {
			case 'most_popular':
				try {
					this.visibleBooks.sort(this.sortBySold);
				} catch (error) {
					console.log('error', error);
				}
				break;
			case 'lower':
				try {
					this.visibleBooks.sort(this.sortByPriceDESC);
				} catch (error) {
					console.log('error', error);
				}
				break;
			case 'higher':
				try {
					this.visibleBooks.sort(this.sortByPriceASC);
				} catch (error) {
					console.log('error', error);
				}
				break;
			case 'default':
				try {
					this.visibleBooks.sort(this.sortByAmount);
				} catch (error) {
					console.log('error', error);
				}
				break;
			default:
		}
	}

	sortBySold(a, b) {
		return b.Sold__c - a.Sold__c;
	}

	sortByPriceASC(a, b) {
		return b.Price__c - a.Price__c;
	}

	sortByPriceDESC(a, b) {
		return a.Price__c - b.Price__c;
	}

	sortByAmount(a, b) {
		return b.Amount__c - a.Amount__c;
	}
}
