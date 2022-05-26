trigger CancelItemFromCart on BookOrder__c (before delete, after update) {
	
    List<BookOrder__c> orderItems = new List<BookOrder__c>();
    
    if(trigger.isDelete) {
        for(BookOrder__c orderItem : trigger.old) {
            orderItems.add(orderItem);
        }
    }
    
    system.debug('1. Order Items &&&&' + orderItems);
    
    List<Book__c> booksToUpdate = new List<Book__c>();
    
    for(BookOrder__c orderItem : orderItems) {
        Book__c book = [Select Id, Sold__c, Amount__c FROM Book__c Where Id =: orderItem.Book__c];
        Order__c order = [Select Status__c FROM Order__c Where Id =: orderItem.Order__c];
        
        system.debug('2. Order &&&&' + order);
        system.debug('3. Book &&&&' + book);
        
        if(order.Status__c == 'New') { 
            book.Amount__c += orderItem.Amount_of_book__c;
            book.Sold__c -= orderItem.Amount_of_book__c;
        }
        booksToUpdate.add(book);
    }
    system.debug('BooksToUpdate &&&&' + booksToUpdate);
    update booksToUpdate;
}