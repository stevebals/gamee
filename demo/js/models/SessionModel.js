define([], function() {
    var SessionModel = Backbone.Model.extend({

        defaults: {
            userToken    : 'Guest',
            email        : 'sample@sample.com'
        }

    });
    return SessionModel;
});
