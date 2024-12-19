#include "beacon.hpp"
#include <sys/_types/_int8_t.h>

static inline auto calculate_range(int pos, int radius, int limit) -> pair<int, int> {
    return {max(pos - radius, 0), min(pos + radius + 1, limit)};
}

template <typename Func>
static void apply_to_coverage_area(int row, int col, int radius, const vector<vector<SquareStatus>>& grid, Func func) {
    auto [row_start, row_end] = calculate_range(row, radius, grid.size());
    auto [col_start, col_end] = calculate_range(col, radius, grid[0].size());
    for (int i = row_start; i < row_end; ++i) {
        for (int j = col_start; j < col_end; ++j) {
            func(i, j);
        }
    }
}

static auto mark_placement(const tuple<int, int, int, int> &placement, vector<vector<SquareStatus>> &lines) -> void {
    apply_to_coverage_area(get<0>(placement), get<1>(placement), get<3>(placement), lines, [&](int i, int j) {
        if (lines[i][j] == SquareStatus::NODE) {
            lines[i][j] = ~SquareStatus::NODE;
        }
    });

    lines[get<0>(placement)][get<1>(placement)] = ~lines[get<0>(placement)][get<1>(placement)];
}

static auto count_placement_score(const int &beacon, const int &row, const int &col, vector<vector<SquareStatus>> &lines) -> tuple<int, int, int, int> {
    int score = 0;
    apply_to_coverage_area(row, col, beacon, lines, [&](int i, int j) {
        if (lines[i][j] == SquareStatus::NODE) {
            score++;
        }
    });
    return {row, col, score, beacon};
}

static auto find_first_empty(const vector<vector<SquareStatus>> &lines) -> pair<int, int> {
    for (size_t row = 0; row < lines.size(); row++) {
        for (size_t col = 0; col < lines[0].size(); col++) {
            if (lines[row][col] >= SquareStatus::TERRAIN_1
                && lines[row][col] <= SquareStatus::TERRAIN_9) {
                return {row, col};
            }
        }
    }
    throw runtime_error("No empty square found");
}

auto find_best_placement(const int &beacon, vector<vector<SquareStatus>> &lines) -> pair<int, int> {
    if (lines.size() - beacon <= 1 || lines[0].size() - beacon <= 1) {
        return find_first_empty(lines);
    }
    const auto row_range = make_pair(
        min(static_cast<int>(lines.size() - beacon), beacon),
        max(static_cast<int>(lines.size() - beacon), beacon)
    );
    const auto col_range = make_pair(
        min(static_cast<int>(lines[0].size() - beacon), beacon),
        max(static_cast<int>(lines[0].size() - beacon), beacon)
    );
    auto [row, col] = find_first_empty(lines);

    tuple<int, int, int, int> best_placement = {
        row, col, 0,
        beacon + static_cast<int8_t>(lines[row][col])
    };
    tuple<int, int, int, int> temp_placement = {0, 0, 0, 0};

    for (int row = row_range.first; row < row_range.second; row++) {
        for (int col = col_range.first; col < col_range.second; col++) {
            if (lines[row][col] >= SquareStatus::TERRAIN_1
                && lines[row][col] <= SquareStatus::TERRAIN_9) {
                temp_placement = count_placement_score(
                    beacon + static_cast<int8_t>(lines[row][col]),
                    row, col, lines
                );
                if (get<2>(temp_placement) > get<2>(best_placement)) {
                    best_placement = temp_placement;
                }
            }
        }
    }

    mark_placement(best_placement, lines);
    return {get<0>(best_placement), get<1>(best_placement)};
}

auto brutforce_best_placement(const int &beacon, vector<vector<SquareStatus>> &lines) -> pair<int, int> {
    const auto row_range = make_pair(0, static_cast<int>(lines.size()));
    const auto col_range = make_pair(0, static_cast<int>(lines[0].size()));

    tuple<int, int, int, int> best_placement = {0, 0, 0, 0};
    tuple<int, int, int, int> temp_placement = {0, 0, 0, 0};

    for (int row = row_range.first; row < row_range.second; row++) {
        for (int col = col_range.first; col < col_range.second; col++) {
            if (lines[row][col] >= SquareStatus::TERRAIN_1
                && lines[row][col] <= SquareStatus::TERRAIN_9) {
                temp_placement = count_placement_score(
                    beacon + static_cast<int8_t>(lines[row][col]),
                    row, col, lines
                );
                if (get<2>(temp_placement) > get<2>(best_placement)) {
                    best_placement = temp_placement;
                }
            }
        }
    }

    mark_placement(best_placement, lines);
    return {get<0>(best_placement), get<1>(best_placement)};
}
