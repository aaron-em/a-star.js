function Point(x, y) {
  this.x = x;
  this.y = y;
};

Point.prototype.toString = function toString() {
  return `[${this.x},${this.y}]`;
};

Point.prototype.equals = function equals(that) {
  if (!(that instanceof Point)) {
    throw new Error(`Point not comparable with ${that}`);
  };

  return (this.x === that.x)
    && (this.y === that.y);
};

Point.prototype.distanceFrom = function distanceFrom(that) {
  return Math.sqrt(((that.x - this.x) ** 2) + ((that.y - this.y) ** 2));
};

module.exports = Point;
