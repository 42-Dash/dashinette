#include "dash.h"

static inline void printn(const int times, const char c) {
    for (int i = 0; i < times; i++) {
        write(STDOUT_FILENO, &c, 1);
    }
}

static t_point map_search(const t_map *map, const char to_find) {
    for (int row = 0; row < map->height; row++) {
        for (int col = 0; col < map->width; col++) {
            if (map->map[row][col] == to_find) {
                return (t_point){row, col};
            }
        }
    }
    return (t_point){-1, -1};
}

void print_dummy_solution(const t_map *map) {
    const t_point start = map_search(map, START_CHAR);
    const t_point finish = map_search(map, FINISH_CHAR);
    const int row_dif = start.row - finish.row;
    const int col_dif = start.col - finish.col;

    if (row_dif < 0) {
        printn(ABS(row_dif), DOWN);
    } else {
        printn(ABS(row_dif), UP);
    }
    if (col_dif < 0) {
        printn(ABS(col_dif), RIGHT);
    } else {
        printn(ABS(col_dif), LEFT);
    }
    printf("\n");
}
