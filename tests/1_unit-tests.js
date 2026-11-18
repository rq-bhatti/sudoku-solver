const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
import { puzzlesAndSolutions } from '../controllers/puzzle-strings.js';
let solver = new Solver();

const validPuzzle = puzzlesAndSolutions[0][0];
const validSolution = puzzlesAndSolutions[0][1];

suite('Unit Tests', () => {

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.deepEqual(solver.validate(validPuzzle), { valid: true });
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const bad = 'A' + validPuzzle.slice(1);
    assert.deepEqual(solver.validate(bad), { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.deepEqual(solver.validate(validPuzzle.slice(1)),
      { error: 'Expected puzzle to be 81 characters long' });
    assert.deepEqual(solver.validate(validPuzzle + '.'),
      { error: 'Expected puzzle to be 81 characters long' });
  });

  // Puzzle row A: 1.5..2.84
  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 1, '1'));
  });

  // Column 1 (index 0): 1 . . . 8 3 4 . 2
  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(validPuzzle, 1, 0, '9'));
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(validPuzzle, 1, 0, '8'));
  });

  // Top-left region: 1.5 / ..6 / .2.
  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 0, 1, '6'));
  });

  test('Valid puzzle strings pass the solver', () => {
    puzzlesAndSolutions.forEach(([puzzle]) => {
      assert.isString(solver.solve(puzzle));
    });
  });

  test('Invalid puzzle strings fail the solver', () => {
    assert.isFalse(solver.solve('1' + validPuzzle.slice(1, 2) + '1' + validPuzzle.slice(3)));
    assert.isFalse(solver.solve('A' + validPuzzle.slice(1)));
    assert.isFalse(solver.solve(validPuzzle.slice(1)));
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    puzzlesAndSolutions.forEach(([puzzle, solution]) => {
      assert.equal(solver.solve(puzzle), solution);
    });
    assert.equal(solver.solve(validPuzzle), validSolution);
  });

});
