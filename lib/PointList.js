const Point = require('./Point');

function PointList() {
  this.queue = [];
  this.queueHash = {};
};

PointList.prototype.length = function length() {
  return this.queue.length;
};

PointList.prototype.shift = function shift() {
  const point = this.queue.shift();
  this.queueHash[point] -= 1;
  return point;
};

PointList.prototype.push = function push(that) {
  if (!(that instanceof Point)) {
    throw new Error(`May not PointList#push ${that}`);
  };

  this.queueHash[that] = this.queueHash[that] ? this.queueHash[that] + 1 : 1;
  return this.queue.push(that);
};

PointList.prototype.contains = function contains(what) {
  return !!this.queueHash[what];
};

module.exports = PointList;
