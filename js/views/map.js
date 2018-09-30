App.Views.Map = Backbone.View.extend({

    initialize: function(){

        this._bounds = App.Data.bounds;

        var planet = L.tileLayer(App.Data.url, {
            subdomains: App.Data.subdomains,
            mosaic_name: App.Data.mosaic_name,
            api_key: App.Data.api_key
        });

        this._map = L.map(this.$el.attr('id'), {
            center: this._bounds.getCenter(),            
            zoom: 12,
            minZoom: 12,
            maxZoom: 18,
            zoomSnap: 0.5,
            zoomDelta: 0.5,
            wheelPxPerZoomLevel: 120,
            zoomControl: false,
            attributionControl: false,
            layers: [planet],
            maxBoundsViscosity: 0.9,
            maxBounds: this._bounds
        });

        L.control.attribution({position: 'bottomleft'})
            .addAttribution('<a href="https://developers.planet.com/docs/api/tile-services/">Planet Basemaps</a>')
            .addTo(this._map);
        L.control.zoom({position:'bottomright'}).addTo(this._map);

        this._highlightPoly = L.polygon([], {
            color: 'red',
            fillOpacity: 0.0,
        }).addTo(this._map);

        var divIcon = L.divIcon({ 
            className: "labelClass",
            html: "Click box<br>to search",
            iconSize: new L.Point(100, 50),
            iconAnchor: new L.Point(50, 10)
        })

        this._highlightText = L.marker([], {
            icon: divIcon,
            clickable: false,
            interactive: false
        });

        this._zooming = false;
        this._clicked = 0;
        this._lastmove = {};

        this._map.on('zoomstart', this.mapZoomstart, this);
        this._map.on('zoomend', this.mapZoomend, this);
        this._map.on('click', this.mapClick, this);
        this._map.on('dblclick', this.mapDblclick, this);
        this._map.on('mousemove', this.mapMousemove, this);
        this._map.on('moveend', this.mapMoveend, this);

        Backbone.on('previewClick', this.onPreviewClick, this);

        Backbone.trigger('mapMove', this._map.getBounds());
    },

    mapMoveend: function(e) {
        Backbone.trigger('mapMove', this._map.getBounds());
    },

    mapZoomstart: function(e) {
        this._zooming = true;
    }, 

    mapZoomend: function(e) {
        console.log(this._map.getZoom())
        this._zooming = false;
        this.highlightTile(this._lastmove);
    }, 

    mapClick: function(e) {
        this._clicked = this._clicked + 1;
        me = this;
        setTimeout(function(){
            if(me._clicked == 1){
                console.log('sinle click');
                if (me._bounds.contains(e.latlng)) {
                    var tile = latlng2tile(e.latlng, 18);
                    console.log(tile)
                }              
                me._clicked = 0;
            }
        }, 300);
    },

    mapDblclick: function(e) {
        console.log('dboule click');
        this._clicked = 0;
    }, 

    mapMousemove: function(e) {
        this._lastmove = e;
        if (this._zooming == false) {
            this.highlightTile(e);
        }
    }, 

    highlightTile: function(e) {

        if (this._bounds.contains(e.latlng)) {

            if (this._map.hasLayer(this._highlightPoly) == false) {
                this._map.addLayer(this._highlightPoly);
            }
            if (this._map.getZoom() < 15.5 && this._map.hasLayer(this._highlightText)){
                this._map.removeLayer(this._highlightText);
            } 
            if (this._map.getZoom() >= 15.5 && this._map.hasLayer(this._highlightText) == false){
                this._map.addLayer(this._highlightText);
            }

            var tile = latlng2tile(e.latlng, 18);
            var bounds = tile2bounds(tile);

            var polyBounds = [
                bounds.getSouthWest(),
                bounds.getNorthWest(),
                bounds.getNorthEast(),
                bounds.getSouthEast()
            ];

            var polyCenter = bounds.getCenter();

            this._highlightText.setLatLng(polyCenter);
            this._highlightPoly.setLatLngs(polyBounds);

        }  else { 
            if (this._map.hasLayer(this._highlightPoly)) {
                this._map.removeLayer(this._highlightPoly)
            }
            if (this._map.hasLayer(this._highlightText)) {
                this._map.removeLayer(this._highlightText)
            }
        }
    }, 

    onPreviewClick: function(latlng) {
        this._map.setView(latlng);
    }

});
