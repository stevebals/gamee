define([
	'text!templates/loginview.html'
	],
function(Template){
	var socket;
    var isServerFail = false;
	var serverUrl = "http://localhost:8080";
	try{
        socket = io.connect(serverUrl+'login');
        console.log(socket);
    }catch(err){        
        isServerFail = true;
    }
    console.log("isServerFail = " + isServerFail);   
	var lView	=	Backbone.View.extend({
		el	: $('#homePageContainer'),
		template    :	_.template(Template),
		events	: {
			'click .btnLogin' : 'Login',
		},
		initialize	: 	function(){
			//alert('home initialized');
			if($.cookie('userToken') !== undefined){
	            location.href = '#dashboard';
	        }
		 	self = this;
            this.$el.html( _.template(Template) );
            abapp.displayPage(this);
            //this.render();
		},
		Login : function(){
			$.ajax({
                url: abapp.serverUrl+'users/login',
                type: 'POST',
                dataType:"json",
                data : {email 	 : $('#inputEmail').val(),
            			password : $('#inputPassword').val()
        				},
                //headers: { 'Authorization': abapp.token },
                success:function(data){
                   if(!data.error){
                   		$('.loginSuccess').html(data.message).fadeIn(200).delay(500).fadeOut(5000);
                   		abapp.userToken = data.token;
                   		
						/*$.removeCookie('name');
						$.removeCookie('name');*/

						$.cookie('userToken', data.token, { expires: 1 });
						$.cookie('userEmail', data.email, { expires: 1 });
                   		//cookie.setCookie('token', abapp.userToken, 1);
                   		location.href = '#dashboard';
                   }
                },
                error:function(err){
                    console.log(err);
                }
            });
            return false;
		},
        onClose:function(){
            self.undelegateEvents();
        }
	});
	return lView;
});