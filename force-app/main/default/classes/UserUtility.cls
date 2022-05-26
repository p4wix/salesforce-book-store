public without sharing class UserUtility {

	@AuraEnabled(cacheable=true)
	public static String fetchUserName(){
		try {
			return UserInfo.getName(); // Book Shop Site Guest User
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled(cacheable=false)
	public static Contact getCurrentContact(){
		User user = [SELECT Contact.Id FROM User WHERE Id =: UserInfo.getUserId()];
		try {
			return [SELECT Id, FirstName, LastName, Email, Phone, MailingCity
			FROM Contact 
			WHERE Id =: user.Contact.id];
		} catch (Exception e) {
			AuraHandledException ex = new AuraHandledException(e.getMessage());
			ex.setMessage(e.getMessage());
			throw ex;
		}
	}

	class HelperClass {
		@AuraEnabled
		public String FirstName{get; set; }

		@AuraEnabled
		public String LastName{get; set; }

		@AuraEnabled
		public String Email{get; set; }

		@AuraEnabled
		public String MailingCity{get; set; }

		@AuraEnabled
		public String Phone{get; set; }
	}
	
	@AuraEnabled
	public static string updateContact(HelperClass data) {
		Contact c = getCurrentContact();

		try {
			c.FirstName = (data.FirstName == '') ? c.FirstName : data.FirstName;
			c.LastName = (data.LastName == '') ? c.LastName : data.LastName;
			c.Email = (data.Email == '') ? c.Email : data.Email;
			c.MailingCity = (data.MailingCity == '') ? c.MailingCity : data.MailingCity;
			c.Phone = (data.Phone == '') ? c.Phone : data.Phone;
			update c;

			return 'succes';
		} catch (Exception e) {
			AuraHandledException ex = new AuraHandledException(e.getMessage());
			ex.setMessage(e.getMessage());
			throw ex;
		}
	}

	@AuraEnabled
	public static string resetPassword(String newPassword, String verifyNewPassword, String oldPassword){
		try {	
			Site.changePassword(newPassword, verifyNewPassword, oldPassword);
			return 'pass changed';
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
