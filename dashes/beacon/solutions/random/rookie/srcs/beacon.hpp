#ifndef BEACON_HPP
# define BEACON_HPP


# include <iostream>
# include <optional>
# include <vector>
# include <list>
# include <stack>

// defines the number of tries to find a random solution
# define TRIES 50

using namespace std;

enum class SquareStatus : uint8_t {
    EMPTY,
    BEACON,
    NODE_COVERED,
    NODE_UNCOVERED
};

optional<pair<list<int>, vector<vector<SquareStatus>>>>
parse_input(char **argv);

void
print_solution(const vector<tuple<int, int>> &placements, const vector<vector<SquareStatus>> &lines);

vector<tuple<int, int>>
find_placement_random(const list<int> &beacon, vector<vector<SquareStatus>> &lines);


#endif // BEACON_HPP
