"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var phaser_1 = __importDefault(require("phaser"));
var Distance = phaser_1.default.Math.Distance;
var World = /** @class */ (function () {
    function World() {
        this.food = [];
    }
    /**
     * what is the intensity of sense at a given points?
     * Look at all of the nearby things, calc the intensity between 0 and 1
     * @param points - list of sensor points
     */
    World.prototype.calcIntensity = function (points) {
        var _this = this;
        // map the list of points to a list of intensities
        return points.map(function (point) {
            var intensities = [];
            _this.food.forEach(function (food) {
                var points = 0;
                // TODO: should come from the detected entities.. maybe decline over time?
                var otherMaxDistance = 500;
                var distance = Distance.Between(point.x, point.y, food.x, food.y);
                if (distance < otherMaxDistance) {
                    /**
                     * function drops off quickly the larger the distance
                     * giving more points for being close
                     *
                     * https://www.desmos.com/calculator/3fisjexbvp
                     * y=-\frac{\left(x-100\right)^{3}}{100^{2}}
                     */
                    points = Math.max(0, (-Math.pow(distance - otherMaxDistance, 3) / Math.pow(otherMaxDistance, 2)));
                    intensities.push(points / otherMaxDistance);
                }
            });
            /*
                TODO: intensity should be from 0-1..
                 average gives an artificially low value when 1 thing is far away
                 Should the sensor be overwhelmed by too many things being close by?
             */
            return intensities.length > 0 ? Math.max.apply(Math, intensities) : 0;
            // const sum = intensities.reduce((a, b) => a + b, 0);
            // const avg = (sum / intensities.length) || 0;
            // return avg;
        });
    };
    return World;
}());
exports.default = World;
//# sourceMappingURL=World.js.map