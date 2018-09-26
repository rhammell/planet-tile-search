var MapView = Backbone.View.extend({
    initialize: function(){

        var planet = L.tileLayer('https://tiles{s}.planet.com/basemaps/v1/planet-tiles/{mosaic_name}/gmap/{z}/{x}/{y}.png?api_key={api_key}', {
            subdomains: ['0','1','2','3'],
            mosaic_name: 'global_monthly_2018_04_mosaic',
            api_key: 'b7b3a6eb8c00428cb8c1342e456821fe'
        });

        this._map = L.map(this.$el.attr('id'), {
            center: [37.759513, -122.448082],            
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
            maxBounds: [[37.677299, -122.559356],
                        [37.834734, -122.313537]]
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
        this._lastmove = {};

        this._map.on('zoomstart', this.mapZoomstart, this);
        this._map.on('zoomend', this.mapZoomend, this);
        this._map.on('click', this.mapClick, this);
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
        if (this._map.getZoom() < 15.5 && this._map.hasLayer(this._highlightText)){
            this._map.removeLayer(this._highlightText);
        } 
        if (this._map.getZoom() >= 15.5 && this._map.hasLayer(this._highlightText) == false){
            this._map.addLayer(this._highlightText);
        }
        this._zooming = false;
        this.highlightTile(this._lastmove);
    }, 

    mapClick: function(e) {
        console.log('click');
    }, 

    mapMousemove: function(e) {
        this._lastmove = e;
        if (this._zooming == false) {
            this.highlightTile(e);
        }
    }, 

    highlightTile: function(e) {
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
    }, 

    onPreviewClick: function(latlng) {
        this._map.setView(latlng);
    }

});
