App.Models.Tile = Backbone.Model.extend({
    defaults: {
      "x": 0,
      "y": 0,
      "z": 18
    }, 

    getURL: function() {

      var url = App.Data.url
        .replace('{s}', '0')
        .replace('{mosaic_name}', App.Data.mosaic_name)
        .replace('{api_key}', App.Data.api_key)
        .replace('{x}', this.get('x'))
        .replace('{y}', this.get('y'))
        .replace('{z}', this.get('z'))

      return url;
    }
});