/*
"one step for man one giant leap for mankind"
{
    "one" : {
        words : {
            "step":{
                count:1,
                odds[0, .5]
            },
            "giant":{
                count:1,
                odds[.5, 1]
            }
        }
        count : 2
    }
    "step" : {
        words : [{"for":1}]
        count : 1
    }
}
*/
function Markov(input) {
    this.words = {};
    this.startWords = {};

    var text = input;
    if (Array.isArray(input)) {
        text = input.join(" ");
    }
    var doc = nlp(text);
    doc.contractions().expand();

    var _this = this;
    var lastWord = '';
    doc.terms().forEach(function (t) {
        var nextWord = t.text('reduced').toLowerCase().trim();
        if (!nextWord || isFinite(nextWord)) {
            return; // skip undesirables
        }
        var entry = _this.words[nextWord];
        if (!entry) {
            entry = _this.words[nextWord] = {
                words: {},
                syllables: t.syllables()[0].syllables.length,
                count: 0
            };
        }
        ++entry.count;

        if (lastWord) { // ignore first pass through
            var lastWordEntry = _this.words[lastWord];

            if (!lastWordEntry.words[nextWord]) {
                // key is the next word, value is count
                lastWordEntry.words[nextWord] = {count: 0};
            }
            lastWordEntry.words[nextWord].count++;
        }

        lastWord = nextWord;
    });

    // calculate odds
    Object.keys(this.words).forEach(function (w) {
        var oddsMin = 0;
        var wordEntry = _this.words[w];
        Object.keys(wordEntry.words).forEach(function (n) {
            var nextWordEntry = wordEntry.words[n];
            var oddsMax = oddsMin + nextWordEntry.count / wordEntry.count;
            nextWordEntry.odds = [oddsMin, oddsMax];
            oddsMin = oddsMax;
        });
    });

    doc.sentences().forEach(function (s) {
        _this.startWords[s.terms().first().text('reduced').toLowerCase()] = true;
    })
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

Markov.prototype.haikuSearch = function (word, remaining) {
    var _this = this;

    if ( remaining < 1 ) {
        return [word];
    }
    // start from the last word in the lineWords
    var wordEntry = this.words[word];

    var nextWords = Object.keys(wordEntry.words);
    // get a list of words that fit
    var possibleNextWords = _.filter(nextWords, function (w) {
        return _this.words[w].syllables <= remaining
    });
    if (possibleNextWords.length === 0) {
        return null; // bad path...
    }
    possibleNextWords = _.shuffle(
        _.flatten(_.map(possibleNextWords, function (w) {
            return _.fill(Array(wordEntry.words[w].count), w);
        }))
    );

    do {
        var nextWord = possibleNextWords.pop();
        var newSyllableCount = remaining - this.words[nextWord].syllables;
        if (newSyllableCount === 0) {
            return [nextWord];
        }
        var words = this.haikuSearch(nextWord, newSyllableCount);
        if (words) {
            return [nextWord].concat(words);
        }
    } while (possibleNextWords.length > 0);

    return null;
};

Markov.prototype.haiku = function () {
    var _this = this;
    var keys = Object.keys(this.startWords);
    var lines = ['goodbye','cruel','world'];

    [5,7,5].forEach(function(n, i) {
        var start = keys[getRandomInt(keys.length)];
        var lineWords = _this.haikuSearch(start, n - _this.words[start].syllables);
        if (!lineWords) {
            lines[i] = 'derp ' + start;
            return lines;
        }

        lines[i] = start + " " + lineWords.join(" ");
    });
    return lines;
};

Markov.prototype.generate = function (count) {
    var keys = Object.keys(this.startWords);
    var start = keys[getRandomInt(keys.length)];
    var lastWord = start;

    var sentence = [start];
    var found = true;
    for (var i = 0; found && i < count; ++i) {
        var wordEntry = this.words[lastWord];
        var r = Math.random();
        var nextWords = Object.keys(wordEntry.words);
        found = false;
        for (var j = 0; j < nextWords.length; ++j) {
            var odds = wordEntry.words[nextWords[j]].odds;
            if (r > odds[0] && r <= odds[1]) {
                lastWord = nextWords[j];
                sentence.push(lastWord);
                found = true;
                break;
            }
        }
    }
    console.log(sentence.join(" "));
};