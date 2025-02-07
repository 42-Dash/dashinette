#include "beacon.hpp"
#include <tuple>
#include <fstream>
#include <sstream>
#include <algorithm>

static auto get_file_content(const char *fname) -> optional<tuple<size_t, size_t, string>> {
    ifstream file(fname, ios::binary | ios::ate);

    if (!file || !file.is_open()) {
        cerr << "Failed to open file: " << fname << endl;
        return nullopt;
    }

    streamsize size = file.tellg();
    file.seekg(0, ios::beg);

    string buffer(size, '\0');
    if (!file.read(buffer.data(), size)) {
        cerr << "Failed to read file: " << fname << endl;
        return nullopt;
    }

    size_t total_col = buffer.find('\n');
    if (total_col == string::npos) {
        cerr << "Invalid file format: " << fname << endl;
        return nullopt;
    }

    size_t total_row = (size + 1) / (total_col + 1);
    return make_tuple(total_row, total_col, ::move(buffer));
}

static auto read_file(const char *fname) -> optional<vector<vector<SquareStatus>>> {
    const auto file_content = get_file_content(fname);
    if (!file_content) {
        return nullopt;
    }

    const auto &[total_row, total_col, buffer] = *file_content;
    vector<vector<SquareStatus>> lines(total_row);

    for (size_t row = 0; row < total_row; row++) {
        for (size_t col = 0; col < total_col; col++) {
            switch (buffer[row * (total_col + 1) + col]) {
                case '.':
                    lines[row].emplace_back(SquareStatus::EMPTY);
                    break;
                case '*':
                    lines[row].emplace_back(SquareStatus::NODE_UNCOVERED);
                    break;
                default:
                    cerr << "Invalid character: " << buffer[row * (total_col + 1) + col] << endl;
                    return nullopt;
            }
        }
    }

    return lines;
}

static auto parse_beacons(const string &line) -> list<int> {
    list<int> res;
    istringstream iss(line);
    string token;

    while (iss >> token) {
        if (all_of(token.begin(), token.end(), ::isdigit)) {
            res.push_back(stoi(token));
        }
    }

    return res;
}

auto parse_input(char **argv) -> optional<pair<list<int>, vector<vector<SquareStatus>>>> {
    list<int> beacons = parse_beacons(argv[1]);
    auto input = read_file(argv[2]);

    if (!input) {
        return nullopt;
    }

    return make_pair(beacons, *input);
}

static auto total_score(const vector<vector<SquareStatus>> &lines) -> int {
    int score = 0;

    for (auto &&line : lines) {
        for (auto &&square : line) {
            if (square == SquareStatus::NODE_COVERED) {
                score++;
            }
        }
    }
    return score;
}

auto print_solution(
    const vector<tuple<int, int>> &placements,
    const vector<vector<SquareStatus>> &lines
) -> void {
    static int cost = 0;

    const int current = total_score(lines);
    if (current <= cost) {
        return;
    } else {
        cost = current;
    }


    auto sz = placements.size();
    for (auto it = placements.rbegin(); it != placements.rend(); it++) {
        cout << get<0>(*it) << "," << get<1>(*it);
        if (--sz) {
            cout << "|";
        }
    }
    cout << endl;
}
