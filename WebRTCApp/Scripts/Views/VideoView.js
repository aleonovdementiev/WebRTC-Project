'use strict'

var VideoView = Backbone.View.extend({
    template: _.template($("#videoTpl").html()),

    initialize: function () {
    },

    render: function () {
        this.$el.html(this.template());

        return this.$el;
    },

    gotStream: function  (stream) {
        this.$('video')[0].srcObject = stream;
    }
})
