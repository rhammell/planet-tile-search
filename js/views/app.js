var AppView = Backbone.View.extend({
    initialize: function(){  
        
        this.previewView = new PreviewView({
            el: '#preview'
        }) 

        this.mapView = new MapView({
            el: '#map'
        })   


    }
})