App.Views.Main =  Backbone.View.extend({
    initialize: function(){  
        this.previewView = new App.Views.MiniMap({
            el: '#preview'
        }) 

        this.mapView = new App.Views.Map({
            el: '#map'
        })   
    }
});