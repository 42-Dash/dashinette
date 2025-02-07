#ifndef BEACON_HPP
# define BEACON_HPP


# include <iostream>
# include <optional>
# include <vector>
# include <list>
# include <map>

// defines the number of tries to find a random solution
# define TRIES 2

using namespace std;

enum class SquareStatus : int8_t {
    TERRAIN_1 = 1,
    TERRAIN_2 = 2,
    TERRAIN_3 = 3,
    TERRAIN_4 = 4,
    TERRAIN_5 = 5,
    TERRAIN_6 = 6,
    TERRAIN_7 = 7,
    TERRAIN_8 = 8,
    TERRAIN_9 = 9,
    NODE = 10,
};

inline SquareStatus operator~(const SquareStatus &square) {
    return static_cast<SquareStatus>(-static_cast<int8_t>(square));
}

struct ParserGrids {
    vector<vector<SquareStatus>> terrain_1;
    vector<vector<SquareStatus>> terrain_2;
    vector<vector<SquareStatus>> terrain_3;
    vector<vector<SquareStatus>> terrain_4;
};

optional<pair<list<int>, ParserGrids>>
parse_input(char **argv);

vector<tuple<int, int>>
find_placement_random(const list<int> &beacon, vector<vector<SquareStatus>> &lines);

#endif // BEACON_HPP
