public with sharing class EmailHandler {

	@AuraEnabled
	public static void sendEmail(List<String> toAddress, String subject, String body) {      
		Messaging.reserveSingleEmailCapacity(1);

		messaging.SingleEmailMessage mail = new messaging.SingleEmailMessage();

		mail.setToAddresses(toAddress);
		mail.setReplyTo('no-reply@xooa.com');
		mail.setSenderDisplayName('BookStore - best books');
		mail.setSubject(subject);
		mail.setHtmlBody(body);
		// mail.setEntityAttachments(files);
		try {
			Messaging.sendEmail(new List<messaging.SingleEmailMessage> {mail});
		}
		catch (exception e){
			throw new AuraHandledException(e.getMessage());
			//return null;
		}
	}
}