#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <deque>
#include <set>

using namespace std;

typedef struct s_point {
	int row;
	int col;
} t_point;

inline bool operator<(const t_point &lhs, const t_point &rhs) {
	return (lhs.row < rhs.row || (lhs.row == rhs.row && lhs.col < rhs.col));
}

inline bool operator==(const t_point &lhs, const t_point &rhs) {
	return (lhs.row == rhs.row && lhs.col == rhs.col);
}

typedef struct s_node {
	t_point point;		// current node
	int g; 				// cost from start to current node
	double h; 			// heuristic cost from current node to end
	string	path;		// path from start to current node
} t_node;

int full(const t_node &node) {
	return node.g + node.h;
}

inline bool operator<(const t_node &lhs, const t_node &rhs) {
	return (full(lhs) < full(rhs) || (full(lhs) == full(rhs) && lhs.g > rhs.g));
}

inline bool operator==(const t_node &lhs, const t_node &rhs) {
	return (lhs.point == rhs.point);
}

double weight = 0;

const vector<string> read_file(const string &filename) {
	ifstream file(filename);
	vector<string> lines;

	if (file.is_open()) {
		string line;
		while (getline(file, line)) {
			lines.push_back(line);
		}
		file.close();
	}
	return lines;
}

bool exists(const set<t_point> &closed, const t_point &node) {
	return closed.find(node) != closed.cend();
}

void add(deque<t_node> &open, const t_node &node) {
	if (open.empty()) {
		open.push_back(node);
		return;
	}

	deque<t_node>::iterator it = lower_bound(open.begin(), open.end(), node);
	if (it != open.end() && *it == node) {
		if (node < *it) {
			*it = node;
		}
	} else {
		open.insert(it, node);
	}
}

t_point find_char(const vector<string> &map, char c) {
	t_point point = { -1, -1 };

	for (size_t i = 0; i < map.size(); i++) {
		const unsigned long col = map[i].find(c);
		if (col != string::npos) {
			point.row = i;
			point.col = col;
			break;
		}
	}
	return point;
}

static inline double heuristic(const t_point &start, const t_point &end) {
	return (abs(start.row - end.row) + abs(start.col - end.col)) * weight;
}


static inline int calc_g(const t_node &current, const t_point &next, const vector<string> &map) {
	if (map[next.row][next.col] == 'G') {
		return current.g;
	}
	return current.g + map[next.row][next.col] - '0';
}

static inline char calc_path(const t_point &current, const t_point &next) {
	if (current.row < next.row) {
		return 'D';
	} else if (current.row > next.row) {
		return 'U';
	} else if (current.col < next.col) {
		return 'R';
	} else {
		return 'L';
	}
}

// A* algorithm
pair<string, int> find_path(
	const vector<string> &map,
	const t_point &start,
	const t_point &end
) {
	vector<pair<int, int> > directions;
	deque<t_node>	open;
	set<t_point>	closed;

	t_node node = { start, 0, heuristic(start, end), "" };
	add(open, node);
	directions.push_back(make_pair(-1, 0));
	directions.push_back(make_pair(1, 0));
	directions.push_back(make_pair(0, 1));
	directions.push_back(make_pair(0, -1));

	while (!open.empty()) {
		t_node current = open.front();
		open.pop_front();

		if (current.point == end) {
			return pair<string, int>(current.path, current.g);
		}

		for (int i = 0; i < 4; i++) {
			const pair<int, int> &dir = directions[i];
			t_point next = { current.point.row + dir.first, current.point.col + dir.second };

			if (next.row < 0 || next.row >= (int)map.size() || next.col < 0 || next.col >= (int)map[next.row].size()) {
				continue;
			}

			t_node neighbor = {
				next,
				calc_g(current, next, map),
				heuristic(next, end),
				current.path + calc_path(current.point, next)
			};

			if (exists(closed, neighbor.point)) {
				continue;
			}

			add(open, neighbor);
		}
		closed.insert(current.point);
	}
	return pair<string, int>("You shall not pass!", 0); // another trust issue
}

static double count_average(const vector<string> &map) {
	double sum = 0;
	double count = 0;

	for (size_t i = 0; i < map.size(); i++) {
		for (size_t j = 0; j < map[i].size(); j++) {
			if (map[i][j] >= '0' && map[i][j] <= '9') {
				sum += map[i][j] - '0';
				count++;
			}
		}
	}
	return (count > 0) ? sum / count : 0.;
}

int main(int argc, char **argv) {
	if (!(argc == 2 || argc == 3)) {
		return 1;
	}
	const vector<string> &input = read_file(argv[1]);
	const t_point start = find_char(input, 'M');
	const t_point end = find_char(input, 'G');
	int best = 2147483647;

	if (argc == 2) {
		weight = count_average(input);
	} else {
		weight = stod(argv[2]);
	}

	if (start.row == -1 || end.row == -1) { // trust issues
		return 1;
	}

	// now the algo finds only one path, where heuristic is manhattan distance * weight cost
	// A* where heuristic is 0 - Dijkstra (always finds the cheapest path)
	// if you want to make it better, you can uncomment the following line
	// for (;weight > 0; weight -= 1)
	{
		pair<string, int> result = find_path(input, start, end);
		if (result.second < best) {
			cout << result.first << endl;
			best = result.second;
		}
	}
	return 0;
}
