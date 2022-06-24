import Galactic_Minesweeper from "../common/minesweeper.mjs";

var components = {
    num_of_rows : 8,
    num_of_cols : 8,
    num_of_bombs : 10,
    bomb : "👾",
    alive : true,
    colors : {1: "blue", 2: "green", 3: "red", 4: "purple", 5: "maroon", 6: "turquoise", 7: "black", 8: "grey"}
}

// function create_table() {
//     var table, row, td, i, j;
//     table = document.createElement("table");
//     for (i=0; i<components.num_of_rows; i++) {
//         row = document.createElement("tr");
//         for (j=0; j<components.num_of_cols; j++) {
//             td = document.createElement("td");
//             // td.id = generate_cell_id(i, j);
//             row.appendChild(td);
//         }
//         table.appendChild(row);
//     }
//     return table;
// }

document.getElementById("field").appendChild(Galactic_Minesweeper.create_table());