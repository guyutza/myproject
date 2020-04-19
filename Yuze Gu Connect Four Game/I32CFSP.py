from collections import namedtuple
import socket
import connectfour
import connectfour_console

Connectfourconnection = namedtuple('Connectfourconnection', 'socket socket_in socket_out')


def connect(host: str, port: int) -> Connectfourconnection:
    '''connect to the server'''
    connectfour_socket = socket.socket()
    connectfour_socket.connect((host,port))
    connectfour_socket_in = connectfour_socket.makefile('r')
    connectfour_socket_out = connectfour_socket.makefile('w')

    return Connectfourconnection(socket = connectfour_socket,
                                 socket_in = connectfour_socket_in,
                                 socket_out = connectfour_socket_out)

def hello(connection: Connectfourconnection, username:str) -> None:
    '''login to the server'''
    write_line(connection, 'I32CFSP_HELLO ' + username)
    
def request_AI(connection: Connectfourconnection) -> None:
    write_line(connection, 'AI_GAME')
    
_show_debug_trace = False


def close(connection: Connectfourconnection) -> None:
    connection.socket_in.close()
    connection.socket_out.close()
    connection.socket.close()

def write_line(connection: Connectfourconnection, line:str) -> None:
    '''write lines to server'''
    connection.socket_out.write(line + '\r\n')
    connection.socket_out.flush()
    if _show_debug_trace:
        print('SENT: ' + line)

def read_line(connection: Connectfourconnection) -> str:
    '''read lines from server'''
    result = ''
    result += connection.socket_in.readline()[:-1]

    if _show_debug_trace:
        print('RECEIVED: ' + result)

    return result

