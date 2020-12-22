"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var IdSource_1 = __importDefault(require("./IdSource"));
var Direction_1 = __importDefault(require("./Direction"));
var Moveable_1 = __importDefault(require("./Moveable"));
var HealthMixin_1 = __importDefault(require("./HealthMixin"));
var EventMixin_1 = __importDefault(require("./EventMixin"));
var ts_mixer_1 = require("ts-mixer");
// How are the antenna sensors located?
var antennaAngleRadians = .5;
var antennaLenFromCenter = 25;
var Ant = /** @class */ (function (_super) {
    __extends(Ant, _super);
    function Ant(activity, direction, health) {
        if (activity === void 0) { activity = Ant.Activity.STAND; }
        if (direction === void 0) { direction = Direction_1.default.RIGHT; }
        if (health === void 0) { health = 100; }
        var _this = _super.call(this) || this;
        _this.id = IdSource_1.default.nextId(_this.constructor.name);
        _this._activity = Ant.Activity.STAND;
        _this._direction = Direction_1.default.LEFT;
        HealthMixin_1.default.construct(_this, health);
        _this.activity = activity;
        _this.direction = direction;
        return _this;
    }
    /**
     * The interface between the world and the creature is a sensor.
     * Sensors provide inputs to the brain.
     *
     * Ants have antenna positioned relative to the ants body.
     * TODO: Sensor types ?
     * Chemical (smell/taste), Physical (sound/vibration/touch)
     */
    Ant.prototype.getSensors = function () {
        var len = antennaLenFromCenter;
        var angleRadians = antennaAngleRadians;
        return [
            {
                x: this.x + len * Math.cos(angleRadians - this.headingRadians),
                y: this.y + len * Math.sin(angleRadians - this.headingRadians)
            },
            {
                x: this.x + len * Math.cos(-angleRadians - this.headingRadians),
                y: this.y + len * Math.sin(-angleRadians - this.headingRadians)
            }
        ];
    };
    Ant.prototype.think = function (world) {
        // I don't think
    };
    Object.defineProperty(Ant.prototype, "activity", {
        get: function () {
            return this._activity;
        },
        set: function (value) {
            this._activity = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ant.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        set: function (value) {
            this._direction = value;
        },
        enumerable: false,
        configurable: true
    });
    return Ant;
}(ts_mixer_1.Mixin(Moveable_1.default, HealthMixin_1.default, EventMixin_1.default)));
(function (Ant) {
    Ant.register(HealthMixin_1.default.Event.onDeath, function (_self) {
        _self.activity = Ant.Activity.CRIT_DIE;
        _self.moveable = false;
        return true;
    });
    Ant.register(HealthMixin_1.default.Event.onRevive, function (_self) {
        _self.moveable = true;
        return true;
    });
    Ant.register(Moveable_1.default.Event.afterMove, function (_self, distance) {
        _self.consumeHealth(distance / 10);
        return true;
    });
    var Activity;
    (function (Activity) {
        Activity["STAND"] = "stand";
        Activity["WALK"] = "walk";
        Activity["ATTACK"] = "attack";
        Activity["BLOCK"] = "block";
        Activity["HIT_DIE"] = "hit-die";
        Activity["CRIT_DIE"] = "crit-die";
    })(Activity = Ant.Activity || (Ant.Activity = {}));
})(Ant || (Ant = {}));
exports.default = Ant;
//# sourceMappingURL=Ant.js.map