"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var tf = __importStar(require("@tensorflow/tfjs"));
var MutatingAnt_1 = __importDefault(require("./MutatingAnt"));
var ant;
beforeEach(function () {
    ant = MutatingAnt_1.default.create();
});
afterEach(function () {
    // don't leak
    ant.dispose();
    var memoryInfo = tf.memory();
    console.log(memoryInfo);
});
globals_1.test('ant has a brain', function () {
    globals_1.expect(ant.brain).not.toBeUndefined();
});
globals_1.test('ant has health', function () {
    globals_1.expect(ant.health).not.toBeUndefined();
});
globals_1.test('mutate creates new brain', function () {
    var mutated = ant.mutate(.5);
    globals_1.expect(mutated).not.toBe(ant);
    globals_1.expect(mutated.brain).not.toBe(ant.brain);
    mutated.dispose();
});
globals_1.test('breedWith creates new ant/brain', function () {
    var toBreed = MutatingAnt_1.default.create();
    var bred = ant.breedWith(toBreed);
    globals_1.expect(bred).not.toBe(ant);
    globals_1.expect(bred).not.toBe(toBreed);
    globals_1.expect(bred.brain).not.toBe(ant.brain);
    globals_1.expect(bred.brain).not.toBe(toBreed.brain);
    toBreed.dispose();
    bred.dispose();
});
globals_1.test('cloned ants health trigger still fires', function () {
    var ant = MutatingAnt_1.default.create();
    var mutant = ant.mutate(10);
    globals_1.expect(mutant.moveable).toBeTruthy();
    mutant.consumeHealth(mutant.maxHealth);
    globals_1.expect(mutant.moveable).toBeFalsy();
});
//# sourceMappingURL=MutatingAnt.test.js.map