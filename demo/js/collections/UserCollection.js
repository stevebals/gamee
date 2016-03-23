define(
	[
	'models/UserModel'
	], 
  function(UserModel){
  var Messages = Backbone.Collection.extend({
    model: UserModel, // Generally best practise to bring down a Model/Schema for your collection
    url: 'http://localhost:8080/user'
  });

  return Messages;
});