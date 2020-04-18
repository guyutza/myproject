# Yuze Gu Mapquest Program Manual

# Description: This program will describe a trip taken between a sequence of locations, the goal being to travel from the first location to the second, then from the second location to the third, and so on, until reaching the last location. 

# Based on the user's input, it will show different information about the trip, such as turn-by-turn directions, distances and times, etc.

# How to use it?
# 1. Users have to run the program in Python idle and have network connections.

# 2. The program takes several lines of input to show the correct output:
# •	An integer whose value is at least 2, alone on a line, that specifies how many locations the trip will consist of.
# •	 If there are n locations, the next n lines of input will each describe one location. Each location can be a city such as Irvine, CA, an address such as 4545 Campus Dr, Irvine, CA, or anything that the Open MapQuest API will accept as a location.   
# •	A positive integer (i.e., whose value is at least 1), alone on a line, that specifies how many outputs will need to be generated.
# •	If there are m outputs, the next m lines of input will each describe one output. Each output can be one of the following:
#   o	STEPS for step-by-step directions, meaning a brief description of each maneuver (e.g., a turn, entering or exiting a freeway, etc.) you would have to make to drive from one location to another.
#   o	TOTALDISTANCE for the total distance traveled if completing the entire trip.
#   o	TOTALTIME for the total estimated time to complete the entire trip.
#   o	LATLONG for the latitude and longitude of each of the locations specified in the input.
#   o	ELEVATION for the elevation, in feet, of each of the locations specified in the input.


# 3. Successful examples:
# Input:
# 3
# 4533 Campus Dr, Irvine, CA
# 1111 Figueroa St, Los Angeles, CA
# 3799 S Las Vegas Blvd, Las Vegas, NV
# 5
# LATLONG
# STEPS
# TOTALTIME
# TOTALDISTANCE
# ELEVATION

# Output:

# LATLONGS
# 33.68N 117.77W
# 34.02N 118.41W
# 36.11N 115.17W

# DIRECTIONS
# West on Campus Dr.
# Right on Bristol
# CA-73 North
# Transition to I-405 North
# Transition to I-110 North
# Exit 9th Street
# South on S Figueroa St.
# Left on W 18th St.
# Enter I-10 East from W 18th St.
# Transition to I-15 North
# Exit S Las Vegas Blvd.

# TOTAL TIME: 317 minutes

# TOTAL DISTANCE: 365 miles

# ELEVATIONS
# 542
# 211
# 2001

# Directions Courtesy of MapQuest; Map Data Copyright OpenStreetMap Contributors
