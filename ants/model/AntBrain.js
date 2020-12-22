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
var tf = __importStar(require("@tensorflow/tfjs"));
var lodash_1 = __importDefault(require("lodash"));
var DEBUG_WEIGHTS = false;
var AntBrain = /** @class */ (function () {
    function AntBrain(memorySize) {
        this.disposed = false;
        this.memorySize = memorySize;
        this.inputMemory = [];
        // Memory needs to be populated before we start
        var defaultInput = new AntBrain.Input().toArray();
        for (var i = 0; i < memorySize; ++i) {
            this.inputMemory.push(defaultInput);
        }
        this.createModel();
    }
    /**
     * Creates network based on the size of AntBrain.Input and AntBrain.Output
     */
    AntBrain.prototype.createModel = function () {
        var _this_1 = this;
        var _this = this;
        // if you don't tidy then you leak tensors when you dispose
        tf.tidy(function () {
            var inputShape = [_this.memorySize * AntBrain.Input.size];
            _this_1._model = tf.sequential();
            // hidden
            _this_1._model.add(tf.layers.dense({
                units: 8,
                inputShape: inputShape,
                useBias: true,
                trainable: false,
                activation: 'sigmoid',
                kernelInitializer: "randomNormal",
                biasInitializer: "randomNormal",
            }));
            // output
            _this_1._model.add(tf.layers.dense({
                units: AntBrain.Output.size,
                batchSize: 1,
                useBias: true,
                trainable: false,
                activation: 'softmax',
                kernelInitializer: "randomNormal",
                biasInitializer: "randomNormal",
            }));
            // this._model.summary();
        });
    };
    AntBrain.prototype.think = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var _this;
            return __generator(this, function (_a) {
                _this = this;
                return [2 /*return*/, this.doAsync(function (resolve, reject) {
                        tf.tidy(function () {
                            if (_this.isDisposed()) {
                                // don't think if we've already been disposed
                                reject('disposed');
                                return;
                            }
                            _this.inputMemory.unshift(input.toArray());
                            _this.inputMemory.pop();
                            // flatten the inputs
                            var values = [].concat.apply([], _this.inputMemory);
                            // Predict!
                            var tensor = tf.tensor2d(values, [1, _this.memorySize * AntBrain.Input.size]);
                            var prediction = _this._model.predict(tensor, { batchSize: 1 });
                            var data = Array.from(prediction.dataSync());
                            var output = new AntBrain.Output();
                            output.left = data[0];
                            output.right = data[1];
                            // do something with the output
                            resolve(output);
                        });
                    })];
            });
        });
    };
    // TODO: user web workers to be truly async
    AntBrain.prototype.doAsync = function (func) {
        return new Promise(function (resolve, reject) {
            // schedule it to run later...
            setTimeout(func, 0, resolve, reject);
        });
    };
    AntBrain.prototype.breed = function (mate) {
        var _this_1 = this;
        console.log('breed:', tf.memory());
        var antBrain = new AntBrain(this.memorySize);
        tf.tidy(function () {
            var p1 = _this_1._model.getWeights();
            var p2 = mate._model.getWeights();
            var p3 = [];
            for (var i = 0; i < p1.length; ++i) {
                var v1 = p1[i].dataSync().slice();
                var v2 = p2[i].dataSync().slice();
                var shape = p1[i].shape;
                var dest = [];
                var start = lodash_1.default.random(v1.length);
                var end = lodash_1.default.random(start, v1.length);
                for (var j = 0; j < v1.length; ++j) {
                    if (j > start && j < end) {
                        dest[j] = v2[j];
                    }
                    else {
                        dest[j] = v1[j];
                    }
                }
                p3[i] = tf.tensor(dest, shape);
            }
            antBrain._model.setWeights(p3);
        });
        this.logWeights('breed this', this);
        this.logWeights('breed mate', mate);
        this.logWeights('breed result', antBrain);
        return antBrain;
    };
    /**
     * Creates a brain mutated from this brain.
     * @param mutationRate how much should we mutate? between 0 (none) and 1 (everything)
     */
    AntBrain.prototype.mutate = function (mutationRate) {
        var _this_1 = this;
        var antBrain = new AntBrain(this.memorySize);
        tf.tidy(function () {
            var weights = _this_1._model.getWeights();
            var weightCount = 0;
            var mutatedWeights = [];
            var mutationCount = 0;
            for (var i = 0; i < weights.length; ++i) {
                var v1 = weights[i].dataSync().slice();
                var v2 = [];
                for (var j = 0; j < v1.length; ++j) {
                    if (Math.random() > mutationRate) {
                        // just use the existing value
                        v2[j] = v1[j];
                    }
                    else {
                        v2[j] = v1[j] + AntBrain.randomAround0();
                        ++mutationCount;
                    }
                    ++weightCount;
                }
                mutatedWeights[i] = tf.tensor(v2, weights[i].shape);
            }
            antBrain._model.setWeights(mutatedWeights);
            console.debug("Mutation Rate: " + mutationRate + "; weights: " + weightCount + "; mutated: " + mutationCount);
            _this_1.logWeights('before mutation ', _this_1);
            _this_1.logWeights('after mutation', antBrain);
        });
        return antBrain;
    };
    AntBrain.randomAround0 = function () {
        return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
    };
    AntBrain.prototype.logWeights = function (tag, antBrain) {
        if (DEBUG_WEIGHTS) {
            var _loop_1 = function (i) {
                var out = [];
                var w = antBrain._model.weights[i];
                var dataSync = w.read().dataSync();
                dataSync.forEach(function (d) {
                    out.unshift(d.toFixed(4));
                });
                console.log(tag, antBrain._model.name, out);
            };
            for (var i = 0; i < antBrain._model.weights.length; ++i) {
                _loop_1(i);
            }
        }
    };
    AntBrain.prototype.dispose = function () {
        this.disposed = true;
        this._model.dispose();
    };
    AntBrain.prototype.isDisposed = function () {
        return this.disposed;
    };
    Object.defineProperty(AntBrain.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: false,
        configurable: true
    });
    AntBrain.prototype.clone = function () {
        // Copy the brain with no mutation
        return this.mutate(0);
    };
    return AntBrain;
}());
(function (AntBrain) {
    // configure TensorFlow
    tf.setBackend('cpu').catch(function (reason) {
        console.log(reason);
    });
    var Input = /** @class */ (function () {
        function Input() {
            // Sensor<>
            this.antennaRight = 0;
            this.antennaLeft = 0;
        }
        // TODO: add inputs
        // health: number
        Input.prototype.toArray = function () {
            return [this.antennaLeft, this.antennaRight];
        };
        // TODO: Some better way to determine this size...
        Input.size = 2;
        return Input;
    }());
    AntBrain.Input = Input;
    /**
     * The brain's output
     */
    var Output = /** @class */ (function () {
        function Output() {
        }
        Output.size = 2;
        return Output;
    }());
    AntBrain.Output = Output;
})(AntBrain || (AntBrain = {}));
exports.default = AntBrain;
//# sourceMappingURL=AntBrain.js.map