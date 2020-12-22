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
require("phaser");
var AntSprite_1 = __importDefault(require("../sprites/AntSprite"));
var grass_jpg_1 = __importDefault(require("../assets/grass.jpg"));
var hole_png_1 = __importDefault(require("../assets/hole.png"));
var Ant_1 = __importDefault(require("../model/Ant"));
/**
 * The Demo Scene
 *
 * A place to demonstrate experiments
 */
var DemoScene = /** @class */ (function (_super) {
    __extends(DemoScene, _super);
    function DemoScene() {
        return _super.call(this, 'demoScene') || this;
    }
    // noinspection JSUnusedGlobalSymbols
    DemoScene.prototype.preload = function () {
        AntSprite_1.default.preload(this);
        this.load.image('background', grass_jpg_1.default);
        this.load.image('hole', hole_png_1.default);
    };
    // noinspection JSUnusedGlobalSymbols
    DemoScene.prototype.create = function () {
        var backgroundSprite = this.add.tileSprite(0, 0, 1600, 1200, 'background');
        this.add.image(260, 120, "hole");
        this.add.image(550, 350, "hole");
        AntSprite_1.default.init(this);
        var CREATURES = 10;
        this.cameras.main.setBackgroundColor('#207621');
        this.antGroup = this.add.group({ classType: AntSprite_1.default, runChildUpdate: false });
        var _loop_1 = function (i) {
            // get spawn point
            var startX = 100 + (i % 5 * 80);
            var startY = 100 + (Math.floor(i / 5) * 80);
            var ant = this_1.antGroup.get(startX, startY, AntSprite_1.default.Skin.FIRE_ANT, 0, true);
            var activities = Object.values(Ant_1.default.Activity);
            var activity = activities[i % activities.length];
            var that = this_1;
            ant.setActivity(activity);
            ant.setInteractive({ draggable: true }).on('pointerdown', function () {
                if (ant.getActivity() !== Ant_1.default.Activity.CRIT_DIE) {
                    ant.setActivity(Ant_1.default.Activity.CRIT_DIE);
                    that.time.delayedCall(3000, function () {
                        that.tweens.add({
                            targets: ant,
                            alpha: 0,
                            duration: 2000,
                            ease: 'Power2'
                        });
                    });
                }
                else {
                    ant.setActivity(Ant_1.default.Activity.WALK);
                }
            });
            ant.setDepth(CREATURES - i);
            ant.setActive(true);
        };
        var this_1 = this;
        // create all the creatures
        for (var i = 0; i < CREATURES; ++i) {
            _loop_1(i);
        }
    };
    return DemoScene;
}(Phaser.Scene));
exports.default = DemoScene;
//# sourceMappingURL=demo-scene.js.map