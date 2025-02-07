#include "beacon.hpp"
#include <tuple>
#include <cstdlib>
#include <ctime>

static inline auto _calculate_range(int pos, int radius, int limit) -> pair<int, int> {
    return {max(pos - radius, 0), min(pos + radius + 1, limit)};
}

template <typename Func>
static void _apply_to_coverage_area(int row, int col, int radius, const vector<vector<SquareStatus>>& grid, Func func) {
    auto [row_start, row_end] = _calculate_range(row, radius, grid.size());
    auto [col_start, col_end] = _calculate_range(col, radius, grid[0].size());

    for (int i = row_start; i < row_end; ++i) {
        for (int j = col_start; j < col_end; ++j) {
            func(i, j);
        }
    }
}

static auto mark_placement(const tuple<int, int, int> &placement, vector<vector<SquareStatus>> &lines, const int &beacon) -> void {
    _apply_to_coverage_area(get<0>(placement), get<1>(placement), beacon, lines, [&](int i, int j) {
        if (lines[i][j] == SquareStatus::NODE_UNCOVERED) {
            lines[i][j] = SquareStatus::NODE_COVERED;
        }
    });
    lines[get<0>(placement)][get<1>(placement)] = SquareStatus::BEACON;
}

static auto count_placement_score(const int &beacon, const int &row, const int &col, vector<vector<SquareStatus>> &lines) -> tuple<int, int, int> {
    int score = 0;
    _apply_to_coverage_area(row, col, beacon, lines, [&](int i, int j) {
        if (lines[i][j] == SquareStatus::NODE_UNCOVERED) {
            score++;
        }
    });
    return {row, col, score};
}

auto find_placement_random(const list<int> &beacons, vector<vector<SquareStatus>> &lines) -> vector<tuple<int, int>> {
    const int rows = static_cast<int>(lines.size());
    const int cols = static_cast<int>(lines[0].size());
    srand(time(0));

    vector<tuple<int, int>> placements;
    tuple<int, int, int> best;

    for (auto &&beacon : beacons) {
        best = {0, 0, -1};
        for (int i = 0; i < TRIES || get<2>(best) == -1; ++i) {
            const int row = rand() % rows;
            const int col = rand() % cols;

            if (lines[row][col] != SquareStatus::EMPTY) {
                i--;
                continue;
            }

            auto [r, c, score] = count_placement_score(beacon, row, col, lines);
            if (score > get<2>(best)) {
                best = {r, c, score};
            }

        }
        mark_placement(best, lines, beacon);
        placements.emplace_back(tuple<int, int>(get<0>(best), get<1>(best)));
    }

    return placements;
}
