App.Routers.Router = Backbone.Router.extend({

  routes: {
    "": "index",
  },

  index: function () {
    var app = new App.Views.Main();
  }
});