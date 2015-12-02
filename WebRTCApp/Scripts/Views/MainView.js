'use strict'

var MainView = Backbone.View.extend({
    className: 'mainContainer',

    template: _.template($("#mainTpl").html()),

    initialize: function () {
        this.offerParams = {
            'mandatory': {
                'OfferToReceiveAudio': true,
                'OfferToReceiveVideo': true
            }
        }
        this.socket = io.connect('', {port: 1234});

        this.controlsView = new ControlsView();
        this.localVideoView = new VideoView({
            className: 'localVideo'
        });
        this.remoteVideoView = new VideoView({
            className: 'remoteVideo'
        });

        this.listenTo(this.controlsView, 'setLocalStream', this.setLocalStream)
            .listenTo(this.controlsView, 'startCalling', this.createOffer)
            .listenTo(this.socket, 'message', this.onSocketMessage.bind(this));

        this.render();
    },

    onSocketMessage: function (message){
        if (message.type === 'offer') {
            this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
            this.createAnswer();
        } else if (message.type === 'answer') {
            this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
        } else if (message.type === 'candidate') {
            var candidate = new RTCIceCandidate({sdpMLineIndex: message.label, candidate: message.candidate});
            this.peerConnection.addIceCandidate(candidate);
        }
    },

    render: function () {
        this.$el.html(this.template());

        this.$('.buttonsContainer').html(this.controlsView.render());
        this.$('.videoContainer').append(this.localVideoView.render());
        this.$('.videoContainer').append(this.remoteVideoView.render());

        this.localVideoView.$('video').prop('muted', true);

        return this.$el;
    },

    setLocalStream: function (stream) {
        this.localStream = stream;
        this.localVideoView.gotStream(stream);

        this.peerConnection = new RTCPeerConnection(null);
        this.peerConnection.addStream(stream);
        this.peerConnection.onicecandidate = this.gotIceCandidate.bind(this);
        this.peerConnection.onaddstream = this.gotRemoteStream.bind(this);
    },

    gotLocalDescription: function (description){
        this.peerConnection.setLocalDescription(description);
        this.sendMessage(description);
    },

    gotIceCandidate: function (event){
        if (event.candidate) {
            this.sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        }
    },

    gotRemoteStream: function (event){
        this.remoteVideoView.gotStream(event.stream);
    },

    createOffer: function () {
        this.peerConnection.createOffer(this.gotLocalDescription.bind(this), function(error) {
                console.log(error);
            }, this.offerParams);
    },

    createAnswer: function () {
        this.peerConnection.createAnswer(this.gotLocalDescription.bind(this), function(error) {
                console.log(error);
            }, this.offerParams);
    },

    sendMessage: function (message){
      this.socket.emit('message', message);
    }
})
