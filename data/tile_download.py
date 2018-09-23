''' Download Planet basemap tiles over San Francisco '''

import math
import requests

def deg2num(lat_deg, lon_deg, zoom):
    ''' Return XY tile coordinates for input geo coordinate at 
    given zoom level  '''

    lat_rad = math.radians(lat_deg)
    n = 2.0 ** zoom
    xtile = int((lon_deg + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.log(math.tan(lat_rad) + (1 / math.cos(lat_rad))) / math.pi) / 2.0 * n)
    return {'x': xtile, 'y': ytile}    


def xyz_tiles(bounds, zoom):
    ''' Return XYZ tile coordinates that cover bounding geo coordinates 

    Args:
        bounds (list): List of North-West and South-East bounding box 
            coordinates - [[NW_lon, NW_lat], [SE_lon, SE_lat]]
        zoom (int): Tile zoom level
    '''

    tiles = []

    # Calc bounding tiles
    nw = deg2num(bounds[0][1], bounds[0][0], zoom)
    se = deg2num(bounds[1][1], bounds[1][0], zoom)

    for x in range(nw['x'], se['x']+1):
        for y in range(nw['y'], se['y']+1):
            tiles.append({
                    'x': x,
                    'y': y,
                    'z': zoom
                })

    return tiles


def xyz_download(url, tile, out_dir='', params=None):
    ''' Download XYZ tile 

    '''

    # XYZ values
    x = tile['x']
    y = tile['y']
    z = tile['z']

    # Make request
    url = url.format(z=z, x=x, y=y)
    r = requests.get(url, params=params)

    # Save .png file 
    if r.status_code == 200: 

        print('downloading: ')
        print(tile)

        fname = out_dir + '_'.join([str(z), str(x), str(y)]) + '.png' 
        with open(fname, 'wb') as f: 
            f.write(r.content)


def process(): 

    # San Fran bounding coordinates
    bounds = [[-122.55935668945312,
                 37.83473402375478],
              [-122.31353759765624,
                 37.67729913640425]]

    # Get XYZ tiles
    zoom = 22
    tiles = xyz_tiles(bounds, zoom)

    # Set download params
    url = 'https://tiles0.planet.com/basemaps/v1/planet-tiles/global_monthly_2016_05_mosaic/gmap/{z}/{x}/{y}.png'
    api_key = 'b7b3a6eb8c00428cb8c1342e456821fe'
    params = {'api_key': api_key}

    # Download tiles
    for tile in tiles:
        xyz_download(url, tile, out_dir='tiles/', params=params)
