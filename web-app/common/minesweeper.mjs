/**
 * minesweeper.js is a module to model and run "Minesweeper" with a little thematic twist
 * https://en.wikipedia.org/wiki/Minesweeper_(video_game)
 * @namespace Galactic_Minesweeper
 * @author R. Beam Suwiwatchai
 * @version 2022
 */
 const Galactic_Minesweeper = Object.create(null);

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

Galactic_Minesweeper.startGame = function() {
    components.bombs = Galactic_Mineseeper.minelaying();
    document.getElementById("field").appendChild(Galactic_Mineseeper.create_table());
}

/**
 * We then need to run a loop to place all of the mines on the board
 * @memberof Galactic_Minesweeper
 * @function minelaying
 * @return {Array} Returns the array of the placed mine
 */
Galactic_Minesweeper.minelaying = function() {
    var i, rows = [];
    for (i=0; i<components.num_of_bombs; i++) {
        Galactic_Mineseeper.placeSingleBomb(rows);
    }
    return rows;
}

/**
 * To be able to place all of the mines at once, we must have a function to
 * individually place the mines
 * @param {string} bombs Takes the emoji for the bomb we chose into the cell
 * @returns {Array}
 */

Galactic_Minesweeper.placeSingleBomb = function(bombs) {

    var nrow, ncol, row, col;
    /** Adjustment needed to make this function pure */
    nrow = Math.floor(Math.random() * components.num_of_rows);
    ncol = Math.floor(Math.random() * components.num_of_cols);
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
        Galactic_Mineseeper.placeSingleBomb(bombs);
    }
}

/**
 * We then need to generate the ID for each cell to be added to the row element
 * @memberof Galactic_Minesweeper
 * @function generate_cell_id
 * @param {number} [i] Takes the x-coordinate
 * @param {number} [j] Takes the y-coordinate
 */
Galactic_Minesweeper.generate_cell_id = function(i, j) {
    return "cell-" + i + "-" + j;
}

/**
 * We would then need to generate the table for everything to exists in
 * @memberof Galactic_Minesweeper
 * @function create_table
 */
Galactic_Minesweeper.create_table = function() {
    var table, row, td, i, j;
    table = document.createElement("table");
    for (i=0; i<components.num_of_rows; i++) {
        row = document.createElement("tr");
        for (j=0; j<components.num_of_cols; j++) {
            td = document.createElement("td");
            td.id = Galactic_Minesweeper.generate_cell_id(i, j);
            row.appendChild(td);
            Galactic_Minesweeper.addCellListeners(td, i, j);
        }
        table.appendChild(row);
    }
    return table;
}

Galactic_Minesweeper.ddCellListeners = function(td, i, j) {
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
            Galactic_Minesweeper.handleCellClick(this, i, j);
        }
    });

    td.oncontextmenu = function() { 
        return false; 
    };
}

Galactic_Minesweeper.handleCellClick = function(cell, i, j) {
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
        Galactic_Minesweeper.game_over_check();
        
    }
    else {
        cell.style.backgroundColor = 'lightGrey';
        num_of_bombs = Galactic_Minesweeper.check_adjacent_bombs(i, j);
        if (num_of_bombs) {
            cell.style.color = components.colors[num_of_bombs];
            cell.textContent = num_of_bombs;
        } 
        else {
            Galactic_Minesweeper.clickAdjacentBombs(i, j);
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
Galactic_Minesweeper.check_adjacent_bombs = function(row, col) {
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

Galactic_Minesweeper.adjacentFlags = function(row, col) {
    var i, j, num_flags;
    num_flags = 0;

    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            cell = document.getElementById(Galactic_Mineseeper.generate_cell_id(row + i, col + j));
            if (!!cell && cell.flagged) {
                num_flags++;
            }
        }
    }
    return num_flags;
}

Galactic_Minesweeper.clickAdjacentBombs = function(row, col) {
    var i, j, cell;
    
    for (i=-1; i<2; i++) {
        for (j=-1; j<2; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            cell = document.getElementById(Galactic_Mineseeper.generate_cell_id(row + i, col + j));
            if (!!cell && !cell.clicked && !cell.flagged) {
                Galactic_Minesweeper.handleCellClick(cell, row + i, col + j);
            }
        }
    }
}

Galactic_Minesweeper.performMassClick = function(cell, row, col) {
    if (Galactic_Mineseeper.adjacentFlags(row, col) === Galactic_Mineseeper.check_adjacent_bombs(row, col)) {
        Galactic_Mineseeper.clickAdjacentBombs(row, col);
    }
}

/**
 * Lastly we need a function to constantly check if the game is over yet
 * @memberof Galactic_Minesweeper
 * @function game_over_check
 */
Galactic_Minesweeper.game_over_check = function() {
    components.alive = false;
    document.getElementById('lost').style.display="block";
}

/**
 * After the game is lost we need to allow the user to reset their game without
 * refreshing the page and read the intro again
 * @memberof Galactic_Minesweeper
 * @function reload
 */

Galactic_Minesweeper.reload = function(){
    window.location.Galactic_Mineseeper.reload();
}

window.addEventListener("load", function() {
    document.getElementById("lost").style.display="none";
    Galactic_Mineweeper.startGame();
});

export default Object.freeze(Galactic_Minesweeper);