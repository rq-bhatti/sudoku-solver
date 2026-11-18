const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

suite('Functional Tests', () => {

  suite('POST /api/solve', () => {

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
      chai.request(server).post('/api/solve').send({ puzzle }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, solution);
        done();
      });
    });

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
      chai.request(server).post('/api/solve').send({}).end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
    });

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
      chai.request(server).post('/api/solve').send({ puzzle: 'AA' + puzzle.slice(2) }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
    });

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
      chai.request(server).post('/api/solve').send({ puzzle: puzzle.slice(1) }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
    });

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
      chai.request(server).post('/api/solve').send({ puzzle: '9' + puzzle.slice(1) }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
    });

  });

  suite('POST /api/check', () => {

    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
      chai.request(server).post('/api/check').send({ puzzle, coordinate: 'A1', value: '7' }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.isTrue(res.body.valid);
        assert.notProperty(res.body, 'conflict');
        done();
      });
    });

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
      chai.request(server).post('/api/check').send({ puzzle, coordinate: 'A1', value: '6' }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ['column']);
        done();
      });
    });

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
      chai.request(server).post('/api/check').send({ puzzle, coordinate: 'A1', value: '1' }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ['row', 'column']);
        done();
      });
    });

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
      chai.request(server).post('/api/check').send({ puzzle, coordinate: 'A1', value: '5' }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
        done();
      });
    });

    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
      chai.request(server).post('/api/check').send({ puzzle, value: '1' }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
    });

    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
      chai.request(server).post('/api/check').send({ puzzle: 'AA' + puzzle.slice(2), coordinate: 'A1', value: '1' }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
    });

    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
      chai.request(server).post('/api/check').send({ puzzle: puzzle + '.', coordinate: 'A1', value: '1' }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
    });

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
      chai.request(server).post('/api/check').send({ puzzle, coordinate: 'J10', value: '1' }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
    });

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
      chai.request(server).post('/api/check').send({ puzzle, coordinate: 'A1', value: '10' }).end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
    });

  });

});
