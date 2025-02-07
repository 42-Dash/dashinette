#ifndef BEACON_HPP
# define BEACON_HPP


# include <iostream>
# include <optional>
# include <vector>
# include <list>
# include <stack>

using namespace std;

enum class SquareStatus : uint8_t {
    EMPTY,
    BEACON,
    NODE_COVERED,
    NODE_UNCOVERED
};

extern int best_score;

optional<pair<list<int>, vector<vector<SquareStatus>>>>
parse_input(char **argv);

pair<int, int>
find_placement_smart(const int &beacon, vector<vector<SquareStatus>> &lines);

pair<int, int>
find_placement_greedy(const int &beacon, vector<vector<SquareStatus>> &lines);

void
find_placement_brutforce(stack<int> &beacons, vector<vector<SquareStatus>> &lines, vector<tuple<int, int>> placements);

void
print_solution(const vector<tuple<int, int>> &placements, const vector<vector<SquareStatus>> &lines, bool reversed = false);


#endif // BEACON_HPP
