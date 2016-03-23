define([
	'text!templates/home.html'
	],
function(Template){
	var hView	=	Backbone.View.extend({
		el	: $('#homePageContainer'),
		template    :	_.template(Template),
		events	: {
			//"click .login"	: 	'login'
		},
		initialize	: 	function(){
			//alert('home initialized');
		 	self = this;
            this.$el.html( _.template(Template) );
            abapp.displayPage(this);
            //this.render();
		},
        onClose:function(){
            self.undelegateEvents();
        }
	});
	return hView;
});