const cloneDeep = require('lodash.clonedeep');

const mazeAscii = require('../maze-ascii/');

const AStar = require('.');

const chars = {
  direction: {
    upLeft: '↖',
    up: '↑',
    upRight: '↗',
    left: '←',
    right: '→',
    downLeft: '↙',
    down: '↓',
    downRight: '↘'
  },
  wall: '░',
  corridor: ' ',
  examined: '·',
  start: 'o',
  finish: '★'
};

function drawLegend() {
  const directions = Object.values(chars.direction).join('');
  console.log(
    `legend: path dirs ${directions}, examined locations ${chars.examined}, start ${chars.start}, finish ${chars.finish}`
  );
}

function mapFromString(string) {
  return string
    .split(/\n/)
    .map((line) => line.split('').map((c) => (c !== ' ' ? Infinity : 0)));
}

function repeatChar(char, count) {
  const n = [];
  for (let i = 0; i < count; i += 1) {
    n.push(char);
  }
  return n.join('');
}

function withBorder(drawnMap) {
  const lines = drawnMap.split(/\n/);
  const width = lines[0].length;
  const bordered = [];

  bordered.push(`┌${repeatChar('─', width)}┐`);
  lines.forEach((line) => {
    bordered.push(`│${line}│`);
  });
  bordered.push(`└${repeatChar('─', width)}┘`);
  return bordered.join('\n');
}

function pathArrow(from, to) {
  const arrows = {
    '-1': {
      '-1': chars.direction.upLeft,
      0: chars.direction.up,
      1: chars.direction.upRight
    },
    0: {
      '-1': chars.direction.left,
      1: chars.direction.right
    },
    1: {
      '-1': chars.direction.downLeft,
      0: chars.direction.down,
      1: chars.direction.downRight
    }
  };

  const Δx = from.x - to.x;
  const Δy = from.y - to.y;

  return arrows[Δy][Δx];
}

function drawMap(map, pathPoints) {
  const drawn = cloneDeep(map);
  const pathChars = (pathPoints || []).map((step, i) => {
    let char;

    if (i === 0) {
      char = chars.start;
    }
    if (i === pathPoints.length - 1) {
      char = chars.finish;
    }
    if (!char) {
      char = pathArrow(step, pathPoints[i - 1]);
    }
    return [step, char];
  });

  pathChars.forEach((item) => {
    const point = item[0];
    const char = item[1];
    drawn[point.y][point.x] = char;
  });

  drawn.forEach((row) => {
    row.forEach((cell, i) => {
      /* eslint-disable no-param-reassign */
      if (cell === Infinity) {
        cell = chars.wall;
      }
      if (cell === 0) {
        cell = chars.corridor;
      }
      row[i] = cell;
      /* eslint-enable no-param-reassign */
    });
  });

  return drawn.map((row) => row.join('')).join('\n');
}

function drawMapWithBorder(map, pathPoints) {
  return withBorder(drawMap(map, pathPoints));
}

const width = 40;
const height = 7;

const maze = mapFromString(mazeAscii(width, height, { refine: false }));

const start = new AStar.Point(1, 1);
const end = new AStar.Point(width * 2 - 1, height * 2 - 1);

const t0 = new Date().getTime();
const [path, state] = AStar(maze, start, end);
const t1 = new Date().getTime();
const Δt = t1 - t0;

state.examined.queue.forEach((point) => {
  const v = maze[point.y][point.x];
  maze[point.y][point.x] = v === 0 ? chars.examined : v;
});

/* eslint-disable no-console */
if (path === null) {
  console.log(`${drawMapWithBorder(maze, [start, end])}`);
  drawLegend();
  console.log(`no path for ${maze.length} in ${Δt}sm\n`);
} else {
  console.log(`${drawMapWithBorder(maze, path)}`);
  drawLegend();
  console.log(`found path for ${maze.length} in ${Δt}ms\n`);
}
