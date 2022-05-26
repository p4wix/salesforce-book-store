public without sharing class BookDetailLwcService {

	@AuraEnabled(cacheable=true)
	public static List<Book__c> fetchBookDetails(String recordId) {
		//Book__c bookRecord = new Book__c();
		try {
			return [
				SELECT 
					Id,
					Name,
					Amount__c,
					Author__c,
					Description__c,
					Image__c,
					Image_URL__c,
					ISBN_Code__c,
					Price__c,
					Publishing_company__c,
					Title__c,
					Year_of_publication__c,
					PDF_File__c
				FROM Book__c
				WHERE Id =: recordId
			];
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled(cacheable=false)
	public static List<Review__c> getBookReview(String recordId) {
		Book__c b = [SELECT Id, Name FROM Book__c WHERE Id =: recordId];

		List<Review__c> reviews = [SELECT Id, Name, Rate__c, Opinion__c, Book__c, Book__r.Id 
											FROM Review__c 
											WHERE Book__r.Id =: recordId];
		try {			
			return reviews;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled(cacheable=false)
	public static String createReview(String bookId, String opinion, Integer rate) {
		
		Review__c r = new Review__c();
		r.Book__c = bookId;
		r.Opinion__c = opinion;
		r.Rate__c = rate;

		try {
			insert r;
			return 'Record Saved';
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

} 
