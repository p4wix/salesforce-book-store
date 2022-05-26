trigger StockValidation on BookOrder__c (after insert, after update) {
	
    List<BookOrder__c> orderItems = new List<BookOrder__c>();
    
    if(trigger.isInsert) {
        for(BookOrder__c orderItem : trigger.new) {
            orderItems.add(orderItem);
        }
    }
    
    List<Book__c> booksToUpdate = new List<Book__c>();
    
    for(BookOrder__c orderItem : orderItems) {
        Book__c book = [Select Id, Sold__c, Amount__c FROM Book__c Where Id =: orderItem.Book__c];
        Order__c order = [Select Status__c FROM Order__c Where Id =: orderItem.Order__c];
        
        if(order.Status__c == 'New') {
            book.Amount__c -= orderItem.Amount_of_book__c;
            book.Sold__c += orderItem.Amount_of_book__c;
        }
        booksToUpdate.add(book);
    }
    
    update booksToUpdate;
}