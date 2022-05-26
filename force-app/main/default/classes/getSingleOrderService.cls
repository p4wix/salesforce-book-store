public with sharing class getSingleOrderService {
	@AuraEnabled(cacheable=true)
	public static Order__c getSingleOrder(){
		User user = [SELECT Contact.Id, Contact.Email FROM User WHERE Id =: UserInfo.getUserId()];
		Order__c o = [SELECT 
								Id, Name, Contact__r.Id, Email__c, First_Name__c, Last_Name__c, Address__c, Postal_Code__c, City__c, Phone__c, Status__c
								FROM Order__c 
								WHERE Contact__r.Id =: user.Contact.id
								AND Status__c = 'New' AND isOpen__c = true];

		try {
			return o;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
