#include "beacon.hpp"
#include <tuple>

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

    vector<tuple<int, int>> placements;
    auto [beacons, lines] = *input;
    auto copy = lines;
    auto copy2 = lines;

    for (auto &&beacon : beacons) {
        placements.emplace_back(find_placement_smart(beacon, lines));
    }
    print_solution(placements, lines);

    placements.clear();
    for (auto &&beacon : beacons) {
        placements.emplace_back(find_placement_greedy(beacon, copy));
    }
    print_solution(placements, copy);

    placements.clear();
    stack<int> reveersed_beacons;
    for (auto &&beacon : beacons) {
        reveersed_beacons.push(beacon);
    }

#ifdef BRUTE_FORCE

    find_placement_brutforce(reveersed_beacons, copy2, vector<tuple<int, int>>());

#endif

    return 0;
}
