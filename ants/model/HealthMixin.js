"use strict";
/**
 * maintains health
 */
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
var ts_mixer_1 = require("ts-mixer");
var EventMixin_1 = __importDefault(require("./EventMixin"));
var HealthMixin = /** @class */ (function (_super) {
    __extends(HealthMixin, _super);
    function HealthMixin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HealthMixin.prototype.consumeHealth = function (points) {
        var newHealth = this._health - points;
        if (newHealth <= 0) {
            this._health = 0;
            this.trigger(HealthMixin.Event.onDeath, newHealth);
        }
        else {
            this._health = newHealth;
        }
    };
    HealthMixin.prototype.restoreHealth = function (points) {
        var startingHealth = this._health;
        this._health += points;
        if (this._health > this._maxHealth) {
            this._health = this._maxHealth;
        }
        if (startingHealth === 0 && points > 0) {
            this.trigger(HealthMixin.Event.onRevive, this._health);
        }
    };
    HealthMixin.prototype.isAlive = function () {
        return this.health > 0;
    };
    HealthMixin.prototype.isDead = function () {
        return this.health === 0;
    };
    Object.defineProperty(HealthMixin.prototype, "health", {
        get: function () {
            return this._health;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HealthMixin.prototype, "maxHealth", {
        get: function () {
            return this._maxHealth;
        },
        set: function (value) {
            this._maxHealth = value;
        },
        enumerable: false,
        configurable: true
    });
    HealthMixin.construct = function (param, health) {
        param._health = health;
        param._maxHealth = health;
    };
    return HealthMixin;
}(ts_mixer_1.Mixin(EventMixin_1.default)));
(function (HealthMixin) {
    var Event;
    (function (Event) {
        Event["onDeath"] = "DEATH";
        Event["onRevive"] = "REVIVE";
    })(Event = HealthMixin.Event || (HealthMixin.Event = {}));
})(HealthMixin || (HealthMixin = {}));
exports.default = HealthMixin;
//# sourceMappingURL=HealthMixin.js.map