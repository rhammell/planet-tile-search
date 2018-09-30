var App = {  
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  Data: {}
};

App.Data.url = 'https://tiles{s}.planet.com/basemaps/v1/planet-tiles/{mosaic_name}/gmap/{z}/{x}/{y}.png?api_key={api_key}';
App.Data.mosaic_name = 'global_monthly_2018_04_mosaic';
App.Data.api_key = 'b7b3a6eb8c00428cb8c1342e456821fe';
App.Data.subdomains = ['0','1','2','3'];
App.Data.bounds = L.latLngBounds([[37.677299, -122.559356],
                                  [37.834734, -122.313537]])

$(document).ready(function() {
    router = new App.Routers.Router();
    Backbone.history.start();
});