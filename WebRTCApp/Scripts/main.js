'use strict';

$(function () {
    var $video = $('.localVideoContainer')[0],
        constraints = window.constraints = {
            audio: false,
            video: true
        },
        $errorElement = $('.errorMsg')[0],
        successCallback,
        errorCallback;

    successCallback = function (stream) {
        var videoTracks = stream.getVideoTracks();
        console.log('Got stream with constraints:', constraints);
        console.log('Using video device: ' + videoTracks[0].label);
        stream.onended = function() {
        console.log('Stream ended');
        };
        window.stream = stream;
        $video.srcObject = stream;
    }

    errorCallback = function(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
        errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
            constraints.video.width.exact + ' px is not supported by your device.');
        } else if (error.name === 'PermissionDeniedError') {
        errorMsg('Permissions have not been granted to use your camera and ' +
          'microphone, you need to allow the page access to your devices in ' +
          'order for the demo to work.');
        }
        errorMsg('getUserMedia error: ' + error.name, error);
    }

    function errorMsg(msg, error) {
        $errorElement.innerHTML += '<p>' + msg + '</p>';
        if (typeof error !== 'undefined') {
            console.error(error);
        }
    }

    navigator.getUserMedia(constraints, successCallback, errorCallback);

});
