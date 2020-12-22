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
var AntSprite_1 = __importDefault(require("./AntSprite"));
var Ant_1 = __importDefault(require("../model/Ant"));
var Direction_1 = __importDefault(require("../model/Direction"));
var Activity = Ant_1.default.Activity;
var FoodSprite = /** @class */ (function (_super) {
    __extends(FoodSprite, _super);
    function FoodSprite(scene, x, y) {
        var _this = _super.call(this, scene, x, y, AntSprite_1.default.Skin.FIRE_ANT, 0) || this;
        _this.ant = new Ant_1.default(Activity.CRIT_DIE, Direction_1.default.RIGHT, 100);
        _this.ant.x = x;
        _this.ant.y = y;
        _this.animate();
        return _this;
    }
    return FoodSprite;
}(AntSprite_1.default));
exports.default = FoodSprite;
//# sourceMappingURL=FoodSprite.js.map