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
exports.AntSprite = void 0;
require("phaser");
// https://opengameart.org/content/antlion
var antlion_0_png_1 = __importDefault(require("../assets/antlion_0.png"));
var fire_ant_png_1 = __importDefault(require("../assets/fire_ant.png"));
var ice_ant_png_1 = __importDefault(require("../assets/ice_ant.png"));
var Ant_1 = __importDefault(require("../model/Ant"));
var Direction_1 = __importDefault(require("../model/Direction"));
/**
 * Manage rendering the ant model
 */
var AntSprite = /** @class */ (function (_super) {
    __extends(AntSprite, _super);
    function AntSprite(scene, x, y, texture, frame) {
        var _this = _super.call(this, scene, x, y, texture, frame) || this;
        _this.setDisplayOrigin(64, 84);
        if (Object.keys(AntSprite.Skin).indexOf(texture)) {
            _this.skin = texture;
        }
        else {
            _this.skin = AntSprite.Skin.ANT_LION;
            console.error("Unknown texture " + texture + ". Default to " + _this.skin);
        }
        return _this;
    }
    Object.defineProperty(AntSprite.prototype, "ant", {
        get: function () {
            return this._ant;
        },
        set: function (value) {
            if (!(value instanceof Ant_1.default)) {
                debugger;
            }
            this._ant = value;
        },
        enumerable: false,
        configurable: true
    });
    AntSprite.prototype.update = function (time, delta) {
        // move with the ant
        this.x = this.ant.x;
        this.y = this.ant.y;
        _super.prototype.update.call(this, time, delta);
        this.anims.update(time, delta);
    };
    AntSprite.prototype.setFrameRate = function (frameRate) {
        this.anims.msPerFrame = 1000 / frameRate;
    };
    AntSprite.prototype.animate = function () {
        var _a, _b;
        var key = AntSprite.buildAnimKey(this.skin, this._ant.direction, this._ant.activity);
        var currentKey = (_b = (_a = this.anims) === null || _a === void 0 ? void 0 : _a.currentAnim) === null || _b === void 0 ? void 0 : _b.key;
        if (currentKey != key) {
            _super.prototype.play.call(this, key);
        }
        return this;
    };
    AntSprite.prototype.setDirection = function (dir) {
        if (this._ant.direction == dir) {
            return;
        }
        this._ant.direction = dir;
        this.animate();
    };
    AntSprite.prototype.getActivity = function () {
        return this._ant.activity;
    };
    AntSprite.prototype.setActivity = function (newActivity) {
        if (this._ant.activity == newActivity) {
            return;
        }
        this._ant.activity = newActivity;
        this.animate();
    };
    AntSprite.preload = function (scene) {
        var antFrameConfig = { frameWidth: 128, frameHeight: 128 };
        scene.load.spritesheet(AntSprite.Skin.ANT_LION, antlion_0_png_1.default, antFrameConfig);
        scene.load.spritesheet(AntSprite.Skin.FIRE_ANT, fire_ant_png_1.default, antFrameConfig);
        scene.load.spritesheet(AntSprite.Skin.ICE_ANT, ice_ant_png_1.default, antFrameConfig);
    };
    AntSprite.init = function (scene) {
        // create animation for each skin, direction and activity
        Object.values(AntSprite.Skin).forEach(function (skinValue) {
            var skin = skinValue;
            Object.values(Direction_1.default).filter(isFinite).forEach(function (dirValue) {
                var dir = dirValue;
                Object.values(Ant_1.default.Activity).forEach(function (activityValue) {
                    var activity = activityValue;
                    var animKey = AntSprite.buildAnimKey(skin, dir, activity);
                    scene.anims.create({
                        key: animKey,
                        frames: scene.anims.generateFrameNumbers(skin, AntSprite.spriteOffset(activity, dir)),
                        frameRate: 6,
                        yoyo: activity === Ant_1.default.Activity.ATTACK,
                        repeat: activity === Ant_1.default.Activity.WALK || activityValue === Ant_1.default.Activity.STAND ? -1 : 0,
                    });
                });
            });
        });
    };
    /**
     * Build the animation key for the specific skin, direction and activity
     */
    AntSprite.buildAnimKey = function (skin, dir, activity) {
        return skin + '_' + activity + '_' + dir;
    };
    AntSprite.spriteOffset = function (activity, direction) {
        function animOffset(start, length) {
            return { 'start': start, 'end': start + length - 1 };
        }
        /**
         0-3   standing
         4-11  walking
         12-15 attack
         16-17 block
         18-23 hit/die
         24-31 critdie
         */
        switch (activity) {
            case Ant_1.default.Activity.STAND:
                return animOffset(+direction * 32, 4);
            case Ant_1.default.Activity.WALK:
                return animOffset(+direction * 32 + 4, 8);
            case Ant_1.default.Activity.ATTACK:
                return animOffset(+direction * 32 + 12, 4);
            case Ant_1.default.Activity.BLOCK:
                return animOffset(+direction * 32 + 16, 2);
            case Ant_1.default.Activity.HIT_DIE:
                return animOffset(+direction * 32 + 18, 6);
            case Ant_1.default.Activity.CRIT_DIE:
                return animOffset(+direction * 32 + 24, 8);
            default:
                return animOffset(+direction * 32, 4);
        }
    };
    AntSprite.prototype.log = function (message) {
        console.log('id:' + this._ant.id + ':', message);
    };
    AntSprite.prototype.relocate = function (x, y) {
        this.ant.x = x;
        this.ant.y = y;
        this.x = x;
        this.y = y;
    };
    return AntSprite;
}(Phaser.GameObjects.Sprite));
exports.AntSprite = AntSprite;
(function (AntSprite) {
    var Skin;
    (function (Skin) {
        Skin["ANT_LION"] = "ant-lion";
        Skin["FIRE_ANT"] = "fire-ant";
        Skin["ICE_ANT"] = "ice-ant";
    })(Skin = AntSprite.Skin || (AntSprite.Skin = {}));
})(AntSprite = exports.AntSprite || (exports.AntSprite = {}));
exports.AntSprite = AntSprite;
exports.default = AntSprite;
//# sourceMappingURL=AntSprite.js.map