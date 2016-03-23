define([
	'text!templates/registerview.html',
	'collections/UserCollection'
	],
function(Template, UserCollection){
	var socket;
    var isServerFail = false;
	var serverUrl = "http://localhost:8080/";
	try{
        socket = io.connect(serverUrl+'login');
        console.log('sock---'+socket);
    }catch(err){        
        isServerFail = true;
    }
    console.log("isServerFail = " + isServerFail);   
	var rView	=	Backbone.View.extend({
		el	: $('#homePageContainer'),
		template    :	_.template(Template),
		events	: {
			'click .registerBtn' : 'Register',
			'keyup #inputEmail' : 'checkEmail'
		},
		initialize	: 	function(){
			//alert('home initialized');
		 	self = this;
            this.$el.html( _.template(Template) );
            abapp.displayPage(this);

	        if(!isServerFail){  
	            socket.emit("join", {
	                userId: '111',
	                userName: 'user1',
	                paperId:'111paper' 
	            });  
	        }
		},
		Register : function(){
			alert('register clicked');
			$.ajax({
                url: 'http://localhost:8080/users/register',
                type: 'POST',
                dataType:"json",
                data : {userName : $('#inputUsername').val(),
            			email 	 : $('#inputEmail').val(),
            			password : $('#inputPassword').val(),
            			mobile 	 : $('#inputMobile').val()
        				},
                //headers: { 'Authorization': abapp.token },
                success:function(data){
                   if(!data.error){
                   		$('.registerSuccess').html(data.message).fadeIn(200).delay(500).fadeOut(5000);
                   }
                },
                error:function(err){
                    console.log(err);
                }
            });
            return false;
		},
		checkEmail : function(){
			$.ajax({
                url: 'http://localhost:8080/users/checkEmail',
                type: 'POST',
                dataType:"json",
                data : {email : $('#inputEmail').val()
        				},
                //headers: { 'Authorization': abapp.token },
                success:function(data){
                   if(data.status=="already"){
                   		$('.usernameAlready').html(data.message).fadeIn(200).delay(500).fadeOut(5000);
                   }else if(data.status=="available"){
                   		$('.registerSuccess').html(data.message).fadeIn(200).delay(500).fadeOut(5000);
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
	return rView;
});