# Yuze Gu 64531026

import json
import urllib.parse
import urllib.request


API_key = 'QzZEMVdRnADZUvhFrcGFEJUumYITJOpt'
route_URL = 'http://open.mapquestapi.com/directions/v2/'
elevation_URL = 'http://open.mapquestapi.com/elevation/v1/'

def build_route_search_url(places: list) -> str:
    '''build search urls'''
    query_parameters = [
        ('key', API_key),
        ('from', places[0])
    ]
    for stop in range(1, len(places)):
        query_parameters.append(('to', places[stop]))

    return route_URL + 'route?' + urllib.parse.urlencode(query_parameters)

def get_elevations_url(latlng:str) -> str:
    '''get elevations urls'''
    query_parameters = [
        ('key', API_key),
        ('shapeFormat', 'raw')
        ]

    return elevation_URL + 'profile?' + urllib.parse.urlencode(query_parameters) + '&latLngCollection=' + latlng

def download_result(url:str) -> 'json':
    '''get source page in text'''
    response = None

    try:
        response = urllib.request.urlopen(url)
        json_text = response.read().decode(encoding = 'utf-8')
        return json.loads(json_text)

    finally:
        if response != None:
            response.close()
    



