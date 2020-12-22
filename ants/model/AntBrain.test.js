"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var AntBrain_1 = __importDefault(require("./AntBrain"));
var Input = AntBrain_1.default.Input;
var antBrain;
jest.setTimeout(60000);
beforeEach(function () { return antBrain = new AntBrain_1.default(5); });
// TODO check for leaks
afterEach(function () {
    if (!antBrain.isDisposed()) {
        return antBrain.dispose();
    }
});
globals_1.test('predicts from input', function () {
    var input = new AntBrain_1.default.Input();
    input.antennaRight = .5;
    input.antennaLeft = .5;
    return antBrain.think(input).then(function (data) {
        globals_1.expect(data.left).not.toBe(0);
        globals_1.expect(data.right).not.toBe(0);
    });
});
globals_1.test('input varies up to memory size', function () { return __awaiter(void 0, void 0, void 0, function () {
    var input, output, i, thinkResult_1, thinkResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                input = new AntBrain_1.default.Input();
                input.antennaRight = .3;
                input.antennaLeft = .5;
                output = [];
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < antBrain.memorySize)) return [3 /*break*/, 4];
                return [4 /*yield*/, antBrain.think(input)];
            case 2:
                thinkResult_1 = _a.sent();
                globals_1.expect(output).not.toContainEqual(thinkResult_1);
                output.push(thinkResult_1);
                _a.label = 3;
            case 3:
                ++i;
                return [3 /*break*/, 1];
            case 4: return [4 /*yield*/, antBrain.think(input)];
            case 5:
                thinkResult = _a.sent();
                globals_1.expect(output).toContainEqual(thinkResult);
                return [2 /*return*/];
        }
    });
}); });
globals_1.test('mutate with rate 0 is different with same values', function () {
    var tensors = extractTensors(antBrain);
    var antBrain2 = antBrain.mutate(0);
    var tensors2 = extractTensors(antBrain2);
    // the objects are not the same
    globals_1.expect(tensors).not.toEqual(tensors2);
    // the values are the same
    globals_1.expect(extractValues(tensors)).toEqual(extractValues(tensors2));
    antBrain2.dispose();
});
globals_1.test('mutate with rate .5 changes about 50%', function () {
    function changedBy(tensors, tensors2) {
        var v1 = extractValues(tensors);
        var v2 = extractValues(tensors2);
        globals_1.expect(v1.length).toEqual(v2.length);
        var changed = 0;
        for (var i = 0; i < v1.length; ++i) {
            if (v1[i] != v2[i]) {
                ++changed;
            }
        }
        return changed / v1.length;
    }
    var changedAmount = 0;
    // mutation is random, do it enough to get a good sample
    for (var i = 0; i < 10; ++i) {
        var tensors = extractTensors(antBrain);
        var antBrain2 = antBrain.mutate(.5);
        var tensors2 = extractTensors(antBrain2);
        changedAmount += changedBy(tensors, tensors2);
        antBrain2.dispose();
    }
    changedAmount = changedAmount / 10;
    // it's random, allow for some variance
    globals_1.expect(changedAmount).toBeCloseTo(.5, 1);
});
globals_1.test('breed contains both parents', function () {
    var parent2 = new AntBrain_1.default(5);
    var childBrain = antBrain.breed(parent2);
    var p1 = extractValues(extractTensors(antBrain));
    var p2 = extractValues(extractTensors(parent2));
    var c = extractValues(extractTensors(childBrain));
    globals_1.expect(p1).not.toEqual(p2);
    globals_1.expect(c).not.toEqual(p2);
    globals_1.expect(c).not.toEqual(p1);
    globals_1.expect(p1.length).toBe(p2.length);
    globals_1.expect(c.length).toBe(p2.length);
    var countP1 = 0;
    var countP2 = 0;
    for (var i = 0; i < c.length; ++i) {
        if (c[i] === p1[i]) {
            ++countP1;
        }
        if (c[i] === p2[i]) {
            ++countP2;
        }
    }
    globals_1.expect(countP1).toBeGreaterThan(0);
    globals_1.expect(countP2).toBeGreaterThan(0);
    globals_1.expect(countP1 + countP2).toEqual(p1.length);
});
globals_1.test('disposed brains do not think', function () {
    antBrain.dispose();
    globals_1.expect.assertions(1);
    return antBrain.think(new Input())
        .catch(function (e) { return globals_1.expect(e).toEqual('disposed'); });
});
globals_1.test('training', function () {
    // create 100 random inputs
    //
});
function extractTensors(brain) {
    var tensors = [];
    brain.model.getWeights().forEach(function (t) {
        tensors.push(t);
    });
    return tensors;
}
function extractValues(tensors) {
    var map = tensors.map(function (t) { return Array.from(t.dataSync()); });
    var values = map.reduce(function (previousValue, currentValue) { return previousValue.concat(currentValue); }, []);
    return values;
}
//# sourceMappingURL=AntBrain.test.js.map