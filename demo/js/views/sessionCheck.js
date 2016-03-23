define([
	],
function(){
	var dView	=	Backbone.View.extend({
		el	: $('#homePageContainer'),
		events	: {
			//"click .login"	: 	'login'
		},
		initialize	: 	function(){
			
		},
		
		userData: function(){
			console.log(abapp.getUserSession()+'dash session');
		},
        onClose:function(){
            self.undelegateEvents();
        }
	});
	return dView;
});