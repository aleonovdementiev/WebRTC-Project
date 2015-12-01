'use strict'

var MainView = Backbone.View.extend({
    className: 'mainContainer',

    template: _.template($("#mainTpl").html()),

    initialize: function () {
        this.controlsView = new ControlsView();
        this.localVideoView = new VideoView({
            className: 'localVideo'
        });
        this.remoteVideoView = new VideoView({
            className: 'remoteVideo'
        });

        this.listenTo(this.controlsView, 'setLocalStream', this.setLocalStream)
            .listenTo(this.controlsView, 'startCalling', this.startCalling);

        this.render();
    },

    render: function () {
        this.$el.html(this.template());

        this.$('.buttonsContainer').html(this.controlsView.render());
        this.$('.videoContainer').append(this.localVideoView.render());
        this.$('.videoContainer').append(this.remoteVideoView.render());

        this.localVideoView.$('video').prop('muted', true);
        this.controlsView.toggleCallButtonDisabled(true);

        return this.$el;
    },

    setLocalStream: function (stream) {
        this.localStream = stream;
        this.localVideoView.gotStream(stream);
    }
})
