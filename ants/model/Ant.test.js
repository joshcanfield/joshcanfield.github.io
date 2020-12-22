"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var Ant_1 = __importDefault(require("./Ant"));
var Direction_1 = __importDefault(require("./Direction"));
var Activity = Ant_1.default.Activity;
// verifies the mixins are working
globals_1.test('ant health', function () {
    var ant = new Ant_1.default(Activity.ATTACK, Direction_1.default.DOWN, 100);
    ant.consumeHealth(10);
    globals_1.expect(ant.health).toBe(90);
});
globals_1.test('ant death goes to dead activity', function () {
    var ant = new Ant_1.default(Activity.ATTACK, Direction_1.default.DOWN, 100);
    ant.consumeHealth(100);
    globals_1.expect(ant.health).toBe(0);
    globals_1.expect(ant.activity).toBe(Activity.CRIT_DIE);
    globals_1.expect(ant.isAlive()).toBe(false);
});
globals_1.test('ant moves', function () {
    var ant = new Ant_1.default(Activity.ATTACK, Direction_1.default.DOWN, 100);
    globals_1.expect(ant.x).toBe(0);
    globals_1.expect(ant.y).toBe(0);
    ant.setVelocity(1, 2);
    ant.move();
    ant.move();
    globals_1.expect(ant.x).toBe(2);
    globals_1.expect(ant.y).toBe(4);
});
//# sourceMappingURL=Ant.test.js.map