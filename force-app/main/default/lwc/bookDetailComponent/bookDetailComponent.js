/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import fetchBookDetails from '@salesforce/apex/BookDetailLwcService.fetchBookDetails';
import getBookReview from '@salesforce/apex/BookDetailLwcService.getBookReview';
import fetchUserName from '@salesforce/apex/UserUtility.fetchUserName';
import { NavigationMixin } from 'lightning/navigation';

import STAR from '@salesforce/resourceUrl/star';

import createOrder from '@salesforce/apex/OrderBookService.createOrder';

export default class BookDetailComponent extends NavigationMixin(
	LightningElement
) {
	STAR = STAR;

	@api bookId;
	@api source;
	@api reviews;

	__currentPageReference;
	isSpinner = false;

	__bookDetails;

	@wire(CurrentPageReference)
	getCurrentPageReference(val) {
		this.__currentPageReference = val;
	}

	connectedCallback() {
		this.bookId = this.__currentPageReference.state.bookId;
		this.source = this.__currentPageReference.state.source;
		this.fetchBookDetailsJS();
		this.getBookReviewJS();
	}

	fetchBookDetailsJS() {
		this.isSpinner = true;
		fetchBookDetails({ recordId: this.bookId })
			.then((result) => {
				console.log('Result ', result);
				this.__bookDetails = result[0];
				console.log('Result 2', this.__bookDetails);
			})
			.catch((error) => {
				console.error('Error: ', error);
			})
			.finally(() => {
				this.isSpinner = false;
			});
	}

	// ================================ Counter ==============================
	@api count = 1;

	handleincrement() {
		if (this.count < this.__bookDetails.Amount__c) {
			this.count += 1;
		}
	}

	handledecrement() {
		if (this.count > 1) {
			this.count -= 1;
		}
	}

	// ================================ Check for the user ==============================

	guestUser = true;

	@wire(fetchUserName)
	wiredData({ error, data }) {
		if (data) {
			console.log('Data', data);
			if (data.includes('Site Guest User')) {
				this.guestUser = true;
			} else {
				this.guestUser = false;
			}
		} else if (error) {
			console.error('Error:', error);
		}
	}

	// ================================ add to order ==============================

	handleAddToOrder() {
		createOrder({ props: { bookId: this.bookId, amountBook: this.count } })
			.then((result) => {
				console.log('Record Saved ', result);
				let navigationTarget = {
					type: 'comm__namedPage',
					attributes: {
						name: 'cart__c'
					}
				};
				this[NavigationMixin.Navigate](navigationTarget);
			})
			.catch((err) => {
				console.log('Error ', err);
			});
	}

	navigateToPDF() {
		this[NavigationMixin.Navigate](
			{
				type: 'standard__webPage',
				attributes: {
					url: this.__bookDetails.PDF_File__c
				}
			},
			false // Replaces the current page in your browser history with the URL
		);
	}

	// ================================ Reviews ==============================

	hasElements = false;

	getBookReviewJS() {
		getBookReview({ recordId: this.bookId })
			.then((result) => {
				console.log('Revies of that book: ', result);
				this.reviews = result;
				if (this.reviews.length !== 0) {
					this.hasElements = true;
				}
			})
			.catch((err) => {
				console.log('error getBookReviewJS:', err);
			});
	}

	get getReviews() {
		return this.reviews;
	}

	@track avgRatio = 1;
	get getAvgRatio() {
		if (this.hasElements) {
			this.avgRatio =
				this.reviews.reduce((a, b) => a + b.Rate__c, 0) /
				this.reviews.length;
		} else {
			return '';
		}
		return this.avgRatio.toFixed(2);
	}

	// ================================ Update Reviews ==============================

	@track updatedReviews;
	updateReviewsHandler(event) {
		this.updatedReviews = [...event.detail.reviews];
		console.log(this.updatedReviews);
		this.reviews = this.updatedReviews;
		this.hasElements = true;
	}
}
