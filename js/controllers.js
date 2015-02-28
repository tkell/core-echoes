var coreEchoesApp = angular.module('coreEchoesApp', []);

coreEchoesApp.controller('echoController', function ($scope) {
    $scope.echoes = [
        {'ip': '192.168.1.10'},
        {'ip': '121.17.19.10'},
        {'ip': '21.7.149.107'},
        {'ip': '21.34.149.231'},
        {'ip': '64.10.222.56'},
    ];

    var synth1 = new Tone.MonoSynth();
    var synth2 = new Tone.MonoSynth();
    var synth3 = new Tone.MonoSynth();

    synth1.setOscType('sine');
    synth2.setOscType('sine');
    synth3.setOscType('sine');

    // More synth quality here!
    synth1.output.gain = 0.2;
    synth2.output.gain = 0.2;
    synth3.output.gain = 0.2;

    synth1.toMaster();
    synth2.toMaster();
    synth3.toMaster();

    // Initial data
    var startFlag = true
    var tempIndex = 0;
    var noteData = [
            {'note': 'C4', 'duration': 0.5, 'repetition':  1},
            {'note': 'C4', 'duration': 0.5, 'repetition':  1},
            {'note': 'C4', 'duration': 0.5, 'repetition':  1}
        ];

    var padIPs = function (ipArray) {
        for (var i = 0; i < ipArray.length; i++) {
            if (ipArray[i].length == 2) {
                ipArray[i] = '0' + ipArray[i];
            } 
            else if (ipArray[i].length == 1) {
                ipArray[i] = '00' + ipArray[i];
            }
        }
        return ipArray;
    }

    var getProbabilties = function(ipString) {
        var probabilities = [];
        var totalProb = 0;
        for (var i = 0; i < ipString.length; i++) {
            probabilities[i] = parseInt(ipString[i]);
            totalProb = totalProb + probabilities[i];
        }

        for (var i = 0; i < probabilities.length; i++) {
            probabilities[i] = probabilities[i] / totalProb;
        }

        return probabilities;
    }

    var choose = function(probabilities, array) {
        var res = Math.random();
        if (res < probabilities[0]) {
            index = array[0]
        } else if (res >= probabilities[0] && res < probabilities[1]) {
            index = array[1]
        } else {
            index = array[2]
        }
        return index;
    }

    var getPitches = function(ipArray) {
        var pitches = [];
        var convertToLetters = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];

        for (var i = 0; i < ipArray.length; i++) {
            var pitch = 0;
            for (var j = 0; j < ipArray[i].length; j++) {
                pitch = pitch + parseInt(ipArray[i][j]);
            }
            pitches[i] = convertToLetters[pitch % 12];
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
        var times = [];
        for (var i = 0; i < ipArray.length; i++) {
            var t = 0;
            for (var j = 0; j < ipArray[i].length; j++) {
                t = t + parseInt(ipArray[i][j]);
            }
            times[i] = t;
        }
        return times;   
    }

    var doNextTimeout = function() {
        var currentIP = $scope.echoes[tempIndex].ip;
        synthIndex = tempIndex % 3;
        currentIP = currentIP.split('.');
        currentIP = padIPs(currentIP);

        var pitchProb = getProbabilties(currentIP[0]);
        var pitches = getPitches(currentIP.slice(1, 4));
        noteData[synthIndex].note = choose(pitchProb, pitches);

        var rhythmProb = getProbabilties(currentIP[1]);
        var rhythms = getRhythms([currentIP[0]].concat(currentIP.slice(2, 4)))
        noteData[synthIndex].repetition = choose(rhythmProb, rhythms); 

        var durationProb = getProbabilties(currentIP[2]);
        var durations = getDurations(currentIP.slice(0, 2).concat(currentIP[3]));
        noteData[synthIndex].duration = noteData[synthIndex].repetition / 2; 

        var timeoutProb = getProbabilties(currentIP[3]);
        var timeouts = getTimeouts(currentIP.slice(0, 3));
        var nextTimeout = choose(timeoutProb, timeouts); 

        console.log(currentIP, synthIndex, noteData[synthIndex], nextTimeout)

        if (startFlag == true) {
            if (synthIndex == 0) {  
                console.log("Starting")
                Tone.Transport.setInterval(function(time) {
                    synth1.triggerAttackRelease(noteData[0].note, noteData[0].duration, time);
                }, noteData[0].repetition);
                Tone.Transport.start();
            }

            if (synthIndex == 1) {  
                Tone.Transport.setInterval(function(time) {
                    synth2.triggerAttackRelease(noteData[1].note, noteData[1].duration, time);
                }, noteData[1].repetition);
            }

            if (synthIndex == 2) {  
                startFlag = false;
                Tone.Transport.setInterval(function(time) {
                    synth3.triggerAttackRelease(noteData[2].note, noteData[2].duration, time);
                }, noteData[2].repetition);
            }
        }
        
        tempIndex = tempIndex + 1
        if (tempIndex < $scope.echoes.length) {
            setTimeout(doNextTimeout, nextTimeout * 1000);
        } else {
            setTimeout(function() {Tone.Transport.stop()}, nextTimeout * 1000);
            console.log("stopping soon!");
        }
    }

    doNextTimeout();
 });