import { LightningElement, api } from 'lwc';
import createReview from '@salesforce/apex/BookDetailLwcService.createReview';
import getBookReview from '@salesforce/apex/BookDetailLwcService.getBookReview';

export default class AddReviewComponent extends LightningElement {
	currentRate;
	currentMessage;
	@api bookId;
	@api getBookReview;

	handleChange(e) {
		this.currentMessage = e.target.value;
	}

	handleRateClick(event) {
		let divElements = [
			...this.template.querySelectorAll('div[data-circle="ratio"]')
		];

		// sprawdzam czy juz jakas klasa ma active jak tak to zdejmuje
		divElements.forEach((item) => {
			if (item.classList.contains('active')) {
				item.classList.remove('active');
			}
		});

		// dodaje klase kliknietemu elementowi
		event.target.classList.add('active');

		// zapisuje current rate
		this.currentRate = event.target.innerText;
	}

	//reviews;

	handleCreateReview() {
		createReview({
			bookId: this.bookId,
			opinion: this.currentMessage,
			rate: this.currentRate
		})
			.then((result) => {
				console.log('record saved: ', result);
				getBookReview({ recordId: this.bookId })
					.then((data) => {
						console.log('reviews po dodaniu nowego: ', data);
						//this.reviews = data;
						this.handleClearInput();
						const updateReviews = new CustomEvent('updatereview', {
							detail: {
								reviews: data
							}
						});
						this.dispatchEvent(updateReviews);
					})
					.catch((err) => {
						console.log('error getBookReviewJS:', err);
					});
			})
			.catch((err) => {
				console.log('errorrr: ', err);
			});
	}

	handleClearInput() {
		this.template.querySelector('textarea[data-clear="clear"]').value = null;
	}
}
