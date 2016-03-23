define([], function() {
    var UserModel = Backbone.Model.extend({

        defaults: {
            name    : 'Guest',
            email   : 'sample@sample.com',
            dob     : '01-01-2016'
        }

    });
    return UserModel;
});
