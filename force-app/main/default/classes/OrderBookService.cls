public without sharing class OrderBookService {

	class HelperClassCreateOrder {
		@AuraEnabled
		public String bookId{get; set; }

		@AuraEnabled
		public Integer amountBook{get; set; }
	}

	 @AuraEnabled
	 public static String createOrder(HelperClassCreateOrder props) {
		 
		User user = [SELECT Contact.Id, Contact.Email FROM User WHERE Id =: UserInfo.getUserId()];
		
		try {
			// docelowo dla każego usera otwarte jest jedno zamówienie?
			List<Order__c> openOrder = [SELECT
												Id,
												isOpen__c,
												Contact__r.Id
											FROM Order__c 
											WHERE
											isOpen__c = true AND Contact__r.Id =: user.Contact.id];

			if (openOrder.isEmpty()) { // kiedy tworzymy pierwsze zamówienie
				Order__c order = new Order__c();
				order.Contact__c = user.Contact.Id;
				order.Order_Date__c = Date.today();
				order.Status__c = 'New';
				order.isOpen__c = true;
				insert order;

				// kiedy klikam add to order to zawsze będzie odrazu conajmniej jedna ksiażka
				BookOrder__c bookOrder = new BookOrder__c();
				bookOrder.Order__c = order.id; // połączenie lookup z orderem
				bookOrder.Book__c = props.bookId; // połączenie lookup z wybraną książką
				bookOrder.Amount_of_book__c = props.amountBook; // ilość tej książki
				insert bookOrder;

				return order.Id;
			} 
			else { // kiedy dodajemy do istniejącego zamówienia 
				BookOrder__c bookOrder = new BookOrder__c();
				bookOrder.Order__c = openOrder[0].Id;
				bookOrder.Book__c = props.bookId;
				bookOrder.Amount_of_book__c = props.amountBook;
				insert bookOrder;
			}
		}
		catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}

		return 'Work';
	}

	 @AuraEnabled(cacheable=false)
	 public static List<Order__c> getUserOrders() {
		User user = [SELECT Contact.Id FROM User WHERE Id = :UserInfo.getUserId()];
		List<Order__c> orders = [SELECT
											Id,
											Name,
											Contact__r.Id,
											Order_Date__c,
											Status__c,
											(
												SELECT Id, name, Book__c, Book__r.Price__c, Amount_of_book__c 
												FROM Book_Orders__r
											)
										FROM Order__c
										WHERE Contact__r.Id =: user.Contact.id];
		try {
			return orders;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled(cacheable=false)
	public static List<BookOrder__c> getBookOrders() {
		User user = [SELECT Contact.Id FROM User WHERE Id = :UserInfo.getUserId()];
		Order__c order = [SELECT Id, Contact__r.Id, Status__c 
								FROM Order__c 
								WHERE Contact__r.Id =: user.Contact.id 
								AND 
								Status__c = 'New'];

		try {
			return [
				SELECT
					Id,
					Name,
					Amount_of_book__c,
					Book__c,
					Book__r.Title__c,
					Book__r.Image_URL__c,
					Book__r.Price__c,
					Order__c,
					Order__r.Contact__c
				FROM BookOrder__c
				WHERE Order__c =: order.Id
			];
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
