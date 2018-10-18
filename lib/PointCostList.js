const Point = require('./Point');

function PointCostList() {
  this.queues = {};
  this.length = 0;
  this.priority = Infinity;
  this.priorities = [0];
};

PointCostList.prototype.shift = function shift() {
  if (this.queues[this.priority].length === 0) {
    [this.priority] = Object.keys(this.queues)
      .filter(p => (this.queues[p].length > 0))
      .sort();
  };

  const point = this.queues[this.priority].shift();
  this.length -= 1;

  return point;
};

PointCostList.prototype.push = function push(point, pri) {
  if (!(point instanceof Point)) {
    throw new Error(`May not PointCostList#push ${point}`);
  };

  this.queues[pri] = this.queues[pri] || [];
  this.queues[pri].push(point);
  this.length += 1;

  if (pri < this.priority) {
    this.priority = pri;
  };
};

module.exports = PointCostList;
