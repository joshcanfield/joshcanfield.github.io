"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("phaser");
var mutation_scene_1 = __importDefault(require("./scenes/mutation-scene"));
var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'genetic-ants',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    width: 800,
    height: 600,
    backgroundColor: '#787878',
    scene: mutation_scene_1.default
};
var game = new Phaser.Game(config);
//# sourceMappingURL=index.js.map