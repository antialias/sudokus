var usededuction = true;
// var b = [
// 	{x:0,y:2,n:5},
// 	{x:0,y:6,n:7},
// 	{x:1,y:1,n:4},
// 	{x:1,y:3,n:8},
// 	{x:1,y:5,n:9},
// 	{x:1,y:7,n:5},
// 	{x:2,y:0,n:1},
// 	{x:2,y:8,n:9},
// 	{x:3,y:1,n:9},
// 	{x:3,y:3,n:2},
// 	{x:3,y:5,n:3},
// 	{x:3,y:7,n:1},
// 	{x:4,y:4,n:6},
// 	{x:5,y:1,n:7},
// 	{x:5,y:3,n:9},
// 	{x:5,y:5,n:8},
// 	{x:5,y:7,n:3},
// 	{x:6,y:0,n:7},
// 	{x:6,y:8,n:5},
// 	{x:7,y:1,n:8},
// 	{x:7,y:3,n:4},
// 	{x:7,y:5,n:6},
// 	{x:7,y:7,n:9},
// 	{x:8,y:2,n:6},
// 	{x:8,y:6,n:1}
// ];
//var b = [ // http://www.telegraph.co.uk/science/science-news/9359579/Worlds-hardest-sudoku-can-you-crack-it.html
// 	{x:0,y:0,n:8},
// 	{x:1,y:2,n:3},
// 	{x:1,y:3,n:6},
// 	{x:2,y:1,n:7},
// 	{x:2,y:4,n:9},
// 	{x:2,y:6,n:2},
// 	{x:3,y:1,n:5},
// 	{x:3,y:5,n:7},
// 	{x:4,y:4,n:4},
// 	{x:4,y:5,n:5},
// 	{x:4,y:6,n:7},
// 	{x:5,y:3,n:1},
// 	{x:5,y:7,n:3},
// 	{x:6,y:2,n:1},
// 	{x:6,y:7,n:6},
// 	{x:6,y:8,n:8},
// 	{x:7,y:2,n:8},
// 	{x:7,y:3,n:5},
// 	{x:7,y:7,n:1},
// 	{x:8,y:1,n:9},
// 	{x:8,y:6,n:4}
// ];
var b = [ // http://www.sudokuwiki.org/Weekly_Sudoku.asp?puz=28
	{x:0,y:0,n:6},
	{x:0,y:5,n:8},
	{x:0,y:6,n:9},
	{x:0,y:7,n:4},
	{x:1,y:0,n:9},
	{x:1,y:5,n:6},
	{x:1,y:6,n:1},
	{x:2,y:1,n:7},
	{x:2,y:4,n:4},
	{x:3,y:0,n:2},
	{x:3,y:3,n:6},
	{x:3,y:4,n:1},
	{x:4,y:6,n:2},
	{x:5,y:1,n:8},
	{x:5,y:2,n:9},
	{x:5,y:5,n:2},
	{x:6,y:4,n:6},
	{x:6,y:8,n:5},
	{x:7,y:7,n:3},
	{x:8,y:0,n:8},
	{x:8,y:5,n:1},
	{x:8,y:6,n:6}
];

var i,j,k,changed, bg = Array(9);

for(i=0; i < 9; ++i) {
	bg[i] = Array(9);
	for(j=0; j < 9; ++j) {
		bg[i][j] = {};
		for(k=1; k <= 9; ++k) {
			bg[i][j][k] = true;
		}
	}
}
var boardString = function (b) {
	var i,j,k;
	var bs = "\n";
	for (i=0; i < 9; ++i) {
		if (0 === i % 3) {
			bs += " ++====================+====================+====================++====================+====================+====================++====================+====================+====================\n";
		}
		for (j=0; j < 9; ++j) {
			if (0 === j%3) {
				bs += " || ";
			} else {
				bs += " | ";
			}
			for (k=1; k <= 9; ++k) {
				bs += " ";
				if (b[i][j][k]) {
					bs += ""+k;
				} else {
					bs += " ";
				}
			}
		}
		bs += "\n";
	}
	return bs;
};
var populate = function (bg, b, reset) {
	var i;
	for(i=0; i < b.length; ++i) {
		if (reset) {
			bg[b[i].x][b[i].y] = {};
		}
		bg[b[i].x][b[i].y][b[i].n] = true;
	}
};
populate(bg, b, true);
// console.log("filled out: ", bg);
// return;
var fh = function (i,bg) {
	return function (j) {
		return {x:j, y:i};
	};
};
var fv = function (i,bg) {
	return function (j) {
		return {x:i, y:j};
	};
};
var fb = function (i,bg) {
	return function (j) {
		return {x:3*(i%3) + j%3,y:3*(Math.floor(i/3)) + Math.floor(j/3)}
	};
};
var reduce = function (bg, eliminated) {
	var axees = [fh,fv,fb];
	var elpl = undefined;
	var i, j, k;
	while(eliminated.length !== elpl) {
		elpl = eliminated.length;
		for(i=0; i < 9; ++i) {
			for(j=0; j < 9; ++j) {
				for(k=0; k < 9; ++k) {
					if (j === k) {
						continue;
					}
					// console.log("i,j,k",i,j,k);
					for (ax in axees) {
						// console.log("ax:" , ax);
						if (axees.hasOwnProperty(ax)) {
							var ec = axees[ax](i, bg)(k);
							var cc = axees[ax](i, bg)(j);
							var r, ks = Object.keys(bg[cc.x][cc.y]);
							if (ks.length <= 1) {
								var ck = axees[ax](i, bg)(k);
								var n = ks[0], fk = bg[ck.x][ck.y], r = false;
								if (undefined !== fk[n]) {
									delete fk[n];
									if (Object.keys(fk).length === 1 && Object.keys(fk)[0] === ks[0]) {
										return false;
									}
									ec.n = n;
									eliminated.push(ec);
								}
							}
							if (Object.keys(bg[ec.x][ec.y]).length === 0) {
								// console.log("inconsistency discovered when eliminating element " + k + " using axis " + ax + " when i,j,k = ",i,j,k);
								return false;
							}
						}
					}
				}
			}
			// console.log("intermediate board:", boardString(bg));
		}
		// console.log("did " + eliminated.length + " eliminations");
		return true
	}
	return true;
};
var deduce = function (bg) {
	var eliminations = []
	var reduced = reduce(bg, eliminations);
	console.log("reduce result: ", reduced, boardString(bg));
	// populate(bg, reduced);
	// console.log("repopulated: ", boardString(bg));
	var i, j, k;
	var phl;
	var helim = [];
	while (phl !== helim.length) {
		phl = helim.length;
		for(i=0; i < 9; ++i) {
			for (j=0; j < 9; ++j) {
				var ts = bg[i][j];
				if (Object.keys(ts) < 2) {
					continue;
				}
				for (tk in ts) {
					if (!ts.hasOwnProperty(tk)) {
						continue;
					}
					var kts = Object.keys(ts);
					if (kts.length === 1) {
						break;
					}
					var eliminated = [];
					var hyp = {x:i, y: j, n: tk};
					var tkc;
					var hypcs = [];
					for (tkc=0; tkc < kts.length; ++tkc) {
						if (tk != kts[tkc]) {
							hypcs.push({x:i, y:j, n: kts[tkc]});
							delete ts[kts[tkc]];
						}
					}
					// console.log("bg before hypothetical reduction in ", hyp, ": ", boardString(bg));
					var rr = reduce(bg, eliminated);
					populate(bg, hypcs);
					// console.log("hypothetical eliminations:", eliminated);
					populate(bg, eliminated);
					if (!rr) {
						// console.log("removing ", hyp, " leads to an inconsistency");
						delete bg[i][j][hyp.n];
						// console.log("deduced that ", hyp, " is a valid elimination because it would lead to an inconsistency.");
						helim.push(hyp);
					} else {
						// console.log("we can't tell yet if removing ", hyp, " is the right choice");
					}
		
					var reductions = [];
					reduce(bg, reductions);
					if (reductions.length > 0) {
						// console.log("reductions based on recent eliminations: ", reductions);
					}
				}
			}
		}
		// console.log("eliminations from deduction: ", helim);
	}
	console.log("after deductions, we have:", boardString(bg));
}
if (usededuction) {
	deduce(bg);
}
// hobbiest method
var s = [];
var squares = [];
for (i=0; i < 9; ++i) {
	for (j=0; j < 9; ++j) {
		squares.push({x:i, y:j, p: bg[i][j]});
	}
}
var si = 0;
// console.log(squares[si]);
// s.push({squares[si]);
	
var addSquare = function (square) {
	Object.keys(square.p).forEach(function (key) {
		var ss = {test:{}, square: square, actual: square.p};
		ss.test[key] = true;
		s.push(ss);
	});
};
addSquare(squares[si]);
var maxnsi = 0;
while(s.length > 0) {
	var ss = s.pop();
	if (ss.restore) {
		// console.log("cleaning up this square");
		bg[ss.square.x][ss.square.y] = ss.actual;
		populate(bg, ss.restore);
		continue;
	}
	var eliminations = [];
	bg[ss.square.x][ss.square.y] = ss.test;
	var rr = reduce(bg, eliminations);
	// console.log("testing " + Object.keys(ss.test) + " at " + ss.square.x + ", " + ss.square.y, rr);
	if (rr) {
		// console.log("result was consistent");
		var ssa;
		var nsi = 9 * ss.square.x + ss.square.y + 1;
		if (nsi === 9*9) {
			console.log("solved it");
			break;
		}
		if (nsi > maxnsi) {
			maxnsi = nsi;
			console.log("new max nsi: ", nsi);
			console.log("board is now ", boardString(bg));
		}
		s.push({actual:ss.actual, square: ss.square, restore: eliminations});
		addSquare(squares[nsi]);
	} else {
		// console.log("result was inconsistent");
		populate(bg, eliminations);
		bg[ss.square.x][ss.square.y] = ss.actual;
	}
	// console.log(" board is now ", boardString(bg));
	// console.log(s);
}
// console.log(s);
console.log(" board is now ", boardString(bg));
