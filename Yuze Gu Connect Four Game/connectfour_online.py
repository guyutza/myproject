import socket
import connectfour
import common_functions
import I32CFSP


def connect_game() -> None:
    '''Connect to the server.'''
    _show_welcome_banner()
    connection = None
    try:
        host_input = input('Please enter the host: ')
        port_input = int(input('Please enter the port: '))
        username = input('Please enter a username: ')

        if port_input == 4444:
            connection = I32CFSP.connect(host_input,port_input)
            I32CFSP.hello(connection, username)
            print()
            print(I32CFSP.read_line(connection))
            print()
            I32CFSP.request_AI(connection)
            print("READY!")
            print()
            main_game(connection)
        else:
            print("It's not the correct port. Cannot enter connect four game.")

    except ValueError:
        print('Invalid input')
    except socket.gaierror:
        print("Cannot connect to server.")
    except ConnectionRefusedError:
        print("It's not the correct server or need to use UCI net or VPN.")
    except OverflowError:
        print("Please enter port number in range from 0-65535.")
            

    finally:
        if connection != None:
            I32CFSP.close(connection)
            print('Game Over!')
            print('Connection ends.')

def main_game(connection: I32CFSP.Connectfourconnection) -> None:
    '''Show user interface to the player'''
    game_state = connectfour.new_game()
    common_functions.show_board(game_state)
    return_message = I32CFSP.read_line(connection)
    while True:
        
        if return_message == 'READY':
            print("It's RED(You)'s turn")
            print()
            game_state = _player_turns(connection, game_state)
            common_functions.show_board(game_state)
            return_message = I32CFSP.read_line(connection)

        elif return_message == 'INVALID':
            return_message = I32CFSP.read_line(connection)
        
        elif return_message == 'OKAY':
            game_state = _AI_turns(connection, game_state)
            common_functions.show_board(game_state)
            return_message = I32CFSP.read_line(connection)

        elif return_message == 'WINNER_RED':
            common_functions.stop_game(connectfour.RED)
            break
        elif return_message == 'WINNER_YELLOW':
            common_functions.stop_game(connectfour.YELLOW)
            break
                
def _AI_turns(connection: I32CFSP.Connectfourconnection, game_state: connectfour.GameState) -> connectfour.GameState:
    '''AI plays'''
    print("It's Yellow(Computer)'s turn.")
    print()
    ai_actions = I32CFSP.read_line(connection)
    ai_action_result = ai_actions.split()[0].lower()
    ai_col_num = int(ai_actions.split()[1])
    print(ai_actions)
    print()
    game_state = common_functions.make_action(game_state, ai_col_num, ai_action_result)
    return game_state
    
    
               
    
    

def _player_turns(connection: I32CFSP.Connectfourconnection, game_state: connectfour.GameState) -> connectfour.GameState:
    '''player plays'''
    column_num = common_functions.choose_column()
    action = common_functions.choose_action()
    print()
    game_state = common_functions.make_action(game_state, column_num, action)
    send_action(connection, action, column_num)
    return game_state 

    
def send_action(connection: I32CFSP.Connectfourconnection, action:str, col_num: int) -> None:
    '''send the action to server'''
    I32CFSP.write_line(connection, action.upper() + ' ' + str(col_num))


def _show_welcome_banner() -> None:
    '''show welcome message'''
    
    print('Welcome to the connect four game online.')
    print()
    print("Please enter the server and port and username to play the game.") 
    print("The game will ask you to choose columns and actions to play the game.") 
    print("Please follow the instructions and questions to choose columns and actions.")
    print("The red turn is your turn and the yellow turn is the AI's turn.")
    
    print()
    

if __name__ == '__main__':
    connect_game()
