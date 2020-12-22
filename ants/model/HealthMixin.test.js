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
var HealthMixin_1 = __importDefault(require("./HealthMixin"));
var EventMixin_1 = __importDefault(require("./EventMixin"));
var ts_mixer_1 = require("ts-mixer");
var TestHealthMixin = /** @class */ (function (_super) {
    __extends(TestHealthMixin, _super);
    function TestHealthMixin(health) {
        var _this = _super.call(this) || this;
        _this.deathTriggered = false;
        HealthMixin_1.default.construct(_this, health);
        _this.on(HealthMixin_1.default.Event.onDeath, function () {
            _this.deathTriggered = true;
            return true;
        });
        return _this;
    }
    return TestHealthMixin;
}(ts_mixer_1.Mixin(HealthMixin_1.default, EventMixin_1.default)));
globals_1.test('tracks health', function () {
    var testClass = new TestHealthMixin(100);
    testClass.consumeHealth(90);
    globals_1.expect(testClass.health).toEqual(10);
    globals_1.expect(testClass.isAlive()).toBe(true);
    globals_1.expect(testClass.isDead()).toBe(false);
    globals_1.expect(testClass.deathTriggered).toBe(false);
});
globals_1.test('0 health triggers death ', function () {
    var testClass = new TestHealthMixin(100);
    testClass.consumeHealth(100);
    globals_1.expect(testClass.health).toEqual(0);
    globals_1.expect(testClass.isAlive()).toBe(false);
    globals_1.expect(testClass.isDead()).toBe(true);
    // check that the callback ran
    globals_1.expect(testClass.deathTriggered).toBe(true);
});
globals_1.test('negative health triggers death and sets health to zero', function () {
    var testClass = new TestHealthMixin(100);
    testClass.consumeHealth(110);
    globals_1.expect(testClass.health).toEqual(0);
    globals_1.expect(testClass.isAlive()).toBe(false);
    globals_1.expect(testClass.isDead()).toBe(true);
    // check that the callback ran
    globals_1.expect(testClass.deathTriggered).toBe(true);
});
//# sourceMappingURL=HealthMixin.test.js.map