''' Download Planet basemap tiles over San Francisco '''

import sys
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
    ''' Return XYZ tile coordinates that cover geo coordinate bounds

    Args:
        bounds (list): List of North-West and South-East bounding box 
            coordinates - [[SE_lat, SE_lon], [NW_lat, NW_lon]]
        zoom (int): Tile zoom level
    '''

    tiles = []

    # Calc bounding tiles
    se = deg2num(bounds[0][0], bounds[0][1], zoom)
    nw = deg2num(bounds[1][0], bounds[1][1], zoom)

    for x in range(se['x'], nw['x'] +1):
        for y in range(nw['y'], se['y']+1):
            tiles.append({
                    'x': x,
                    'y': y,
                    'z': zoom
                })

    return tiles


def xyz_download(url, tile, out_dir='', params=None):
    ''' Download XYZ tile (.png) from url into output dir  

    Args:
        url (Str): Tile URL in {x}/{y}/{z} format
        tile (dict): XYZ coordinates
        out_dir (str): Directory to save .png images into
        params (dict): Parameters included in download request
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


def download(): 
    ''' Download XYZ tiles covering geo bounds '''

    # San Fran bounding coordinates
    bounds = [[37.677299, -122.559356],
              [37.834734, -122.313537]]

    # Get XYZ tiles
    zoom = 18
    tiles = xyz_tiles(bounds, zoom)

    # Set download params
    url = 'https://tiles0.planet.com/basemaps/v1/planet-tiles/global_monthly_2016_05_mosaic/gmap/{z}/{x}/{y}.png'
    api_key = 'b7b3a6eb8c00428cb8c1342e456821fe'
    params = {'api_key': api_key}

    # Download tiles
    for tile in tiles:
        xyz_download(url, tile, out_dir='tiles/', params=params)



# Main function
if __name__ == "__main__":

    # Run selected command
    command = sys.argv[1]
    if command == 'download':
        download()

    elif command == 'process':
        process()

    else: 
        print('Script command not found.')


