define([
	'text!templates/dashboardview.html'
	],
function(Template){
	var dView	=	Backbone.View.extend({
		el	: $('#homePageContainer'),
		template    :	_.template(Template),
		events	: {
			//"click .login"	: 	'login'
		},
		initialize	: 	function(){
			abapp.getUserSession();
		 	self = this;
            this.$el.html( _.template(Template) );
            abapp.displayPage(this);
		},
        onClose:function(){
            self.undelegateEvents();
        }
	});
	return dView;
});