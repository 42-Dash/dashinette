#include "beacon.hpp"
#include <tuple>
#include <vector>
#include <array>

ostream &operator<<(ostream &os, const SquareStatus &status) {
    char c;
    if (status == SquareStatus::NODE) {
        c = '*';
    } else if (status == ~SquareStatus::NODE) {
        c = 'X';
    } else if (static_cast<int8_t>(status) > 0) {

        c = static_cast<char>(static_cast<int>(status) + '0');
    } else {
        c = '#';
    }
    os << c;
    return os;
}

auto total_score(const vector<vector<SquareStatus>> &lines) -> pair<int, int> {
    auto score = 0, total = 0;
    for (auto &&line : lines) {
        for (auto &&square : line) {
            if (square == ~SquareStatus::NODE) {
                score++;
                total++;
            } else if (square == SquareStatus::NODE) {
                total++;
            }
        }
    }
    return {score, total};
}

auto print_solution(
    const vector<tuple<int, int>> &placements,
    const vector<vector<SquareStatus>> &lines,
    const array<int, 4> &order
) -> void {
    cout << order[0] << order[1] << order[2] << order[3] << '|';
    auto sz = placements.size();
    for (auto &&position : placements) {
        cout << get<0>(position) << "," << get<1>(position);
        if (--sz) {
            cout << "|";
        }
    }
    cout << endl;

    auto score = total_score(lines);
    cout << get<0>(score) << "/" << get<1>(score) << endl;
}

auto clear_mask(vector<vector<SquareStatus>> &lines) -> void {
    for (auto &&line : lines) {
        for (auto &&square : line) {
            if (static_cast<int8_t>(square) < 0) {
                square = ~square;
            }
        }
    }
}

auto recollect_vector(const ParserGrids &mazes, const int &iteration) -> vector<vector<SquareStatus>> {
    map<int, array<int, 4>> combs = {
        {0, {0, 1, 2, 3}},
        {1, {0, 1, 3, 2}},
        {2, {0, 2, 1, 3}},
        {3, {0, 2, 3, 1}},
        {4, {0, 3, 1, 2}},
        {5, {0, 3, 2, 1}},
        {6, {1, 0, 2, 3}},
        {7, {1, 0, 3, 2}},
        {8, {1, 2, 0, 3}},
        {9, {1, 2, 3, 0}},
        {10, {1, 3, 0, 2}},
        {11, {1, 3, 2, 0}},
        {12, {2, 0, 1, 3}},
        {13, {2, 0, 3, 1}},
        {14, {2, 1, 0, 3}},
        {15, {2, 1, 3, 0}},
        {16, {2, 3, 0, 1}},
        {17, {2, 3, 1, 0}},
        {18, {3, 0, 1, 2}},
        {19, {3, 0, 2, 1}},
        {20, {3, 1, 0, 2}},
        {21, {3, 1, 2, 0}},
        {22, {3, 2, 0, 1}},
        {23, {3, 2, 1, 0}},
    };

    auto comb = combs[iteration];
    auto grids = array{mazes.terrain_1, mazes.terrain_2, mazes.terrain_3, mazes.terrain_4};
    auto new_order = array{grids[comb[0]], grids[comb[1]], grids[comb[2]], grids[comb[3]]};

    vector<vector<SquareStatus>> new_lines;
    for (size_t i = 0; i < mazes.terrain_1.size(); i++) {
        vector<SquareStatus> merged(new_order[0][i].begin(), new_order[0][i].end());
        merged.insert(merged.end(), new_order[1][i].begin(), new_order[1][i].end());
        new_lines.emplace_back(merged);
    }

    for (size_t i = 0; i < mazes.terrain_1.size(); i++) {
        vector<SquareStatus> merged(new_order[2][i].begin(), new_order[2][i].end());
        merged.insert(merged.end(), new_order[3][i].begin(), new_order[3][i].end());
        new_lines.emplace_back(merged);
    }

    return new_lines;
}

auto main(int argc, char **argv) -> int {
    if (argc != 6) {
        cerr << "Usage: " << argv[0] << " <beacons> <inputfile1> <inputfile2> <inputfile3> <inputfile4>" << endl;
        return 1;
    }

    const auto input = parse_input(argv);
    if (!input) {
        cerr << "Failed to parse input" << endl;
        return 1;
    }

    vector<vector<SquareStatus>> lines;
    vector<tuple<int, int>> placements;
    tuple<int, int> score;

    auto [beacons, mazes] = *input;
    auto order = array{1, 2, 3, 4};
    auto best_printed = 0;


    for (int iteration = 0; iteration < 24; iteration++) {
        lines = recollect_vector(mazes, iteration);
        for (auto &&beacon : beacons) {
            placements.emplace_back(find_best_placement(beacon, lines));
        }
        score = total_score(lines);
        if (get<0>(score) > best_printed) {
            best_printed = get<0>(score);
            print_solution(placements, lines, order);
        }
        clear_mask(lines);
        placements.clear();

        for (auto &&beacon : beacons) {
            placements.emplace_back(brutforce_best_placement(beacon, lines));
        }
        score = total_score(lines);
        if (get<0>(score) > best_printed) {
            best_printed = get<0>(score);
            print_solution(placements, lines, order);
        }
        clear_mask(lines);
        placements.clear();
    }
    return 0;
}
