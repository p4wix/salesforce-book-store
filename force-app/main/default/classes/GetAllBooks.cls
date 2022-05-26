public with sharing class GetAllBooks {
	@AuraEnabled(cacheable=true)
	public static List<Book__c> getBooks() {
		try {
			List<Book__c> bookList = [
				SELECT 
					Id,
					Name,
					Title__c,
					Author__c,
					Price__c,
					ISBN_Code__c,
					Description__c,
					Image__c,
					Image_URL__c,
					Amount__c,
					Sold__c
				FROM Book__c
				WHERE Amount__c > 0
			];
			return bookList;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled(cacheable=false)
	public static List<Book__c> searchBooks(String key) {
		String keyString = '%' + key + '%';
		List<Book__c> books = new List<Book__c>();
		
		if (key == '') {
			books = [
				SELECT 
					Id,
					Name,
					Title__c,
					Author__c,
					Price__c,
					ISBN_Code__c,
					Description__c,
					Image__c,
					Image_URL__c,
					Amount__c,
					Sold__c
				FROM Book__c
				WHERE Amount__c > 0
			];
		}
		else {
			books = [
				SELECT 
					Id,
					Name,
					Title__c,
					Author__c,
					Price__c,
					ISBN_Code__c,
					Description__c,
					Image__c,
					Image_URL__c,
					Amount__c,
					Sold__c
				FROM Book__c
				WHERE Amount__c > 0 AND Title__c LIKE:keyString
			];
		}
		try {
			return books;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
