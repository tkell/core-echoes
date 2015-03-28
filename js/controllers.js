var coreEchoesApp = angular.module('coreEchoesApp', []);

var testRoute = [
    {'ip': '10.22.12.1', 'text': '10.22.12.1 19.811 ms  25.416 ms  28.152 ms'}, 
    {'ip': '74.201.254.125', 'text': 'border2.ge4-28.spotify-3.nyj001.pnap.net 28.161 ms  28.119 ms  28.123 ms'}, 
    {'ip': '216.52.95.88', 'text':  'core1.te6-2-bbnet2.nym007.pnap.net 64.714 ms  64.668 ms  64.676 ms'},
    {'ip': '207.239.87.93', 'text': '207.239.87.93 44.890 ms  28.026 ms  50.806 ms'}, 
    {'ip': '216.156.0.17', 'text': 'vb1010.rar3.nyc-ny.us.xo.net  64.591 ms  64.578 ms  64.562 ms'}, 
    {'ip': '207.88.14.178', 'text': '207.88.14.178.ptr.us.xo.net 27.895 ms  12.237 ms  3.546 ms'},
    {'ip': '154.54.11.189', 'text': 'te0-0-0-4.ccr21.jfk05.atlas.cogentco.com   11.343 ms  11.294 ms  11.239 ms'}, 
    {'ip': '154.54.31.9', 'text': 'be2060.ccr41.jfk02.atlas.cogentco.com 11.188 ms  11.129 ms  5.606 ms'}, 
    {'ip': '154.54.80.162', 'text': 'be2518.mpd21.dca01.atlas.cogentco.com 11.150 ms be2148.ccr21.dca01.atlas.cogentco.com (154.54.31.117)  11.126 ms be2518.mpd21.dca01.atlas.cogentco.com (154.54.80.162)  11.059 ms'},
    {'ip': '154.54.31.97', 'text': 'be2169.ccr42.atl01.atlas.cogentco.com 27.448 ms be2170.ccr41.atl01.atlas.cogentco.com (154.54.31.105)  27.426 ms be2169.ccr42.atl01.atlas.cogentco.com (154.54.31.97)  27.341 ms'}, 
    {'ip': '154.54.29.18', 'text': 'be2172.ccr21.iah01.atlas.cogentco.com 41.541 ms be2173.ccr22.iah01.atlas.cogentco.com (154.54.29.118)  37.263 ms be2172.ccr21.iah01.atlas.cogentco.com (154.54.29.18)  45.683 ms'}, 
    {'ip': '154.54.5.66', 'text': 'be2065.ccr21.lax01.atlas.cogentco.com 73.413 ms be2066.ccr22.lax01.atlas.cogentco.com (154.54.7.54)  71.180 ms  79.183 ms'},
    {'ip': '154.54.28.146', 'text': 'te8-1.mag01.lax01.atlas.cogentco.com 75.321 ms te7-1.mag02.lax01.atlas.cogentco.com (154.54.47.166)  72.894 ms  72.796 ms'}, 
    {'ip': '154.24.22.122', 'text': 'te0-0-2-2.nr11.b001202-4.lax01.atlas.cogentco.com 72.832 ms  72.830 ms te0-0-2-1.nr11.b001202-4.lax01.atlas.cogentco.com (154.24.22.126)  72.780 ms'}, 
    {'ip': '38.122.20.218', 'text': '38.122.20.218 72.709 ms  76.311 ms  76.211 ms'},
    {'ip': '69.163.188.170', 'text': 'ip-69-163-188-170.dreamhost.com 76.194 ms ip-69-163-188-168.dreamhost.com (69.163.188.168)  73.629 ms ip-69-163-188-170.dreamhost.com (69.163.188.170)  76.145 ms'}, 
    {'ip': '69.163.188.139', 'text': 'ip-69-163-188-139.dreamhost.com 76.147 ms  76.100 ms ip-69-163-188-137.dreamhost.com (69.163.188.137)  76.041 ms'}
]


function setUpSynths() {
    var synth1 = new Tone.MonoSynth();
    var synth2 = new Tone.MonoSynth();
    var synth3 = new Tone.MonoSynth();

    synth1.oscillator.type = 'sine';
    synth2.oscillator.type = 'sine';
    synth3.oscillator.type = 'sine';

    var chorus1 = new Tone.Chorus();
    var delay2 = new Tone.PingPongDelay();
		delay2.feedback.value = 0.6
    var chorus3 = new Tone.Chorus(depth=0.1, rate=0.66);
    chorus3.output.gain.value = 0.5

    synth1.output.gain.value = 0.1;
    synth2.output.gain.value = 0.1;
    synth3.output.gain.value = 0.1;

    synth1.connect(chorus1); chorus1.toMaster();
    synth2.connect(delay2); delay2.toMaster();
    synth3.connect(chorus3); chorus3.toMaster();

		return [synth1, synth2, synth3];
}

coreEchoesApp.controller('echoController', function ($scope, $timeout) {
    $scope.echoes = testRoute;
    $scope.showText = "co.re.echo.es";

    $scope.startTimeout = function() {
        doNextTimeout();
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

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    var getRGB = function(ipArray) {
        ipString = ipArray[0] + ipArray[1] + ipArray[2] + ipArray[3];
        ipString = ipString.replace('.', '');
        console.log(ipString);
        var r = parseInt(ipString.slice(0, 4)) % 255;
        var g = parseInt(ipString.slice(5, 8)) % 255;
        var b = parseInt(ipString.slice(9, 12)) % 255;
        return rgbToHex(r, g, b)
    }

    var doNextTimeout = function() {
        var currentIP = $scope.echoes[tempIndex].ip;
        $scope.showText = $scope.echoes[tempIndex].text;
        $scope.showDetails = currentIP;
        var synthIndex = tempIndex % 3;
        currentIP = currentIP.split('.');
        currentIP = padIPs(currentIP);

        console.log(getRGB(currentIP));
        $scope.ipStyle = {
            'background-color': getRGB(currentIP)
        };

        var pitchProb = getProbabilties(currentIP[0]);
        var pitches = getPitches(currentIP.slice(1, 4));
        noteData[synthIndex].note = choose(pitchProb, pitches);

        var rhythmProb = getProbabilties(currentIP[1]);
        var rhythms = getRhythms([currentIP[0]].concat(currentIP.slice(2, 4)))
        noteData[synthIndex].repetition = choose(rhythmProb, rhythms) / 2; 

        var durationProb = getProbabilties(currentIP[2]);
        var durations = getDurations(currentIP.slice(0, 2).concat(currentIP[3]));
        noteData[synthIndex].duration = noteData[synthIndex].repetition / 2; 

        var timeoutProb = getProbabilties(currentIP[3]);
        var timeouts = getTimeouts(currentIP.slice(0, 3));
        var nextTimeout = choose(timeoutProb, timeouts) / 2; 

        console.log(currentIP, synthIndex, noteData[synthIndex], nextTimeout)

        if (startFlag == true) {
            if (synthIndex == 0) {  
                console.log("Starting");
                $scope.isPlaying = true;
                synth1.output.gain.value = 0.3;
                Tone.Transport.setInterval(function(time) {
                    synth1.triggerAttackRelease(noteData[0].note, noteData[0].duration, time);
                }, noteData[0].repetition);
                Tone.Transport.start();
            }

            if (synthIndex == 1) {  
                synth1.output.gain.value = 0.15;
                synth2.output.gain.value = 0.15;
                Tone.Transport.setInterval(function(time) {
                    synth2.triggerAttackRelease(noteData[1].note, noteData[1].duration, time);
                }, noteData[1].repetition);
            }

            if (synthIndex == 2) {  
                startFlag = false;
                synth1.output.gain.value = 0.1;
                synth2.output.gain.value = 0.1;
                synth3.output.gain.value = 0.1;
                Tone.Transport.setInterval(function(time) {
                    synth3.triggerAttackRelease(noteData[2].note, noteData[2].duration, time);
                }, noteData[2].repetition);
            }
        }
        
        tempIndex = tempIndex + 1
        if (tempIndex < $scope.echoes.length) {
            $timeout(doNextTimeout, nextTimeout * 1000);
        } else {
            $timeout(function() {Tone.Transport.stop()}, nextTimeout * 1000);
            console.log("stopping soon!");
        }
    }
 });
