require.config({
    paths: {
        text: 'libs/require/text'
    }
});

require([
	'models/UserModel',
	'Router'
	],
function(UserModel, Router){

	var abapp	=	window.abapp	=	window.abapp	|| {};
	abapp.currentState = window.location.hash.substr(1).trim();
    abapp.userToken='';
    abapp.serverUrl = 'https://gamee.herokuapp.com/';

	abapp.displayPage = function(currentPage){
		console.log(JSON.stringify(currentPage));
        if(abapp.currentPage){
            try{
                abapp.currentPage.onClose();
            }catch(e){
                // onClose method is not defined on the particular view.
                abapp.currentPage.undelegateEvents();
            }
            abapp.currentPage.$el.trigger("closePage");
            abapp.currentPage.$el.hide();
        }
        abapp.currentPage = currentPage;
        var cc=currentPage.$el.show();
        console.log(cc);
    };

    abapp.getUserSession = function(){
        if($.cookie('userToken') === undefined){
            location.href = '#login';
        }
    };

   
    var appRouter = new Router();
    Backbone.history.start();

});
