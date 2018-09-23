function tile2bounds(tile){
    var SW_lng = tile2lng(tile.x, tile.z);
    var SW_lat =  tile2lat(tile.y+1, tile.z);
    var NE_lng = tile2lng(tile.x+1, tile.z);
    var NE_lat =  tile2lat(tile.y, tile.z);

    var SW = L.latLng(SW_lat, SW_lng);
    var NE = L.latLng(NE_lat, NE_lng);
    var bounds = L.latLngBounds(SW, NE);

    return bounds
};


function latlng2tile(latlng, zoom) {
    var lng = latlng.lng;
    var lat = latlng.lat;

    var tile = {
        x: lng2tile(lng, zoom),
        y: lat2tile(lat, zoom),
        z: zoom
    };

    return tile;
};

function lat2tile(lat, z) {
    return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z)));
};

function lng2tile(lng, z) {
  return (Math.floor((lng + 180) / 360 * Math.pow(2, z)));
};

function tile2lng(x,z) {
  return (x/Math.pow(2,z)*360-180);
};

function tile2lat(y,z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
};