var coreEchoesApp = angular.module('coreEchoesApp', []);

coreEchoesApp.controller('echoController', function ($scope) {
    $scope.echoes = [
        {'ip': '192.168.1.10'},
        {'ip': '121.17.19.10'},
        {'ip': '21.7.149.107'},
    ];

    var synth1 = new Tone.MonoSynth();
    var synth2 = new Tone.MonoSynth();
    var synth3 = new Tone.MonoSynth();

    var tempo = 128;
    var beatTime = 60 / 128;

    synth1.setOscType('sine');
    synth2.setOscType('sine');
    synth3.setOscType('sine');

    // More synth quality here!

    synth1.toMaster();
    synth2.toMaster();
    synth3.toMaster();

    // Initial notes

    noteData = [{'note': 'C4', 'duration': 0.2, 'repetition':  beatTime},
            {'note': 'G4', 'duration': 0.5, 'repetition':  beatTime},
            {'note': 'C5', 'duration': 0.5, 'repetition':  beatTime / 6}
        ];

    var currentIP = $scope.echoes[0].ip;
    currentIP = currentIP.split('.');
    // pad ips
    for (var i = 0; i < currentIP.length; i++) {
        if (currentIP[i].length == 2) {
            currentIP[i] = '0' + currentIP[i];
        } 
        else if (currentIP[i].length == 1) {
            currentIP[i] = '00' + currentIP[i];
        }
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

    var pitchProb = getProbabilties(currentIP[0]);
    var pitches = getPitches(currentIP.slice(1, 4));
    noteData[0].note = choose(pitchProb, pitches);

    var rhythmProb = getProbabilties(currentIP[1]);
    var rhythms = getRhythms([currentIP[0]].concat(currentIP.slice(2, 4)))
    noteData[0].repetition = choose(rhythmProb, rhythms); 


    console.log(currentIP);
    console.log(pitchProb, pitches, noteData[0].note);
    console.log(rhythmProb, rhythms, noteData[0].repetition);


    Tone.Transport.setInterval(function(time) {
        synth1.triggerAttackRelease(noteData[0].note, noteData[0].duration, time);
    }, noteData[0].repetition);

    // Tone.Transport.setInterval(function(time) {
    //     synth2.triggerAttackRelease(noteData[1].note, noteData[1].duration, time);
    // }, noteData[1].repetition);

    // Tone.Transport.setInterval(function(time) {
    //     synth1.triggerAttackRelease(noteData[2].note, noteData[2].duration, time);
    // }, noteData[2].repetition);

    //start the transport
    Tone.Transport.start();


});