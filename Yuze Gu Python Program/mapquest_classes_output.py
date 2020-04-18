# Yuze Gu 64531026

import mapquest_api

class STEPS:
    '''step-by-step Directions'''

    def print_result(self, response):
        print('DIRECTIONS')
        for x in response['route']['legs']:
            for i in x['maneuvers']:
                print(i['narrative'])

        print()

class TOTALDISTANCE:
    '''the total distance'''

    def print_result(self, response):
        print('TOTAL DISTANCE:', round(response['route']['distance']), "miles")
        print('')

class TOTALTIME:
    '''the total time'''

    def print_result(self, response):
        print('TOTAL TIME:', round(response['route']['time']/60), 'minutes')
        print()

class LATLONG:
    '''latitude and longitude'''

    def print_result(self, response):
        print('LATLONGS')
        for x in response['route']['locations']:
            lat = x['displayLatLng']['lat']
            lng = x['displayLatLng']['lng']
            if lat >= 0:
                lat_compass = 'N'
            else:
                lat_compass = 'S'

            if lng >= 0:
                lng_compass = 'E'
            else:
                lng_compass = 'W'

            print(str(round(abs(lat),2)) + lat_compass + ' ' + str(round(abs(lng),2)) + lng_compass)
        print()        

class ELEVATION:
    '''elevations'''
        
    def print_result(self, response):
        print('ELEVATIONS')
        latlng_list = get_latlng(response)
        for n in range(0, len(latlng_list), 2):
            latlng = (str(latlng_list[n]) + ',' + str(latlng_list[n+1]))
            elevation_url = mapquest_api.get_elevations_url(latlng)
            elevation_url_result = mapquest_api.download_result(elevation_url)
            for heights in elevation_url_result['elevationProfile']:
                print(round(heights['height']*3.28083))
        print()
            
            
            
        



def get_latlng(response: dict) -> list:
    '''get latlng from json'''
    result = []
    for x in response['route']['locations']:
        result.append(x['displayLatLng']['lat'])
        result.append(x['displayLatLng']['lng'])
    return result
        

def display_results(user_inputs: list) -> list:
    '''choose what the user wants'''
    result = []
    for message in user_inputs:
        if message == 'STEPS':
            result.append(STEPS())
        elif message == 'TOTALDISTANCE':
            result.append(TOTALDISTANCE())
        elif message == 'TOTALTIME':
            result.append(TOTALTIME())
        elif message == 'LATLONG':
            result.append(LATLONG())
        elif message == 'ELEVATION':
            result.append(ELEVATION())
    return result

def run_mapquests(outputs: list, response:dict):
    '''duck_typing to run the classes'''
    for output in outputs:
        output.print_result(response)
