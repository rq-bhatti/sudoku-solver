class SudokuSolver {

  // Returns { error } on invalid input, or { valid: true } otherwise.
  validate(puzzleString) {
    if (typeof puzzleString !== 'string' || puzzleString === '') {
      return { error: 'Required field missing' };
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    return { valid: true };
  }

  // row and column are 0-based indexes; value is a digit 1-9.
  // The target cell itself is ignored so a value already placed there is not a conflict.
  checkRowPlacement(puzzleString, row, column, value) {
    const v = String(value);
    for (let c = 0; c < 9; c++) {
      if (c !== column && puzzleString[row * 9 + c] === v) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const v = String(value);
    for (let r = 0; r < 9; r++) {
      if (r !== row && puzzleString[r * 9 + column] === v) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const v = String(value);
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== column) && puzzleString[r * 9 + c] === v) return false;
      }
    }
    return true;
  }

  canPlace(puzzleString, row, column, value) {
    return this.checkRowPlacement(puzzleString, row, column, value) &&
      this.checkColPlacement(puzzleString, row, column, value) &&
      this.checkRegionPlacement(puzzleString, row, column, value);
  }

  // Returns the solved 81-char string, or false if the puzzle is invalid or unsolvable.
  solve(puzzleString) {
    if (this.validate(puzzleString).error) return false;
    const grid = puzzleString.split('');
    const str = () => grid.join('');

    // Givens must not conflict with each other.
    for (let i = 0; i < 81; i++) {
      if (grid[i] !== '.' &&
        !this.canPlace(puzzleString, Math.floor(i / 9), i % 9, grid[i])) {
        return false;
      }
    }

    const backtrack = () => {
      // Pick the empty cell with the fewest candidates.
      let best = -1, bestCands = null;
      for (let i = 0; i < 81; i++) {
        if (grid[i] !== '.') continue;
        const s = str();
        const cands = [];
        for (let d = 1; d <= 9; d++) {
          if (this.canPlace(s, Math.floor(i / 9), i % 9, d)) cands.push(String(d));
        }
        if (cands.length === 0) return false;
        if (!bestCands || cands.length < bestCands.length) {
          best = i; bestCands = cands;
          if (cands.length === 1) break;
        }
      }
      if (best === -1) return true;
      for (const d of bestCands) {
        grid[best] = d;
        if (backtrack()) return true;
      }
      grid[best] = '.';
      return false;
    };

    return backtrack() ? str() : false;
  }
}

module.exports = SudokuSolver;
