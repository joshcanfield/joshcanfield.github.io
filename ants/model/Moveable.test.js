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
var globals_1 = require("@jest/globals");
var ts_mixer_1 = require("ts-mixer");
var Moveable_1 = __importDefault(require("./Moveable"));
var TestMoveable = /** @class */ (function (_super) {
    __extends(TestMoveable, _super);
    function TestMoveable(x, y) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        _this.on(Moveable_1.default.Event.beforeMove, function (distance) {
            _this.beforeMoveDistance = distance;
            return distance < TestMoveable.MAX_DISTANCE;
        });
        _this.on(Moveable_1.default.Event.afterMove, function (distance) {
            _this.afterMoveDistance = distance;
            return distance < TestMoveable.MAX_DISTANCE;
        });
        return _this;
    }
    TestMoveable.MAX_DISTANCE = 1000;
    return TestMoveable;
}(ts_mixer_1.Mixin(Moveable_1.default)));
globals_1.test('is moveable', function () {
    var moveable = new TestMoveable(10, 20);
    globals_1.expect(moveable.x).toEqual(10);
    globals_1.expect(moveable.y).toEqual(20);
    moveable.setVelocity(1, 1);
    moveable.move();
    globals_1.expect(moveable.x).toEqual(11);
    globals_1.expect(moveable.y).toEqual(21);
});
globals_1.test('beforeMove can cancel', function () {
    var moveable = new TestMoveable(10, 20);
    moveable.setVelocity(TestMoveable.MAX_DISTANCE + 1, 1);
    globals_1.expect(moveable.x).toEqual(10);
    globals_1.expect(moveable.y).toEqual(20);
});
//# sourceMappingURL=Moveable.test.js.map