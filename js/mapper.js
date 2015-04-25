var mapper = function () {
    var getPitches = function(ipArray) {
        var pitches = [];
        var convertToLetters = [
        'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
        'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5'
        ];

        for (var i = 0; i < ipArray.length; i++) {
            var pitch = 0;
            for (var j = 0; j < ipArray[i].length; j++) {
                pitch = pitch + parseInt(ipArray[i][j]);
            }
            pitches[i] = convertToLetters[pitch % 24];
        }
        return pitches;
    }

    var getRhythms = function(ipArray) {
        var intervals = [];
        for (var i = 0; i < ipArray.length; i++) {
            var interval = 0;
            for (var j = 0; j < ipArray[i].length; j++) {
                interval = interval + parseInt(ipArray[i][j]);
            }
            intervals[i] = interval / 4;
        }
        return intervals;   
    }

    var getDurations = function(ipArray) {
        var modifiers = [];
        for (var i = 0; i < ipArray.length; i++) {
            var mod = 0;
            for (var j = 0; j < ipArray[i].length; j++) {
                mod = mod + parseInt(ipArray[i][j]);
            }
            modifiers[i] = mod / 2;
        }
        return modifiers;   
    }

    var getTimeouts = function(ipArray) {
        var time = 0;
        for (var i = 0; i < ipArray.length; i++) {
            var t = 0;
            for (var j = 0; j < ipArray[i].length; j++) {
                t = t + parseInt(ipArray[i][j]);
            }
            time = time + t;
        }
        return time;
    }
    return {
      getPitches: getPitches,
      getRhythms: getRhythms,
      getDurations: getDurations,
      getTimeouts: getTimeouts,
    }
}();
