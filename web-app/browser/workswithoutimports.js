/**
 * minesweeper.js is a module to model and run "Minesweeper" with a little thematic twist
 * https://en.wikipedia.org/wiki/Minesweeper_(video_game)
 * @namespace Galactic_Minesweeper
 * @author R. Beam Suwiwatchai
 * @version 2022
 */

/**
 * Set variables that we can change
 * work needed to be done to make it adjustable by users
 */

var components = {
    num_of_rows : 8,
    num_of_cols : 8,
    num_of_bombs : 10,
    bomb : "👾",
    alive : true,
    colors : {1: "blue", 2: "green", 3: "red", 4: "purple", 5: "maroon", 6: "turquoise", 7: "black", 8: "grey"}
}

/**
 * Function used to start the game
 * @memberof Galactic_Minesweeper
 * @function startGame
 * @return {table}
 */

function startGame() {
    components.bombs = minelaying();
    document.getElementById("field").appendChild(create_table());
}

/**
 * We then need to run a loop to place all of the mines on the board
 * @memberof Galactic_Minesweeper
 * @function minelaying
 * @return {Array} Returns the array of the placed mine
 */
function minelaying() {
    var i, rows = [];
    for (i=0; i<components.num_of_bombs; i++) {
        placeSingleBomb(rows);
    }
    return rows;
}

/**
 * To generate a random row to generate a bomb in
 * @function randomnum
 * @return {number} random number
 */

function randomnum(row_or_col) {
    return Math.floor(Math.random() * row_or_col);
}

/**
 * To be able to place all of the mines at once, we must have a function to
 * individually place the mines
 * @function placeSingleBomb
 * @param {string} bombs Takes the emoji for the bomb we chose into the cell
 * @returns {Array}
 */

function placeSingleBomb(bombs) {

    var nrow, ncol, row, col;
    /** Adjustment needed to make this function pure */
    nrow = randomnum(components.num_of_rows);
    ncol = randomnum(components.num_of_cols);
    row = bombs[nrow];
    if (!row) {
        row = [];
        bombs[nrow] = row;
    }
    col = row[ncol];
    if (!col) {
        row[ncol] = true;
        return
    }
    else {
        placeSingleBomb(bombs);
    }
}

/**
 * We then need to generate the ID for each cell to be added to the row element
 * @memberof Galactic_Minesweeper
 * @function generate_cell_id
 * @param {number} [i] Takes the x-coordinate
 * @param {number} [j] Takes the y-coordinate
 */
function generate_cell_id(i, j) {
    return "cell-" + i + "-" + j;
}

/**
 * We would then need to generate the table for everything to exists in
 * @memberof Galactic_Minesweeper
 * @function create_table
 */
function create_table() {
    var table, row, td, i, j;
    table = document.createElement("table");
    for (i=0; i<components.num_of_rows; i++) {
        row = document.createElement("tr");
        for (j=0; j<components.num_of_cols; j++) {
            td = document.createElement("td");
            td.id = generate_cell_id(i, j);
            row.appendChild(td);
            addCellListeners(td, i, j);
        }
        table.appendChild(row);
    }
    return table;
}

function addCellListeners(td, i, j) {
    td.addEventListener("mousedown", function(event) {
        if (!components.alive) {
            return;
        }
        components.mousewhiches += event.which;
        if (event.which === 3) {
            return;
        }
        if (this.flagged) {
            return;
        }
        this.style.backgroundColor = "lightgrey";
    });

    td.addEventListener("mouseup", function(event) {
      
        if (!components.alive) {
            return;
        }

        if (this.clicked && components.mousewhiches == 4) {
            performMassClick(this, i, j);
        }

        components.mousewhiches = 0;
        
        if (event.which === 3) {
           
            if (this.clicked) {
                return;
            }
            if (this.flagged) {
                this.flagged = false;
                this.textContent = '';
            } else {
                this.flagged = true;
                this.textContent = components.flag;
            }

            event.preventDefault();
            event.stopPropagation();
          
            return false;
        } 
        else {
            handleCellClick(this, i, j);
        }
    });

    td.oncontextmenu = function() { 
        return false; 
    };
}

function handleCellClick(cell, i, j) {
    if (!components.alive) {
        return;
    }

    if (cell.flagged) {
        return;
    }

    cell.clicked = true;

    if (components.bombs[i][j]) {
        cell.style.color = 'red';
        cell.textContent = components.bomb;
        game_over_check();
        
    }
    else {
        cell.style.backgroundColor = 'lightGrey';
        num_of_bombs = check_adjacent_bombs(i, j);
        if (num_of_bombs) {
            cell.style.color = components.colors[num_of_bombs];
            cell.textContent = num_of_bombs;
        } 
        else {
            clickAdjacentBombs(i, j);
        }
    }
}

/**
 * After the user clicks the cell, we need a way to calculate the numbers of
 * mines adjacent to said cell
 * @memberof Galactic_Minesweeper
 * @function check_adjacent_bombs
 * @param {number} [row] takes in the row of the clicked cell
 * @param {number} [col] takes in the column of the clicked cell
 * @returns {number} Returns the number of adjacent bomb to display in the cell
 */
function check_adjacent_bombs(row, col) {
    var i, j, num_of_bombs;
    num_of_bombs = 0;

    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            if (components.bombs[row + i] && components.bombs[row + i][col + j]) {
                num_of_bombs++;
            }
        }
    }
    return num_of_bombs;
}

function adjacentFlags(row, col) {
    var i, j, num_flags;
    num_flags = 0;

    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            cell = document.getElementById(generate_cell_id(row + i, col + j));
            if (!!cell && cell.flagged) {
                num_flags++;
            }
        }
    }
    return num_flags;
}

function clickAdjacentBombs(row, col) {
    var i, j, cell;
    
    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            cell = document.getElementById(generate_cell_id(row + i, col + j));
            if (!!cell && !cell.clicked && !cell.flagged) {
                handleCellClick(cell, row + i, col + j);
            }
        }
    }
}

function performMassClick(cell, row, col) {
    if (adjacentFlags(row, col) === check_adjacent_bombs(row, col)) {
        clickAdjacentBombs(row, col);
    }
}

/**
 * Lastly we need a function to constantly check if the game is over yet
 * @memberof Galactic_Minesweeper
 * @function game_over_check
 */
function game_over_check() {
    components.alive = false;
    document.getElementById('lost').style.display="block";
}

/**
 * After the game is lost we need to allow the user to reset their game without
 * refreshing the page and read the intro again
 * @memberof Galactic_Minesweeper
 * @function reload
 */

function reload(){
    window.location.reload();
}


window.addEventListener("load", function() {
    document.getElementById("lost").style.display="none";
    startGame();
});