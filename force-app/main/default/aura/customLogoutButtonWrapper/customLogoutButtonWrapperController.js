({
	logout: function (cmp, evt, hlp) {
		var omniAPI = cmp.find('omniToolkit');
		omniAPI
			.logout()
			.then(function (result) {
				if (result) {
					window.console.log('Logout successful');
				} else {
					window.console.log('Logout failed');
				}
			})
			.catch(function (error) {
				window.console.log(error);
			});
	}
});
