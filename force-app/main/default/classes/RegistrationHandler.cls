global without sharing class RegistrationHandler {
    
	@AuraEnabled(cacheable=true)
	public static User createPortalUser(String email, String lastName, String firstName, String password) {
		//System.debug('&&& data \n' + JSON.serialize(data));

		//Account act = new Account(
		//	Name = data.firstName + ' ' + data.lastName,
		//	OwnerId = UserInfo.getUserId()
		//);

		//Database.insert(act);

		//Contact c = new Contact();
		//c.AccountId = act.Id;
		//c.Email = data.email;
		//c.FirstName = data.firstName;
		//c.LastName = data.lastName;

		//insert(c);

		//System.debug('&&& data \n' + data);

		User u = new User();
		Profile p = [SELECT Id FROM profile WHERE name =: System.Label.Book_Shop_Client LIMIT 1];
		u.Email = email;
		u.Username = 'User'+ Math.floor(Math.random() * 10312312);
		u.LastName = lastName;
		u.FirstName = firstName;
		u.CommunityNickname = firstName + lastName;
		String alias = email.substringBefore('@');

		if(alias.length() > 8) {
			alias = alias.substring(0, 8);
		}

		u.Alias = alias;
		u.LanguageLocaleKey = UserInfo.getLocale();
		u.LocaleSidKey = UserInfo.getLocale();
		u.EmailEncodingKey = 'UTF-8';
		u.TimeZoneSidKey = 'America/Los_Angeles';
		u.ProfileId = p.Id;

		site.createExternalUser(u, null, password);

		return u;
	}
}
