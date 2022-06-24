import R from "../common/ramda.js";

import { empty } from "ramda";

/**
 * DotsAndBoxes.js is a module to model and play "Dots and Boxes" and related games.
 * https://en.wikipedia.org/wiki/Dots_and_Boxes
 * @namespace DotsAndBoxes
 * @author Lena Westerburg Burr
 * @version 2021/22
 */
 const DotsAndBoxes = Object.create(null);

/**
 * A Board is an rectangular grid of dots with spaces that can be filled with lines.
 * Lines can be placed either horizontally or vertically to connect dots.
 * It is implemented as an array of rows
 * @memberof DotsAndBoxes
 * @typedef {DotsAndBoxes.Dot_Line_or_empty[][]} Board
 */


DotsAndBoxes.board_of_dots = function (w, h) {
    const board = Array(2*h-1).fill(Array(2*w-1).fill("."));
    return board;
};

DotsAndBoxes.create_empty_rows = function (board) {
    const new_board = board.map(function(row, row_index) {
        if (row_index % 2 !== 0){
            const new_row = Array(row.length).fill(0);
            return new_row;
        } else {
            return row;
        }
    });
    return new_board;
};

DotsAndBoxes.create_empty_columns = function (board) {
    const new_board = board.map(function (row, row_index){
        const new_row = row.map(function(column, column_index){
            if (column_index % 2 !== 0){
                const new_column = 0;
                return new_column;
            } else {
                return column;
            }
        });
        return new_row;
    });
    return new_board;
};

DotsAndBoxes.create_box_middles = function (board) {
    const new_board = board.map(function (row, row_index){
        const new_row = row.map(function(column, column_index){
            if (column_index % 2 !== 0 && row_index % 2 !== 0){
                const new_column = "X";
                return new_column;
            } else {
                return column;
            }
        });
        return new_row;
    });
    return new_board;
};
/**
 * Create a new empty board.
 * Optionally with a specified width and height,
 * otherwise returns a standard 3 dots wide, 3 dots high board.
 * @memberof DotsAndBoxes
 * @function
 * @param {number} [width = 3] The number of dots that make up the width of the new board.
 * @param {number} [height = 3] The number of dots that make up th height of the new board.
 * @returns {DotsAndBoxes.Board} StartBoard
 */

DotsAndBoxes.starting_board = R.pipe(
    DotsAndBoxes.board_of_dots,
    DotsAndBoxes.create_empty_rows,
    DotsAndBoxes.create_empty_columns,
    DotsAndBoxes.create_box_middles
);

console.log(DotsAndBoxes.starting_board(3,3));

/**
 * Returns which player is the next to make a ply for a board.
 * @memberof DotsAndBoxes
 * @function
 * @param {DotsAndBoxes.Board} board The board to check.
 * @returns {(1 | 2)} The player next to play.
 */
 DotsAndBoxes.player_to_ply = function (board) {  //this relies on whether the previous ply just won a box or not
};


/**
 * Return a new board after a player places a line in a specified row and column.
 * @memberof DotsAndBoxes
 * @function
 * @param {number} column_index The column the player adds the line to
 * @param {number} row_index The row the player adds the line to
 * @param {DotsAndBoxes.Board} board The board state that the ply is made on.
 * @returns {(DotsAndBoxes.Board | undefined)} If the ply was legal,
 *   return the new board, otherwise return `undefined`.
 */
DotsAndBoxes.place_line = function (row_index, column_index, board) {
    const new_board = board;
    if (board[row_index][column_index] === 0){
        new_board[row_index][column_index] = "/";
        return new_board;
    } else {
        return undefined;
    }
};

DotsAndBoxes.current_board = DotsAndBoxes.starting_board(3,3);
DotsAndBoxes.current_board = DotsAndBoxes.place_line(0, 1, DotsAndBoxes.current_board);
DotsAndBoxes.current_board = DotsAndBoxes.place_line(1, 0, DotsAndBoxes.current_board);
DotsAndBoxes.current_board = DotsAndBoxes.place_line(2, 1, DotsAndBoxes.current_board);
DotsAndBoxes.current_board = DotsAndBoxes.place_line(1, 2, DotsAndBoxes.current_board);
console.log(DotsAndBoxes.current_board);

/**
 * Scans the board for new boxes that could have been created from a new line
 * Returns a two dimensional array describing the coordinates of the centres of each of the new boxes
 * @param {DotsAndBoxes.Board} board the board state to check
 * @returns {Array} new_boxes, an array describing the coordinates of the centres of each of the new boxes created. [[row1,col1],[row2,col2], ...]
 */
DotsAndBoxes.new_boxes_created = function (board){
    const new_boxes = [];
    board.forEach((row, row_index, board_array) => row.forEach((element, col_index) => {
        if (element === "X"){
            if (board_array[row_index-1][col_index] === "/"
            && board_array[row_index+1][col_index] === "/"
            && board_array[row_index][col_index-1] === "/"
            && board_array[row_index][col_index+1] === "/") {
                new_boxes.push([row_index, col_index]);
            }
        }
    }));
    return new_boxes;
};

/**
 * Returns whether a new box has been created as a result of the ply just made
 * Used to determine whether the player gets another go or not
 * @param {DotsAndBoxes.Board} board the board to check
 * @returns {boolean} whether or not a new box (or mulptiple new boxes) has been created
 */
DotsAndBoxes.is_new_box_created_on_board = function (board){
    if (DotsAndBoxes.new_boxes_created.length > 0){
        return true;
    } else {
        return false;
    }
};

console.log(DotsAndBoxes.is_new_box_created_on_board(DotsAndBoxes.current_board));
console.log(DotsAndBoxes.new_boxes_created(DotsAndBoxes.current_board));

/**
 * This function places the player number in the centre of any newly created box by that player
 * @param {(1 | 2)} player the player that closed the box i.e. the player whose go it last was
 * @param {Array} array_of_new_boxes array that describes the coordinates of the new boxes created
 * @param {DotsAndBoxes.Board} board the current board state
 * @returns {DotsAndBoxes.Board} an updated version of the board with all closed boxes assigned to a particular player
 */
DotsAndBoxes.close_box = function(player, array_of_new_boxes, board) {
    const new_board = board;
    array_of_new_boxes.forEach((box) => {
        new_board[box[0]][box[1]] = player;
    });
    return new_board;
};

DotsAndBoxes.current_board = DotsAndBoxes.close_box(1,DotsAndBoxes.new_boxes_created(DotsAndBoxes.current_board), DotsAndBoxes.current_board);
console.log (DotsAndBoxes.current_board);

/**
 * This function governs everything that happens in one play for a player and returns the updated board
 * It updates the board such that the line from the play is drawn in and any boxes that were closed with this play are indicated
 * @param {(1 | 2)} player indicates which player is making this play
 * @param {number} row_index the row the player adds a line to
 * @param {number} column_index the column the player adds a line to
 * @param {DotsAndBoxes.Board} board the current board state
 * @returns the updated board after the play
 */

DotsAndBoxes.play_for_player = function(player, row_index, column_index, board){
    let new_board = DotsAndBoxes.place_line(row_index, column_index, board);
    if (DotsAndBoxes.is_new_box_created_on_board){
        new_board = DotsAndBoxes.close_box(player, DotsAndBoxes.new_boxes_created(board), new_board);
    }
    return new_board;
};

/**
 * This function returns how many instances there are of a given character in the board array
 * @param {string} char the character to count instances of
 * @param {DotsAndBoxes.board} board the board to check
 * @returns {number} The number of times the given character appears in the board array
 */
DotsAndBoxes.how_many_char_in_board = function (char, board){
    let no_chars = 0;
    board.forEach(function(row){
        row.forEach(function(column){
            if (column === char){
                no_chars = no_chars + 1;
            }
        });
    });
    return no_chars;
};

/**
 * Returns the number of spaces that are still available for a line to be placed
 * @memberof DotsAndBoxes
 * @function
 * @param {DotsAndBoxes.Board} board The board to test.
 * @returns {number} The number of spaces/moves left
 */
DotsAndBoxes.spaces_left = function(board){
    return DotsAndBoxes.how_many_char_in_board(0, board);
};

/**
 * Returns if a game has ended.
 * Since Dots and Boxes is an impartial game it ends only when there are no more legal moves.
 * @memberof DotsAndBoxes
 * @function
 * @param {DotsAndBoxes.Board} board The board to test.
 * @returns {boolean} Whether the game has ended
 */
DotsAndBoxes.is_ended = function (board){
    if (DotsAndBoxes.spaces_left(board) === 0){
        return true;
    } else {
        return false;
    }
};

/**
 * Returns the maximum number of boxes that can be created on a given board
 * @param {DotsAndBoxes.Board} board uses dimensions of board to calculate
 * @returns {number} the total number of boxes on the board
 */
DotsAndBoxes.max_boxes = function (board){
    const height_in_dots = (board.length+1)/2;
    const width_in_dots = (board[0].length+1)/2;
    const no_boxes_x = width_in_dots - 1;
    const no_boxes_y = height_in_dots - 1;
    return no_boxes_x*no_boxes_y;
};

/**
 * Returns how many boxes a given player has won
 * @param {(1 | 2)} player which player to check boxes for
 * @param {DotsAndBoxes.Board} board the board to check
 * @returns {number} the number of boxes specified player has won
 */
DotsAndBoxes.player_boxes = function (player, board) {
    return DotsAndBoxes.how_many_char_in_board(player, board);   // !! IS THIS WEIRD TO DO?
};

/**
 * Returns whether a specified player has won the game.
 * @memberof DotsAndBoxes
 * @function
 * @param {DotsAndBoxes.Board} board
 * @param {(1 | 2)} player Which player to check has a win.
 * @returns {boolean} Whether the specified player has won
 */
DotsAndBoxes.is_won_for_player = function(player, board){  // DO I NEED THIS FUNCTION AS WELL AS THE ONE BELOW?
    return DotsAndBoxes.player_boxes(player) > DotsAndBoxes.max_boxes(board)/2;
};

/**
 * Returns which player won the game or whether it was a draw
 * @param {DotsAndBoxes.Board} board the board to check
 * @returns {(1|2|"draw")}
 */
DotsAndBoxes.who_won = function(){
    if (DotsAndBoxes.player_boxes(1) > DotsAndBoxes.player_boxes(2)){
        return 1;
    } else if (DotsAndBoxes.player_boxes(2) > DotsAndBoxes.player_boxes(1)){
        return 2;
    } else{
        return "draw";
    }
};

export default Object.freeze(DotsAndBoxes);
  