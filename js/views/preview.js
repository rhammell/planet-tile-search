var PreviewView = Backbone.View.extend({
    initialize: function(){

        var tile_layer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            subdomains: ['0','1','2','3'],
            mosaic_name: 'global_monthly_2018_04_mosaic',
            api_key: 'b7b3a6eb8c00428cb8c1342e456821fe'
        });

        this._map = L.map(this.$el.attr('id'), {
            center: [37.759513, -122.448082],            
            zoom: 10,
            minZoom: 10,
            maxZoom: 10,
            zoomControl: false,
            attributionControl: false,
            layers: [tile_layer],
            maxBoundsViscosity: 0.9,
            maxBounds: [[37.677299, -122.559356],
                        [37.834734, -122.313537]]
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