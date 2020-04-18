# Yuze Gu

import mapquest_api
import mapquest_classes_output

class MapQuestError(Exception):
    pass

class RouteNotFoundError(Exception):
    pass

def input_places() -> list:
    '''let user input the locations and orders'''
    places_num = int(input())
    if places_num < 2:
        raise MapQuestError
    else:
        place_list = []
        for n in range(places_num):
            place_list.append(input())
        return place_list

def output_results() -> list:
    '''get which output the user wants'''
    result_num = int(input())
    if result_num > 5:
        raise MapQuestError
    else:
        outputs = []
        for n in range(result_num):
            outputs.append(input())
        return outputs

def main():
    '''main program'''
    try:
        places = input_places()
        outputs = output_results()
        make_url = mapquest_api.build_route_search_url(places)
        result = mapquest_api.download_result(make_url)
        if result['info']['statuscode'] != 0:
            raise RouteNotFoundError
        else:
            output_lists = mapquest_classes_output.display_results(outputs)
            print()
            mapquest_classes_output.run_mapquests(output_lists, result)
            print()
            print('Directions Courtesy of MapQuest; Map Data Copyright OpenStreetMap Contributors.')

    except RouteNotFoundError:
        print()
        print('NO ROUTE FOUND')
    
    except:
        print()
        print('MAPQUEST ERROR')

if __name__ == '__main__':
    main()
    
    
    
    
    
        
