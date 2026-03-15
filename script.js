/**
 * Sudoku Game Logic - Professional Version
 */
let board = Array(9).fill().map(() => Array(9).fill(0));
let puzzle = [];
let selectedTile = null;
let errors = 0;

window.onload = function() {
    setupGame();
};

function setupGame() {
    generateFullBoard(); 
    // Increased difficulty: 50 empty cells
    preparePuzzle(50); 
    renderBoard();
    
    document.querySelectorAll(".number").forEach(button => {
        button.onclick = () => {
            handleInput(parseInt(button.innerText));
        };
    });

    document.addEventListener("keydown", (e) => {
        if (e.key >= 1 && e.key <= 9) handleInput(parseInt(e.key));
    });

    document.getElementById("reset-btn").onclick = () => location.reload();
}

function generateFullBoard() {
    const fill = (r, c) => {
        if (c === 9) { r++; c = 0; }
        if (r === 9) return true;
        
        let nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
        for (let num of nums) {
            if (isValid(r, c, num)) {
                board[r][c] = num;
                if (fill(r, c + 1)) return true;
                board[r][c] = 0;
            }
        }
        return false;
    };
    fill(0, 0);
}

function isValid(r, c, num) {
    for (let i = 0; i < 9; i++) {
        if (board[r][i] === num || board[i][c] === num) return false;
    }
    let startRow = Math.floor(r / 3) * 3, startCol = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }
    return true;
}

function preparePuzzle(emptyCount) {
    puzzle = board.map(row => [...row]);
    let count = 0;
    while (count < emptyCount) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        if (puzzle[r][c] !== "") {
            puzzle[r][c] = "";
            count++;
        }
    }
}

function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            
            if (puzzle[r][c] !== "") {
                tile.innerText = puzzle[r][c];
                tile.classList.add("tile-start");
            }

            // Correct border logic to prevent grid overflow
            if (r === 2 || r === 5) tile.classList.add("horizontal-line");
            if (c === 2 || c === 5) tile.classList.add("vertical-line");
            
            tile.onclick = function() {
                if (this.classList.contains("tile-start")) return;
                
                if (selectedTile) selectedTile.classList.remove("bg-blue-200");
                selectedTile = this;
                selectedTile.classList.add("bg-blue-200");
            };
            boardDiv.append(tile);
        }
    }
}

function handleInput(num) {
    if (!selectedTile || selectedTile.classList.contains("tile-start")) return;
    
    let coords = selectedTile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    
    if (board[r][c] === num) {
        selectedTile.innerText = num;
        selectedTile.classList.remove("tile-error");
        puzzle[r][c] = num; 
        checkWin();
    } else {
        // Handle mistake
        errors++;
        document.getElementById("errors").innerText = errors;
        selectedTile.innerText = num;
        selectedTile.classList.add("tile-error");

        // Clear the wrong number after 500ms (as requested)
        setTimeout(() => {
            if (puzzle[r][c] === "") {
                selectedTile.innerText = "";
                selectedTile.classList.remove("tile-error");
            }
        }, 500);

        if (errors >= 3) {
            alert("Game Over! Too many mistakes.");
            location.reload();
        }
    }
}

function checkWin() {
    if (!puzzle.flat().includes("")) {
        alert("Success! Puzzle Solved.");
    }
}