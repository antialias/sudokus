var start = new Date();
var board = [
[8,0,0,0,0,0,0,0,0],
[0,0,3,6,0,0,0,0,0],
[0,7,0,0,9,0,2,0,0],
[0,5,0,0,0,7,0,0,0],
[0,0,0,0,4,5,7,0,0],
[0,0,0,1,0,0,0,3,0],
[0,0,1,0,0,0,0,6,8],
[0,0,8,5,0,0,0,1,0],
[0,9,0,0,0,0,4,0,0],
];
// var board = [
// [5,3,0,0,7,0,0,0,0],
// [6,0,0,1,9,5,0,0,0],
// [0,9,8,0,0,0,0,6,0],
// [8,0,0,0,6,0,0,0,3],
// [4,0,0,8,0,3,0,0,1],
// [7,0,0,0,2,0,0,0,6],
// [0,6,0,0,0,0,2,8,0],
// [0,0,0,4,1,9,0,0,5],
// [0,0,0,0,8,0,0,7,9]
// ];

var printboard = function () {
    var i;
    var j;
    for(i=0; i < board.length; ++i) {
        console.log(board[i].join(''));
    }
    console.log("");
};
var validateBoard = function () {
    var i;
    var j;
    var anyempty = false;
    for(i=0; i < board.length; ++i) {
        var rows = {};
        var cols = {};
        var grids = {};
        for(j=0; j < board[i].length; ++j) {
            var rowv = board[i][j];
            var colv = board[j][i];
            var gridx = 3 * (i % 3);
            var gridy = 3 * Math.floor(i / 3);
            gridx += j % 3;
            gridy += Math.floor(j / 3);
            var gridv = board[gridx][gridy];
            if (rowv && rows[rowv]) {
                // console.log("row " + i + j);
                return false;
            }
            if (colv && cols[colv]) {
                // console.log("col " + i + j);
                return false;
            }
            if (gridv && grids[gridv]) {
                // console.log("grid " + i + j);
                return false;
            }
            anyempty = anyempty || !rowv;
            grids[gridv] = true;
            cols[colv] = true;
            rows[rowv] = true;
        }
    }
    if (!anyempty) {
        return true;
    }
};
var nextempty = function () {
    var i,j;
    for(i=0; i < board.length; ++i) {
        for(j=0; j < board[i].length; ++j) {
            if (0 === board[i][j]) {
                return {i:i, j:j};
            }
        }
    }
};
var s = [];
var p;
var n;
var ne;
ne = nextempty();
s.push({n:9, i: ne.i, j: ne.j});
var backtrack = false;
var count = 0;
if (false === validateBoard()) {
    console.log("board isn't valid to begin with");
}
while(true) {
    ++count;
    if (backtrack) {
        l = s.pop();
        if (!l) {
            console.log("no valid solution exists");
            break;
        }
        ++board[l.i][l.j];
        if (board[l.i][l.j] > 9) {
            board[l.i][l.j] = 0;
            continue;
        }
        s.push(l);
        backtrack = false;
    }
    if (false === validateBoard()) {
        backtrack = true;
        continue;
    }
    ne = nextempty();
    if (!ne) {
        console.log("solved");
        printboard();
        break;
    }
    board[ne.i][ne.j] = 1;
    s.push(ne);
}
console.log(count + " iterations");
console.log("took " + (new Date() - start) + "ms");
// console.log(validateBoard());