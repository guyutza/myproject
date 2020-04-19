import connectfour
import common_functions

def main_game() -> None:
    '''Show user interface to the players'''
    
    _show_welcome_banner()

    game_state = connectfour.new_game()

    while True:
        common_functions.show_board(game_state)

        if _player_turns(game_state) == 1:
            print("It's RED turn.")
        elif _player_turns(game_state) == 2:
            print("It's YELLOW turn.")

        print()
        column_num = common_functions.choose_column()
        action = common_functions.choose_action()
        game_state = common_functions.make_action(game_state, column_num, action)

        winner = connectfour.winner(game_state)

        if winner != connectfour.NONE:
            common_functions.show_board(game_state)
            common_functions.stop_game(winner)
 
            break
            
        
        
def _show_welcome_banner() -> None:
    print('Welcome to the connectfour game.')
    print()
    print("The game will ask you to choose columns and actions to play the game.") 
    print("Please follow the instructions and questions to choose columns and actions.")
    print()
    print("Get ready!")
    print()
    print('Starting the game right now ... ')
    print()
    
def _player_turns(game_state: connectfour.GameState) -> str:
    '''Return player turns'''
    return game_state.turn

if __name__ == "__main__":
    main_game()
