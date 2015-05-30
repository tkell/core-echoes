var mapper = function () {
    var getPitch = function(ipArray) {
        var pitch = 0;
        var convertToLetters = [
        'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
        'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5'
        ];

        for (var i = 0; i < ipArray.length; i++) {
            for (var j = 0; j < ipArray[i].length; j++) {
                pitch = pitch + parseInt(ipArray[i][j]);
            }
        }
        return convertToLetters[pitch % 24];
    }

    var getRhythm = function(ipArray) {
        var interval = 0;
        for (var i = 0; i < ipArray.length; i++) {
            for (var j = 0; j < ipArray[i].length; j++) {
                interval = interval + parseInt(ipArray[i][j]);
            }
        }
        return interval / 16;
    }

    var getDuration = function(ipArray) {
        var duration = 0;
        for (var i = 0; i < ipArray.length; i++) {
            for (var j = 0; j < ipArray[i].length; j++) {
                duration = duration + parseInt(ipArray[i][j]);
            }
        }
        return duration / 4;
    }

    var getTimeout = function(ipArray) {
        var time = 0;
        for (var i = 0; i < ipArray.length; i++) {
            var t = 0;
            for (var j = 0; j < ipArray[i].length; j++) {
                t = t + parseInt(ipArray[i][j]);
            }
            time = time + t;
        }
        return time / 4 ;
    }
    return {
      getPitch: getPitch,
      getRhythm: getRhythm,
      getDuration: getDuration,
      getTimeout: getTimeout,
    }
}();
