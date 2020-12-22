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
var phaser_1 = __importDefault(require("phaser"));
var MutatingAntSprite_1 = __importDefault(require("../sprites/MutatingAntSprite"));
var AntSprite_1 = __importDefault(require("../sprites/AntSprite"));
var grass_jpg_1 = __importDefault(require("../assets/grass.jpg"));
var hole_png_1 = __importDefault(require("../assets/hole.png"));
var World_1 = __importDefault(require("../model/World"));
var MutatingAnt_1 = __importDefault(require("../model/MutatingAnt"));
var lodash_1 = __importDefault(require("lodash"));
var FoodSprite_1 = __importDefault(require("../sprites/FoodSprite"));
var matingPairs = 2; // 2 pairs = 4
var CREATURE_LAYER = 500;
var FOOD_LAYER = 499;
var FOOD_COUNT = 10;
var ANT_COUNT = 10;
/**
 * The Mutation Scene
 */
var MutationScene = /** @class */ (function (_super) {
    __extends(MutationScene, _super);
    function MutationScene() {
        var _this = _super.call(this, 'mutationScene') || this;
        _this.topScoresLabel = [];
        _this.highScore = Number.MIN_VALUE;
        _this.highScoreGens = [];
        _this.world = new World_1.default();
        return _this;
    }
    // noinspection JSUnusedGlobalSymbols
    MutationScene.prototype.preload = function () {
        MutatingAntSprite_1.default.preload(this);
        this.load.image('background', grass_jpg_1.default);
        this.load.image('hole', hole_png_1.default);
    };
    // noinspection JSUnusedGlobalSymbols
    MutationScene.prototype.create = function () {
        // this.physics.startSystem(Phaser.Physics.ARCADE);
        this.graphics = this.add.graphics();
        this.graphics.setDepth(10);
        this.graphics.lineStyle(2, 0xffff00, 1);
        this.cameras.main.setBackgroundColor('#207621');
        var background = this.add.tileSprite(0, 0, 1600, 1200, 'background');
        background.setDepth(0);
        this.add.image(400, 300, "hole");
        MutatingAntSprite_1.default.init(this);
        this.foodGroup = this.add.group({ classType: AntSprite_1.default, runChildUpdate: true });
        for (var i = 0; i < FOOD_COUNT; ++i) {
            var food = new FoodSprite_1.default(this, 300, 300);
            this.foodGroup.add(food, true);
            this.world.food.push(food.ant);
            MutationScene.placeRandomly(food);
            food.setDepth(FOOD_LAYER);
            food.setActive(true);
        }
        this.antGroup = this.add.group({ classType: MutatingAntSprite_1.default, runChildUpdate: true });
        // create all the ants
        for (var i = 0; i < ANT_COUNT; ++i) {
            // get spawn point
            var startX = 400;
            var startY = 300;
            var ant = new MutatingAntSprite_1.default(this, {
                x: startX,
                y: startY,
                texture: i == 0 ? AntSprite_1.default.Skin.ICE_ANT : AntSprite_1.default.Skin.ANT_LION
            });
            this.antGroup.add(ant, true);
            ant.setDepth(CREATURE_LAYER);
            ant.setActive(true);
        }
        this.scoreBoard = this.add.text(10, 0, 'Progress: 0%', { color: '#0f0' });
        this.scoreBoard.setDepth(CREATURE_LAYER);
        for (var i = 0; i < 5; ++i) {
            this.topScoresLabel[i] = this.add.text(100, 100, '' + (i + 1));
            this.topScoresLabel[i].setDepth(CREATURE_LAYER);
        }
    };
    MutationScene.prototype.update = function (time, delta) {
        // score the children, pick best one replace the others brain with mutated
        var mutatingAnts = this.antGroup.getChildren();
        var scoredSprites = lodash_1.default.sortBy(mutatingAnts, ['score']).reverse();
        this.updateScoreboard(delta, scoredSprites);
        this.resetFood(function (a) { return a.isDead(); });
        this.updateGeneration(delta, mutatingAnts, scoredSprites);
    };
    MutationScene.prototype.updateGeneration = function (delta, mutatingAnts, scoredSprites) {
        MutationScene.currentGenerationTime += delta;
        // Only wait to end the generation if there are living ants
        var activeAnt = mutatingAnts.find(function (a) { return a.active; });
        if (activeAnt && MutationScene.currentGenerationTime < MutationScene.maxGenerationTime) {
            return;
        }
        this.resetFood(function () { return true; });
        ++MutationScene.generationCount;
        MutationScene.currentGenerationTime = 0;
        mutatingAnts.forEach(function (ant) { return ant.setActive(false); });
        if (scoredSprites[0].score > this.highScore) {
            this.highScoreAnt = scoredSprites[0].ant.clone();
            this.highScore = scoredSprites[0].score;
            this.highScoreGens.unshift({ 'gen': MutationScene.generationCount - 1, 'score': this.highScore });
            if (this.highScoreGens.length > 10) {
                this.highScoreGens.pop();
            }
        }
        else {
            console.log("keeping high score brain!");
            scoredSprites.unshift({ score: this.highScore, ant: this.highScoreAnt });
        }
        console.log(scoredSprites.map(function (ant) { return ant.score; }));
        var breederAnts = scoredSprites.slice(0, matingPairs * 2).map((function (scored) {
            if (scored.ant === undefined) {
                debugger;
            }
            return scored.ant.clone();
        }));
        mutatingAnts.forEach(function (antSprite, i) {
            // don't leak any memory
            antSprite.ant.dispose();
            // choose a strategy for mutating the ant
            if (i === 0) {
                // always keep the high score intact
                antSprite.ant = breederAnts[0].mutate(0.0);
                console.log('high score brain');
            }
            else if (i < matingPairs * 2) {
                // lower mutation of top score brains
                antSprite.ant = breederAnts[i].mutate(0.3);
                console.log('breeder brain');
            }
            else if (Math.random() < .1) { // 10% random
                // use a completely random brain
                antSprite.ant = MutatingAnt_1.default.create();
                console.log('random brain');
            }
            else {
                // grab a random baby brain
                var sample1 = lodash_1.default.sample(breederAnts);
                var sample2 = lodash_1.default.sample(breederAnts);
                var child = sample1.breedWith(sample2);
                antSprite.ant = child.mutate(.3);
                child.dispose();
                console.log('bred brain');
            }
            MutationScene.spawnAnt(antSprite);
        });
        breederAnts.forEach(function (ant) { return ant.dispose(); });
    };
    MutationScene.prototype.resetFood = function (filter) {
        // move the food
        var food = this.foodGroup.getChildren();
        food.forEach(function (food) {
            if (filter(food.ant)) {
                // can't move a dead ant so make it alive
                food.ant.restoreHealth(food.ant.maxHealth);
                MutationScene.placeRandomly(food);
                food.setActive(true);
                food.setVisible(true);
            }
        });
    };
    MutationScene.prototype.updateScoreboard = function (delta, scoredSprites) {
        MutationScene.scoreboardIntervalTime += delta;
        if (MutationScene.scoreboardIntervalTime <= MutationScene.scoreboardUpdateInterval) {
            return;
        }
        this.formatScoreboard(scoredSprites);
        for (var i = 0; i < this.topScoresLabel.length; ++i) {
            this.topScoresLabel[i].x = scoredSprites[i].x;
            this.topScoresLabel[i].y = scoredSprites[i].y;
        }
    };
    MutationScene.placeRandomly = function (food) {
        food.relocate(lodash_1.default.random(0, 800), lodash_1.default.random(0, 600));
    };
    MutationScene.prototype.formatScoreboard = function (scored) {
        function formatScore(antSprite) {
            var id = antSprite.ant.id.toString();
            var score = antSprite.score;
            var health = antSprite.ant.health;
            return id.padStart(3, ' ') + ":  " + score.toFixed(2) + " (" + health.toFixed(2) + ")";
        }
        var topAnts = scored.slice(0, 5);
        var topScores = topAnts.map(formatScore).join("\n");
        var timeRemaining = (MutationScene.maxGenerationTime - MutationScene.currentGenerationTime) / 1000;
        var highScores = this.highScoreGens.map(function (s) { return s.gen + ":" + s.score.toFixed(2); }).join(' | ');
        var debug = [
            "Time Remaining: " + timeRemaining.toFixed(2) + "; Generation: " + MutationScene.generationCount,
            "High Score: " + this.highScore.toFixed(2) + " - " + highScores,
            "Top Scores:\n" + topScores,
            "Bottom:\n" + formatScore(scored[scored.length - 1])
        ];
        this.scoreBoard.setText(debug);
    };
    MutationScene.spawnAnt = function (ant) {
        ant.reset();
        ant.setActive(true);
    };
    MutationScene.maxGenerationTime = 60000;
    MutationScene.currentGenerationTime = 0;
    MutationScene.generationCount = 1;
    MutationScene.scoreboardUpdateInterval = 500;
    MutationScene.scoreboardIntervalTime = 0;
    return MutationScene;
}(phaser_1.default.Scene));
exports.default = MutationScene;
//# sourceMappingURL=mutation-scene.js.map