var coreEchoesApp = angular.module('coreEchoesApp', []);

function setUpSynths() {
    var synth1 = new Tone.MonoSynth();
    var synth2 = new Tone.MonoSynth();
    var synth3 = new Tone.MonoSynth();

    synth1.oscillator.type = 'sine';
    synth2.oscillator.type = 'sine';
    synth3.oscillator.type = 'sine';

    var chorus1 = new Tone.Chorus();
    chorus1.output.gain.value = 0.1;
    var delay2 = new Tone.PingPongDelay();
    delay2.feedback.value = 0.6
    delay2.output.gain.value = 0.1;
    var chorus3 = new Tone.Chorus(depth=0.1, rate=0.66);
    chorus3.output.gain.value = 0.1;

    synth1.volume.value = -6;
    synth2.volume.value = -6;
    synth3.volume.value = -6;

    synth1.connect(chorus1); chorus1.toMaster();
    synth2.connect(delay2); delay2.toMaster();
    synth3.connect(chorus3); chorus3.toMaster();

    return [synth1, synth2, synth3];
}


coreEchoesApp.controller('echoController', function ($scope, $timeout, $http) {
    var routeURL = 'https://core-echoes.herokuapp.com/route'
    $scope.showText = "co.re.echo.es";

    // Starts things going
    $scope.startTimeout = function() {
        $http.get(routeURL)
        .then(function(res) {
            $scope.echoes = res.data;
            doNextTimeout();
        });
    }

    var synths = setUpSynths();
	var synth1 = synths[0];
	var synth2 = synths[1];
	var synth3 = synths[2];

    // Initial data
    var tempIndex = 0;
    var startFlag = true;
    $scope.isPlaying = false;
    var noteData = [
            {'note': 'C4', 'duration': 0.5, 'repetition':  1},
            {'note': 'C4', 'duration': 0.5, 'repetition':  1},
            {'note': 'C4', 'duration': 0.5, 'repetition':  1}
        ];

    var doNextTimeout = function() {
        // console.log("doing another timeout", tempIndex);
        if ($scope.echoes.length != 0) {
            var currentIP = $scope.echoes[tempIndex].ip;
            $scope.showText = $scope.echoes[tempIndex].line_text;
            $scope.showDetails = currentIP;
            var synthIndex = tempIndex % 3;
            currentIP = currentIP.split('.');
            currentIP = ipUtils.pad(currentIP);

            noteData[synthIndex].note = mapper.getPitch(currentIP);
            noteData[synthIndex].repetition = mapper.getRhythm(currentIP);
            noteData[synthIndex].duration = mapper.getDuration(currentIP);
            var nextTimeout = mapper.getTimeout(currentIP);

            // console.log(currentIP, synthIndex, noteData[synthIndex], nextTimeout)
            if (startFlag == true) {
                if (synthIndex == 0) {
                    $scope.isPlaying = true;
                    synth1.volume.value = -6;
                    Tone.Transport.scheduleRepeat(function(time) {
                        synth1.triggerAttackRelease(noteData[0].note, noteData[0].duration, time);
                    }, noteData[0].repetition);
                    Tone.Transport.start();
                }

                if (synthIndex == 1) {
                    synth1.volume.value = -12;
                    synth2.volume.value = -12;
                    Tone.Transport.scheduleRepeat(function(time) {
                        synth2.triggerAttackRelease(noteData[1].note, noteData[1].duration, time);
                    }, noteData[1].repetition);
                }

                if (synthIndex == 2) {
                    startFlag = false;
                    synth1.volume.value = -18;
                    synth2.volume.value = -18;
                    synth3.volume.value = -18;
                    Tone.Transport.scheduleRepeat(function(time) {
                        synth3.triggerAttackRelease(noteData[2].note, noteData[2].duration, time);
                    }, noteData[2].repetition);
                }
            }
        }

        tempIndex = tempIndex + 1
        if (tempIndex < $scope.echoes.length) {
            $timeout(doNextTimeout, nextTimeout * 1000);
        } else {
            $timeout(function() {
                $http.get(routeURL)
                .then(function(res) {
                    // console.log("getting a new trace");
                    // console.log(res.data);
                    $scope.echoes = res.data;
                    tempIndex = 0;
                    doNextTimeout();
                });
            }, nextTimeout * 1000);
        }
    }
 });
