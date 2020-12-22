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
var Ant_1 = __importDefault(require("./Ant"));
var AntBrain_1 = __importDefault(require("./AntBrain"));
var MutatingAnt = /** @class */ (function (_super) {
    __extends(MutatingAnt, _super);
    function MutatingAnt(withBrain) {
        var _this = _super.call(this) || this;
        /**
         * keeping `this` context by using 'private fn = () => {}' format
         */
        _this.handleThinkOutput = function (output) {
            var adjustRadians = _this.calculateDirection(output);
            var speed = _this.speed * (1 + (output.left + output.right) / 2);
            _this.headingRadians += adjustRadians;
            if (_this.headingRadians < 0) {
                _this.headingRadians = 2 * Math.PI + _this.headingRadians;
            }
            while (_this.headingRadians > 2 * Math.PI) {
                _this.headingRadians -= 2 * Math.PI;
            }
            _this.setVelocity(Math.floor(speed * Math.cos(_this.headingRadians)), -Math.floor(speed * Math.sin(_this.headingRadians)));
        };
        if (withBrain) {
            _this.brain = new AntBrain_1.default(5);
        }
        return _this;
    }
    MutatingAnt.create = function () {
        return new MutatingAnt(true);
    };
    MutatingAnt.prototype.think = function (world) {
        return __awaiter(this, void 0, void 0, function () {
            var antenna, input, intensity;
            var _this = this;
            return __generator(this, function (_a) {
                _super.prototype.think.call(this, world);
                this.brain = new AntBrain_1.default(5);
                antenna = this.getSensors();
                input = new AntBrain_1.default.Input();
                intensity = world.calcIntensity(antenna);
                // I happen to know that the ant has 2 senor "antenna"
                input.antennaRight = intensity[0];
                input.antennaLeft = intensity[1];
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.brain.think(input)
                            .then(_this.handleThinkOutput)
                            .then(resolve)
                            .catch(reject);
                    })];
            });
        });
    };
    MutatingAnt.prototype.calculateDirection = function (output) {
        var leftScale = output.left;
        var rightScale = output.right;
        if (leftScale > rightScale) {
            return Math.PI / 4;
        }
        return -Math.PI / 4;
        // cos(θ) = adjacent/hypotenuse = x / radius = x / 1
        // let cosTheta = leftScale - rightScale; // lifting more left turns more right
        // return (Math.PI / 2) - Math.acos(cosTheta);
    };
    /**
     * Return an ant that is mutated from this ant at the given rate
     * @param rate - number between 0 and 1
     */
    MutatingAnt.prototype.mutate = function (rate) {
        return this._clone(this.brain.mutate(rate));
    };
    /**
     * Do cross over breeding with another ant
     * @param ant
     */
    MutatingAnt.prototype.breedWith = function (ant) {
        return this._clone(this.brain.breed(ant.brain));
    };
    MutatingAnt.prototype.clone = function () {
        var brain = this.brain.clone();
        return this._clone(brain);
    };
    MutatingAnt.prototype._clone = function (brain) {
        var mutatingAnt = new MutatingAnt(false);
        if (brain) {
            mutatingAnt.brain = brain;
        }
        return mutatingAnt;
    };
    MutatingAnt.prototype.dispose = function () {
        this.brain.dispose();
    };
    return MutatingAnt;
}(Ant_1.default));
exports.default = MutatingAnt;
//# sourceMappingURL=MutatingAnt.js.map