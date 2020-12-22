"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var IdSource_1 = __importDefault(require("./IdSource"));
globals_1.test('starts with 0', function () {
    globals_1.expect(IdSource_1.default.nextId('test start')).toEqual(0);
});
globals_1.test('increments by 1', function () {
    globals_1.expect(IdSource_1.default.nextId('test inc')).toEqual(0);
    globals_1.expect(IdSource_1.default.nextId('test inc')).toEqual(1);
    globals_1.expect(IdSource_1.default.nextId('test inc')).toEqual(2);
});
globals_1.test('track multiple names', function () {
    globals_1.expect(IdSource_1.default.nextId('test multiple 1')).toEqual(0);
    globals_1.expect(IdSource_1.default.nextId('test multiple 2')).toEqual(0);
    globals_1.expect(IdSource_1.default.nextId('test multiple 1')).toEqual(1);
    globals_1.expect(IdSource_1.default.nextId('test multiple 2')).toEqual(1);
    globals_1.expect(IdSource_1.default.nextId('test multiple 1')).toEqual(2);
    globals_1.expect(IdSource_1.default.nextId('test multiple 2')).toEqual(2);
});
//# sourceMappingURL=IdSource.test.js.map