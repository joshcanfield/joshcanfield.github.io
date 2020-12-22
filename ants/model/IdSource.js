"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IdSource = /** @class */ (function () {
    function IdSource() {
    }
    IdSource.nextId = function (name) {
        var id = IdSource.idSource[name];
        if (id === undefined) {
            return IdSource.idSource[name] = 0;
        }
        return ++IdSource.idSource[name];
    };
    IdSource.idSource = {};
    return IdSource;
}());
exports.default = IdSource;
//# sourceMappingURL=IdSource.js.map