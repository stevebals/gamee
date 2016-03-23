define([
	'views/homeView',
	'views/loginView',
	'views/registerView',
	'views/dashboardView'
	], 
function(homeView, loginView, registerView, dashboardView){
	var Router = Backbone.Router.extend({
		routes 	: 	{
			""			: 	'home',
			"login"		: 	'login',
			"register"	: 	'register',
			"dashboard"	: 	'dashboard'
		},
		initialize	: 	function(){
			
		},
		home:function(){
			var home = new homeView();
			window.abapp.currentState = 'home';
		},
		login:function(){
			var login = new loginView();
			window.abapp.currentState = 'login';
		},
		register:function(){
			var register = new registerView();
			window.abapp.currentState = 'register';
		},
		dashboard:function(){
			var dashboard = new dashboardView();
			window.abapp.currentState = 'dashboard';
		}

	});
	return Router;
});