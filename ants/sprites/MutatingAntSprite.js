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
exports.MutatingAntConfig = void 0;
var AntSprite_1 = __importDefault(require("./AntSprite"));
var Direction_1 = __importDefault(require("../model/Direction"));
var MutatingAnt_1 = __importDefault(require("../model/MutatingAnt"));
var IdSource_1 = __importDefault(require("../model/IdSource"));
var phaser_1 = __importDefault(require("phaser"));
/**
 * MutatingAntSprite
 *
 * Has a brain - the brain controls activity
 *
 * MutatingAntSprite.spawn(n: number);
 *
 */
var DEBUG = true;
var MutatingAntSprite = /** @class */ (function (_super) {
    __extends(MutatingAntSprite, _super);
    function MutatingAntSprite(scene, config) {
        var _this = _super.call(this, scene, config.x, config.y, config.texture) || this;
        _this.id = IdSource_1.default.nextId(MutatingAntSprite.constructor.name);
        _this.updateDeltaAccum = 0;
        _this.antenna = [];
        _this.score = 0;
        _this.lastPoints = 0;
        _this.ant = MutatingAnt_1.default.create();
        _this.nearestFoodLine = scene.add.line(0, 0, config.x, config.y, 200, 200, 0xB3FFCC, .3);
        _this.nearestFoodLine.setDepth(_this.depth);
        _this.antenna[0] = scene.add.circle(100, 100, 5, 0xFF0000, .3);
        _this.antenna[1] = scene.add.circle(100, 100, 5, 0x00FF00, .3);
        _this.fadeTween = scene.tweens.add({
            targets: [_this, _this.antenna[0], _this.antenna[1], _this.nearestFoodLine],
            alpha: { from: 1, to: 0 },
            ease: 'Linear',
            duration: 1000,
            delay: 500,
            repeat: 0,
            yoyo: false,
            onComplete: function () {
                _this.setActive(false);
            }
        });
        _this.config = config;
        _this.reset();
        // Save for later
        _this.world = scene.world;
        // We're always moving! Get it started
        _this.animate();
        return _this;
    }
    MutatingAntSprite.prototype.reset = function () {
        this.fadeTween.restart();
        this.fadeTween.pause();
        this.score = 0;
        this.lastPoints = 0;
        this.updateDeltaAccum = 0;
        this.thinkingStartMs = 0;
        // movement
        // 0 is pointing right
        this.ant.headingRadians = 0;
        this.ant.vx = 0;
        this.ant.vy = 0;
        this.ant.x = this.config.x;
        this.ant.y = this.config.y;
        this.ant.speed = 5;
        this.setRotation(this.ant.headingRadians);
    };
    MutatingAntSprite.prototype.preUpdate = function (time, delta) {
        var _this = this;
        this.animate();
        _super.prototype.update.call(this, time, delta);
        if (this.ant.isDead() && this.fadeTween.paused) {
            this.fadeTween.play();
        }
        this.updateDeltaAccum += delta;
        if (this.updateDeltaAccum <= 100) {
            return;
        }
        // think()
        if (!this.thinkingStartMs) {
            this.thinkingStartMs = window.performance.now();
            var values = this.world.calcIntensity([{ x: this.ant.x, y: this.ant.y }]);
            var points = values[0] * 100;
            // The best ants move toward food
            // punish by removing points if they move away from food
            this.score += points - this.lastPoints;
            this.lastPoints = points;
            this.ant.think(this.world)
                .then(function () {
                // Point the sprite in the right direction
                _this.updateDirection(_this.ant.headingRadians);
                _this.ant.move();
                _this.thinkingStartMs = 0;
            })
                .catch(function () { return _this.debug('rejected'); })
                .finally(function () {
                // reset the update so we'll think again later
                _this.updateDeltaAccum = 0;
            });
        }
        else {
            // console.log("Still thinking!" + (window.performance.now() - this.thinkingStartMs) + "ms");
            this.ant.move();
            // TODO: How does this 'move' deal with interactive with the world (physical ?
        }
        this.adjustDebugObjects();
    };
    MutatingAntSprite.prototype.adjustDebugObjects = function () {
        var nearestFood = this.getNearestFood(this);
        // TBD: Understand these x/y offsets?
        this.nearestFoodLine.setTo(nearestFood.food.x + 100, nearestFood.food.y + 64, this.x + 100, this.y + 50);
        if (nearestFood.distance > 500) {
            this.nearestFoodLine.setStrokeStyle(5, 0xFF0000, .3);
        }
        else {
            this.nearestFoodLine.setStrokeStyle(5, 0xFFFF00, .3);
        }
        var sensors = this.ant.getSensors();
        this.antenna[0].x = sensors[0].x;
        this.antenna[0].y = sensors[0].y;
        this.antenna[1].x = sensors[1].x;
        this.antenna[1].y = sensors[1].y;
    };
    MutatingAntSprite.prototype.getNearestFood = function (ant) {
        var d = Number.MAX_VALUE;
        var closest;
        for (var i = 0; i < this.world.food.length; ++i) {
            var c = this.world.food[i];
            if (!c.isAlive()) {
                continue;
            }
            var dist = phaser_1.default.Math.Distance.Between(this.x, this.y, c.x, c.y);
            if (dist < d) {
                d = dist;
                closest = c;
            }
            // TODO: Add real collision detection
            if (dist < 30) {
                var consume = 50;
                c.consumeHealth(consume);
                ant.ant.restoreHealth(consume);
                ant.score += consume;
                console.log(c.id + "(" + c.x + "," + c.y + ") touched by " + this.id + "(" + this.x + "," + this.y + ")", c.health);
            }
        }
        return { food: closest, distance: d };
    };
    MutatingAntSprite.prototype.getScore = function () {
        return this.score;
    };
    MutatingAntSprite.prototype.updateDirection = function (radians) {
        var found = MutatingAntSprite.radiansToDirection[0];
        for (var i = 0; i < MutatingAntSprite.radiansToDirection.length; ++i) {
            var check = MutatingAntSprite.radiansToDirection[i];
            if (radians >= check.radians - MutatingAntSprite.PI_OVER_8 &&
                radians <= check.radians + MutatingAntSprite.PI_OVER_8) {
                found = check;
                break;
            }
        }
        var adjusted = found.radians - radians;
        this.setDirection(found.dir);
        this.setRotation(adjusted);
    };
    // TODO: Need a logger
    MutatingAntSprite.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (DEBUG && this.id == 1) {
            console.log('id: ' + this.id, args);
        }
    };
    // 45 degrees
    MutatingAntSprite.PI_OVER_8 = Math.PI / 8;
    MutatingAntSprite.radiansToDirection = [
        { radians: 0, dir: Direction_1.default.RIGHT },
        { radians: Math.PI / 4, dir: Direction_1.default.UP_RIGHT },
        { radians: Math.PI / 2, dir: Direction_1.default.UP },
        { radians: 3 * Math.PI / 4, dir: Direction_1.default.UP_LEFT },
        { radians: Math.PI, dir: Direction_1.default.LEFT },
        { radians: 5 * Math.PI / 4, dir: Direction_1.default.DOWN_LEFT },
        { radians: 3 * Math.PI / 2, dir: Direction_1.default.DOWN },
        { radians: 7 * Math.PI / 4, dir: Direction_1.default.DOWN_RIGHT },
        { radians: 2 * Math.PI, dir: Direction_1.default.RIGHT },
    ];
    return MutatingAntSprite;
}(AntSprite_1.default));
exports.default = MutatingAntSprite;
var MutatingAntConfig = /** @class */ (function () {
    function MutatingAntConfig() {
    }
    return MutatingAntConfig;
}());
exports.MutatingAntConfig = MutatingAntConfig;
//# sourceMappingURL=MutatingAntSprite.js.map