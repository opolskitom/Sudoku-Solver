//Created by Thomas Opolski (GitHub: opolskitom)
//9x9 sudoku grid (puzzle generation coming soon)

//Current puzzles
var easyPuzzle = [
  [0, 1, 8, 3, 0, 0, 0, 0, 0],
  [4, 9, 0, 1, 0, 7, 0, 3, 2],
  [0, 0, 3, 2, 8, 4, 0, 0, 6],
  [0, 6, 0, 0, 1, 5, 0, 0, 8],
  [0, 8, 0, 7, 6, 3, 0, 2, 9],
  [3, 0, 4, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 7, 0, 0, 8, 4],
  [6, 4, 0, 0, 0, 0, 2, 0, 7],
  [0, 2, 0, 5, 0, 0, 6, 0, 3],
  "Easy"
]

var mediumPuzzle = [
  [6, 8, 5, 0, 7, 9, 0, 0, 2],
  [2, 1, 0, 5, 0, 8, 0, 6, 0],
  [7, 0, 4, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 3, 0, 5, 8, 0, 0],
  [8, 5, 0, 0, 2, 0, 0, 0, 0],
  [0, 0, 3, 0, 9, 0, 0, 0, 6],
  [0, 0, 8, 0, 0, 0, 4, 2, 0],
  [0, 0, 0, 6, 0, 7, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 3],
  "Medium"
]

var hardPuzzle = [
  [2, 0, 6, 0, 0, 1, 0, 0, 0],
  [9, 4, 0, 8, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 9, 0, 0, 7],
  [0, 0, 0, 0, 7, 0, 0, 0, 1],
  [3, 0, 0, 0, 0, 5, 4, 2, 0],
  [0, 1, 4, 0, 0, 0, 3, 0, 8],
  [0, 0, 1, 4, 9, 0, 8, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 5],
  [4, 8, 0, 0, 0, 0, 0, 0, 0],
  "Hard"
]

var impossiblePuzzle = [
  [8, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 6, 0, 0, 0, 0, 0],
  [0, 7, 0, 0, 9, 0, 2, 0, 0],
  [0, 5, 0, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 0, 4, 5, 7, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 3, 0],
  [0, 0, 1, 0, 0, 0, 0, 6, 8],
  [0, 0, 8, 5, 0, 0, 0, 1, 0],
  [0, 9, 0, 0, 0, 0, 4, 0, 0],
  "Impossible"
]

//Default values
var puzLength = 9;
var puzzle = easyPuzzle;
var logValues = false; //log where values are being placed and clicked
var vTimeCounter = 0; //counter for occurances of setting ()
var timePerValue = 50; //ms of time it takes to display a value
var stopSolve = false;

//Public selection values
var isSelected = false;
var selected = [];

setTable();

//Initializes table and difficulty
function setTable() {
  for (var i = 0; i < puzLength; i++) {
    for (var j = 0; j < puzLength; j++) {
      var num = puzzle[i][j];
      if (num == 0) {
        num = ""
      }
      $(".row-" + i).children('td').eq(j).html(num);
    }
  }
  //Sets difficulty name
  $(".difficulty").html(puzzle[9]);
  //Resets solve timers
  $(".official-time").html("");
  $(".solve-time").html("");

  isSelected = false;
  $(".row-" + selected[0]).children('td').eq(selected[1]).removeClass("selected");
  selected = [];
}

//UI Features
//--------------------------------------------------------
$( "td" ).hover(
  function() {
    $(this).addClass("hover");
    if (isSelected) {
      $(".row-" + selected[0]).children('td').eq(selected[1]).removeClass("hover");
    }
  }, function() {
    $(this).removeClass("hover");
  }
);


// Buttons
//--------------------------------------------------------
//Puzzle select buttons
$(".puzzle-select").click(function() {
  if ($(this).hasClass("easy-puzzle")) {
    puzzle = easyPuzzle;
    timePerValue = 50;
    setTable();
  } else if ($(this).hasClass("medium-puzzle")) {
    puzzle = mediumPuzzle;
    timePerValue = 4;
    setTable();
  } else if ($(this).hasClass("hard-puzzle")){
    puzzle = hardPuzzle;
    timePerValue = 4;
    setTable();
    alert("WARNING: Solving this with backtracking can take upwards of over THREE minutes and is not recommended!")
  } else {
    puzzle = impossiblePuzzle;
    timePerValue = 4;
    setTable();
    alert("WARNING: Solving this with backtracking can take upwards of over FIVE minutes and is not recommended!")
  }
})

//Solve Button
$("button[name='solve-btn']").click(async function() {
  var start = Date.now();
  vTimeCounter = 0;
  stopSolve = false;
  var solved = await solveSudoku();
  console.log(solved);

  var delta = Date.now()-start;
  var visualDifference = vTimeCounter * timePerValue;
  var officialTime = delta - visualDifference;

  if ((delta/1000) > 0.005) {
    $(".official-time").html((officialTime/1000) +" seconds");
    $(".solve-time").html((delta/1000)+" seconds total - "+(visualDifference/1000)+" seconds visually");
  }

  if (!solved && stopSolve) {
    alert("Puzzle aborted!");
  } else if (!solved) {
    alert("Puzzle cannot be solved!");
  }
})

//Reset Button
$("button[name='reset-btn']").click(function() {
  stopSolve = true;
  setTable();
})


//Getters and Setters
//--------------------------------------------------------
//Gets the position of clicked element and selects it
$(".cell").click(function() {
  this.focus();
  if (isSelected) {
    $(".row-" + selected[0]).children('td').eq(selected[1]).removeClass("selected");
  }

  var column = $(this).attr('class').split(' ')[1];
  var row = $(this).parent().attr('class').split(' ')[1];

  var columnNum = column[column.length - 1];
  var rowNum = row[row.length - 1];
  var numValue = getValueAt(rowNum, columnNum);

  if (logValues) console.log(columnNum + "," + rowNum + ", val: " + numValue);

  isSelected = true;
  selected = [rowNum, columnNum];
  $(".row-" + selected[0]).children('td').eq(selected[1]).addClass("selected").removeClass("hover");
})

//Set and get value at grid position
function getValueAt(row, column) {
  return $(".row-" + row).children('td').eq(column).html();
}
async function setValueAt(row, column, num) {
  if (logValues) console.log("Placing " + num + " at [" + row + "," + column + "]");
  vTimeCounter++;

  return new Promise(resolve => {
    setTimeout(() => {
      $(".row-" + row).children('td').eq(column).html(num);
      resolve(0);
    }, timePerValue);
  });
}

//User Input functions
//--------------------------------------------------------
$(document).keypress(function(key) {
  if (isSelected) {
    if (logValues) console.log(selected);
    if (!isNaN(key.key) && key.key != 0) {
      if (puzzle[selected[0]][selected[1]] == 0) {
        setValueAt(selected[0],selected[1], key.key);
      }
    }
  }
})


//Solving functions
//--------------------------------------------------------
//Sudoku solver using backtracking
async function solveSudoku() {
  if (stopSolve) return false;
  //First find the next unsolved
  var unknown = findUnknown();
  if (unknown[0] == -1) {
    return true;
  }

  //Set coordinate of unknown position
  var row = unknown[0];
  var column = unknown[1];

  //Try all values
  for (var num = 1; num <= 9; num++) {
    //If valid position, move forward
    if (isValid(row, column, num)) {
      //Set value and move to next position
      await setValueAt(row, column, num);

      //Recursively solve puzzle until return true or false
      if (await solveSudoku()) {
        return true;
      }

      //Reset value if no valid solutions
      await setValueAt(row, column, "");
    }
  }
  return false;
}

//Find unknown/empty values on board
function findUnknown() {
  for (var i = 0; i < puzLength; i++) {
    for (var j = 0; j < puzLength; j++) {
      if (getValueAt(i, j) == "") {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

//Returns if valid placement of number
function isValid(row, column, num) {
  return (!invalidColumn(column, num) &&
    !invalidRow(row, num) &&
    !invalidSquare(row, column, num));
}

//Checks if any other occurances in the same row
function invalidRow(row, num) {
  for (var i = 0; i < puzLength; i++) {
    if (getValueAt(row, i) == num) {
      return true;
    }
  }
  return false;
}

//Checks if any other occurances in the same columm
function invalidColumn(column, num) {
  for (var i = 0; i < puzLength; i++) {
    if (getValueAt(i, column) == num) {
      return true;
    }
  }
  return false;
}

//Checks if any other occurances in the same square
function invalidSquare(row, column, num) {
  //Find the start of the current square
  var rowStart = Math.floor(row / 3);
  rowStart *= 3;
  var colStart = Math.floor(column / 3);
  colStart *= 3;

  //Iterate through square
  for (var i = rowStart; i < (rowStart + 3); i++) {
    for (var j = colStart; j < (colStart + 3); j++) {
      if (getValueAt(i, j) == num) {
        return true;
      }
    }
  }

  return false;
}
