App.Views.MiniMap = Backbone.View.extend({
    initialize: function(){

        this._bounds = App.Data.bounds;

        var tile_layer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}');

        this._map = L.map(this.$el.attr('id'), {
            center: this._bounds.getCenter(),            
            zoom: 10,
            minZoom: 10,
            maxZoom: 10,
            zoomControl: false,
            attributionControl: false,
            layers: [tile_layer],
            maxBoundsViscosity: 0.9,
            maxBounds: this._bounds
        });

        this._map.on('click', this.mapClick, this);

        this._highlightPoly = L.polygon([], {
            color: 'blue',
            fillOpacity: 0.0,
            interactive: false
        }).addTo(this._map);

        this._map.on('click', this.mapClick, this);

        Backbone.on('mapMove', this.onMapMove, this);
    },

    mapClick: function(e) {
        console.log('clickeddd');
        Backbone.trigger('previewClick', e.latlng)
    }, 

    onMapMove: function(bounds) {
        console.log('main map moved');

        var polyBounds = [
            bounds.getSouthWest(),
            bounds.getNorthWest(),
            bounds.getNorthEast(),
            bounds.getSouthEast()
        ];
        this._highlightPoly.setLatLngs(polyBounds);
    }, 

});