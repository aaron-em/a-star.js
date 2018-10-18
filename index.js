const Point = require('./lib/Point');
const PointList = require('./lib/PointList');
const PointCostList = require('./lib/PointCostList');

function getNodeCost(map, point) {
  return map[point.y][point.x];
}

function makeEvaluator(state) {
  return (neighbor) => {
    const definedCost = getNodeCost(state.map, neighbor);
    const distCost = state.end.distanceFrom(neighbor) + 1;

    const cost =
      (state.pathCosts[state.here] || 0) + distCost ** 15 + definedCost;

    /* eslint-disable no-param-reassign */
    if (state.examined.contains(neighbor) || cost >= state.costs[neighbor]) {
      return;
    }
    state.costs[neighbor] = cost;

    if (definedCost < Infinity) {
      state.frontier.push(neighbor, cost);
    }

    state.examined.push(neighbor);
    state.prior[neighbor] = state.here;
    state.pathCosts[neighbor] = cost;
    /* eslint-enable no-param-reassign */
  };
}

function findNeighbors(map, point) {
  const xExtent = map[0].length;
  const yExtent = map.length;

  return [
    [point.x - 1, point.y - 1],
    [point.x, point.y - 1],
    [point.x + 1, point.y - 1],
    [point.x - 1, point.y],
    /*      point      */ [point.x + 1, point.y],
    [point.x - 1, point.y + 1],
    [point.x, point.y + 1],
    [point.x + 1, point.y + 1]
  ]
    .filter((c) => c[0] >= 0 && c[0] < xExtent && (c[1] >= 0 && c[1] < yExtent))
    .map((n) => new Point(n[0], n[1]));
}

function gatherPath(prior, from) {
  let here = from;
  let next = null;
  const path = [here];

  while (prior[here] !== null) {
    next = prior[here];
    path.push(next);
    here = next;
  }

  return path.reverse();
}

function AStar(map, start, end) {
  const state = {
    map,
    start,
    end,
    frontier: new PointCostList(),
    examined: new PointList(),
    prior: {},
    costs: {},
    pathCosts: {},
    here: null
  };

  state.frontier.push(start, 0);
  state.prior[start] = null;
  state.costs[start] = 0;

  const evaluateNeighbor = makeEvaluator(state);
  let neighbors;

  while (state.frontier.length > 0) {
    state.here = state.frontier.shift();
    neighbors = findNeighbors(state.map, state.here);

    if (state.here.equals(end)) {
      return [gatherPath(state.prior, state.here), state];
    }

    neighbors.forEach(evaluateNeighbor);
  }

  return [null, state];
}

AStar.Point = Point;

module.exports = AStar;
