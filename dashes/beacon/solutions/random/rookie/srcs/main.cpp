#include "beacon.hpp"
#include <tuple>

auto show_map(const vector<vector<SquareStatus>> &lines) -> void {
    for (auto &&line : lines) {
        for (auto &&square : line) {
            switch (square) {
                case SquareStatus::EMPTY:
                    cout << ".";
                    break;
                case SquareStatus::NODE_UNCOVERED:
                    cout << "*";
                    break;
                case SquareStatus::NODE_COVERED:
                    cout << "X";
                    break;
                case SquareStatus::BEACON:
                    cout << "@";
                    break;
                default:
                    cout << "?";
                    break;
            }
        }
        cout << endl;
    }
}

auto show_score(const vector<vector<SquareStatus>> &lines) -> void {
    auto score = 0, total = 0;

    for (auto &&line : lines) {
        for (auto &&square : line) {
            if (square == SquareStatus::NODE_COVERED) {
                score++;
                total++;
            } else if (square == SquareStatus::NODE_UNCOVERED) {
                total++;
            }
        }
    }
    cout << score << "/" << total << endl;
}

auto main(int argc, char **argv) -> int {
    if (argc != 3) {
        cerr << "Usage: " << argv[0] << " <beacons> <input>" << endl;
        return 1;
    }

    const auto input = parse_input(argv);
    if (!input) {
        cerr << "Failed to parse input" << endl;
        return 1;
    }

    auto [beacons, lines] = *input;

    auto placements = find_placement_random(beacons, lines);
    print_solution(placements, lines);

#ifdef DEBUG
    show_map(lines);
    show_score(lines);
#endif // DEBUG

    return 0;
}
