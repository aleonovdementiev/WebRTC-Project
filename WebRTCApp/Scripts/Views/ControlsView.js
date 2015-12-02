'use strict'

var ControlsView = Backbone.View.extend({
    template: _.template($("#controlsTpl").html()),

    events: {
        'click .callButton': 'startCalling'
    },

    initialize: function () {
    },

    render: function () {
        this.$el.html(this.template());

        this.toggleCallButtonDisabled(true);
        this.toggleHangButtonDisabled(true);

        this.startVideo()

        return this.$el;
    },

    startVideo: function () {
        var constraints = {
            audio: true,
            video: true
        };

        trace('Requesting local stream');
        $('.startButton').prop('disabled', true);
        navigator.getUserMedia(constraints, this.gotStream.bind(this), function(e) {
            alert('getUserMedia() error: ' + e.name);
        });
    },

    toggleCallButtonDisabled: function (state) {
        this.$('.callButton').prop('disabled', state);
    },

    toggleHangButtonDisabled: function (state) {
        this.$('.hangButton').prop('disabled', state);
    },

    gotStream: function (stream) {
        trace('Received local stream');
        this.trigger('setLocalStream', stream);
        this.toggleCallButtonDisabled(false);
    },

    startCalling: function () {
        this.trigger('startCalling');
        this.toggleCallButtonDisabled(true);
        this.toggleHangButtonDisabled(false);
    }
})
