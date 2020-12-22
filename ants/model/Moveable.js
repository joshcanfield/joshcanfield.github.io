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
var lodash_1 = __importDefault(require("lodash"));
var EventMixin_1 = __importDefault(require("./EventMixin"));
var ts_mixer_1 = require("ts-mixer");
var Moveable = /** @class */ (function (_super) {
    __extends(Moveable, _super);
    function Moveable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._moveable = true;
        _this._headingRadians = 0;
        _this._x = 0;
        _this._y = 0;
        _this._vx = 0;
        _this._vy = 0;
        _this._speed = 0;
        return _this;
    }
    Moveable.prototype.move = function () {
        var distance = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        // is moving ok?
        if (!this.moveable || !this.trigger(Moveable.Event.beforeMove, distance)) {
            return;
        }
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
        if (!lodash_1.default.isFinite(this.x) || !lodash_1.default.isFinite(this.y)) {
            console.log('bad x/y');
            debugger;
        }
        this.trigger(Moveable.Event.afterMove, distance);
    };
    Moveable.prototype.setVelocity = function (vx, vy) {
        this.vx = vx;
        this.vy = vy;
        if (!lodash_1.default.isFinite(this.vx) || !lodash_1.default.isFinite(this.vy)) {
            console.log('bad x/y');
            debugger;
        }
    };
    Object.defineProperty(Moveable.prototype, "speed", {
        get: function () {
            return this._speed;
        },
        set: function (value) {
            this._speed = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Moveable.prototype, "vy", {
        get: function () {
            return this._vy;
        },
        set: function (value) {
            this._vy = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Moveable.prototype, "vx", {
        get: function () {
            return this._vx;
        },
        set: function (value) {
            this._vx = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Moveable.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            if (this.moveable) {
                this._y = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Moveable.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            if (this.moveable) {
                this._x = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Moveable.prototype, "headingRadians", {
        get: function () {
            return this._headingRadians;
        },
        set: function (value) {
            if (this.moveable) {
                this._headingRadians = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Moveable.prototype, "moveable", {
        get: function () {
            return this._moveable;
        },
        set: function (value) {
            this._moveable = value;
        },
        enumerable: false,
        configurable: true
    });
    return Moveable;
}(ts_mixer_1.Mixin(EventMixin_1.default)));
(function (Moveable) {
    var Event;
    (function (Event) {
        Event["beforeMove"] = "beforeMove";
        Event["afterMove"] = "beforeMove";
    })(Event = Moveable.Event || (Moveable.Event = {}));
})(Moveable || (Moveable = {}));
exports.default = Moveable;
//# sourceMappingURL=Moveable.js.map