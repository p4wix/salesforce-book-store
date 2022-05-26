public without sharing class ContactUsServices {

	class HelperCreateContactUsObj {
		@AuraEnabled
		public String name{get; set; }

		@AuraEnabled
		public String email{get; set; }

		@AuraEnabled
		public String topic{get; set; }

		@AuraEnabled
		public String message{get; set; }
	}

   @AuraEnabled
	public static String createContactUsRecord(HelperCreateContactUsObj props){
		
		try {
			ContactUsInfo__c cui = new ContactUsInfo__c();

			cui.Name__c = props.name;
			cui.Email__c = props.email;
			cui.Topic__c = props.topic;
			cui.Message__c = props.message;
			
			insert cui;

			return 'work';
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
