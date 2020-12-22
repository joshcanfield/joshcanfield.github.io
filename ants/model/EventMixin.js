"use strict";
// @see https://javascript.info/mixins
Object.defineProperty(exports, "__esModule", { value: true });
var EventMixin = /** @class */ (function () {
    function EventMixin() {
    }
    /**
     * Subscribe to event, usage:
     *  menu.on('select', function(item) { ... }
     */
    EventMixin.prototype.on = function (eventName, handler) {
        if (!this._eventHandlers)
            this._eventHandlers = {};
        if (!this._eventHandlers[eventName]) {
            this._eventHandlers[eventName] = [];
        }
        this._eventHandlers[eventName].push(handler);
    };
    /**
     * Cancel the subscription, usage:
     *  menu.off('select', handler)
     */
    EventMixin.prototype.off = function (eventName, handler) {
        var _a;
        var handlers = (_a = this._eventHandlers) === null || _a === void 0 ? void 0 : _a[eventName];
        if (!handlers)
            return;
        for (var i = 0; i < handlers.length; i++) {
            if (handlers[i] === handler) {
                handlers.splice(i--, 1);
            }
        }
    };
    /**
     * Subscribe to event, usage:
     *  menu.on('select', function(item) { ... }
     */
    EventMixin.register = function (eventName, handler) {
        if (!this._globalEventHandlers[this.name]) {
            this._globalEventHandlers[this.name] = {};
        }
        if (!this._globalEventHandlers[this.name][eventName]) {
            this._globalEventHandlers[this.name][eventName] = [];
        }
        this._globalEventHandlers[this.name][eventName].push(handler);
    };
    /**
     * Cancel the subscription, usage:
     *  menu.off('select', handler)
     */
    EventMixin.deregister = function (eventName, handler) {
        var _a;
        var handlers = (_a = this._globalEventHandlers[this.constructor.name]) === null || _a === void 0 ? void 0 : _a[eventName];
        if (!handlers)
            return;
        for (var i = 0; i < handlers.length; i++) {
            if (handlers[i] === handler) {
                handlers.splice(i--, 1);
            }
        }
    };
    /**
     * Generate an event with the given name and data
     *  this.trigger('select', data1, data2);
     */
    EventMixin.prototype.trigger = function (eventName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this._eventHandlers && this._eventHandlers[eventName]) {
            // call the handlers, breaks of a handler returns false
            var canceled = this._eventHandlers[eventName].every(function (handler) { return handler.apply(_this, args) !== false; });
            if (!canceled)
                return canceled;
        }
        var handlers = this.constructor._globalEventHandlers;
        if (handlers) {
            var clazz = this.constructor;
            do {
                if (handlers[clazz.name] && handlers[clazz.name][eventName]) {
                    // call the handlers, breaks of a handler returns false
                    var proceed = handlers[clazz.name][eventName].every(function (handler) { return handler(_this, args) !== false; });
                    if (!proceed) {
                        return false;
                    }
                }
                clazz = Object.getPrototypeOf(clazz);
            } while (clazz !== null);
        }
        return true; // no handlers for that event name
    };
    EventMixin._globalEventHandlers = {};
    return EventMixin;
}());
exports.default = EventMixin;
//# sourceMappingURL=EventMixin.js.map