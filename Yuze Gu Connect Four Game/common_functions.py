import connectfour

def show_board(game_state:connectfour.GameState) -> None:
    '''print the board'''
    for i in range(connectfour.BOARD_COLUMNS):
        print(i+1, end = ' ')
    print()

    for row in range(connectfour.BOARD_ROWS):
        for col in range(connectfour.BOARD_COLUMNS):
            if game_state.board[col][row] == connectfour.NONE:
                print('. ', end = '')
            elif game_state.board[col][row] == 1:
                print('R'+ ' ', end = '')
            elif game_state.board[col][row] == 2:
                print('Y' + ' ', end = '')
        print()
    print()


def choose_column() -> int:
    '''Ask user to choose a column'''
    while True:
        x = input("Choose a column: ")
        try:
            if type(int(x)) == int:
                result = int(x)
                if (result > 0 and result <= connectfour.BOARD_COLUMNS):
                    return result
                else:
                    print("Invalid number, please choose a column.")
            
        except ValueError:
            print("Invalid input, please input a number.")

def choose_action() -> str:
    '''Choose to drop or pop'''
    while True:
        x = input("Choose an action from drop or pop: ")
        if x in ['drop', 'pop']:
            return x
        else:
            print("Please enter drop or pop.")

def make_action(game_state:connectfour.GameState, column_num: int, action: str) -> None:
    '''Make action according to the column and action'''
    try:
        if action == 'drop':
            return connectfour.drop(game_state, column_num - 1)
        if action == 'pop':
            return connectfour.pop(game_state, column_num - 1)
    except connectfour.InvalidMoveError:
        print("You entered an invalid move.")
        return game_state
    except connectfour.GameOverError:
        print("Game is already over.")
        return game_state

def stop_game(final:str) -> None:
    '''check if any player wins'''
    if final == connectfour.RED:
        print("Red wins. Congratulations!")
    elif final == connectfour.YELLOW:
        print("Yellow wins. Congratulations!")
    
        
            
