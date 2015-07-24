var iterations = 0;
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
var printboard = function () {
    var i;
    var j;
    for(i=0; i < board.length; ++i) {
        console.log(board[i].join(''));
    }
    console.log("");
};
var getMoveIndices = function () {
    var ret = [];
    for(i=0; i < board.length; ++i) {
        for(j=0; j < board[i].length; ++j) {
            if (0 === board[i][j]) {
                ret.push(i*board.length + j);
            }
        }
    }
    return ret;
};

var validMove = function (i, j, c) {
    var k;
    for(k = 0; k < board.length; ++k) {
        if (c === board[k][j]) { // row
            return false;
        }
        if (c === board[i][k]) { // column
            return false;
        }
        if (c === board[3 * Math.floor(i / 3) + k % 3][3 * Math.floor(j / 3) + Math.floor(k / 3)]) { // diagonals
            return false;
        }
    }
    return true;
};
var getCantidatesSoduku = function (boardIndex, n) {
    var cantidates = [];
    var i = Math.floor(boardIndex / board.length);
    var j = boardIndex % board.length;
    var c;
    for(c = 1; c <= 9; ++c) {
        if (validMove(i, j, c)) {
            cantidates.push(c);
        }
    }
    return cantidates;
};
var getCantidatesSubset = function () {
    return [true, false];
};
var makeMove = function(index, cantidate) {
    var moveIndex = moveIndices[index];
    var i = Math.floor(moveIndex / board.length);
    var j = moveIndex % board.length;
    board[i][j] = cantidate;
};
var unMakeMove = function(index) {
    var i = moveIndices[index];
    board[Math.floor(i / board.length)][i % board.length] = 0;
};
var getCantidates = getCantidatesSoduku;
var solutionFound = false;
var handleSolution = function (solution) {
    for (i = 0; i < solution.length; ++i) {
        makeMove(i, solution[i]);
    }
    printboard();
};
var backtrack = function (a, n) {
    var cantidates;
    var i;
    if (solutionFound) {
        return;
    }
    if (a.length === moveIndices.length) {
        solutionFound = true;
        handleSolution(a);
        return;
    }
    cantidates = getCantidates(moveIndices[a.length], n);
    for(i=0; i < cantidates.length; ++i) {
        ++iterations;
        makeMove(a.length, cantidates[i]);
        a.push(cantidates[i]);
        backtrack(a, n);
        a.pop();
        unMakeMove(a.length, cantidates[i]);
    }
};
var moveIndices = getMoveIndices();
var i;
var solution = [];
backtrack(solution, moveIndices.length);
if (!solutionFound) {
    console.log('no solution found :(');
}
console.log("num iterations: " + iterations);
console.log("took " + (new Date() - start) + "ms");
