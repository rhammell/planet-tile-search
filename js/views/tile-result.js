App.Views.TileResult = Backbone.View.extend({
  
  tagName: 'img',
  class: 'tile-result',

  events: {
    'click': 'click'
  }, 

  click: function() {
    console.log('click callback')
  }, 

  initialize: function() {
  },

  render: function() {
    this.$el.attr('src', this.model.getURL());

    return this;
  }

});