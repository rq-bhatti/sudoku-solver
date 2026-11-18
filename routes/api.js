'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      const validation = solver.validate(puzzle);
      if (validation.error) return res.json({ error: validation.error });

      const match = /^([A-Ia-i])([1-9])$/.exec(String(coordinate));
      if (!match) return res.json({ error: 'Invalid coordinate' });
      if (!/^[1-9]$/.test(String(value))) return res.json({ error: 'Invalid value' });

      const row = match[1].toUpperCase().charCodeAt(0) - 65;
      const col = Number(match[2]) - 1;
      const v = String(value);

      const conflict = [];
      if (!solver.checkRowPlacement(puzzle, row, col, v)) conflict.push('row');
      if (!solver.checkColPlacement(puzzle, row, col, v)) conflict.push('column');
      if (!solver.checkRegionPlacement(puzzle, row, col, v)) conflict.push('region');

      if (conflict.length) return res.json({ valid: false, conflict });
      return res.json({ valid: true });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) return res.json({ error: 'Required field missing' });
      const validation = solver.validate(puzzle);
      if (validation.error) return res.json({ error: validation.error });
      const solution = solver.solve(puzzle);
      if (!solution) return res.json({ error: 'Puzzle cannot be solved' });
      return res.json({ solution });
    });
};
