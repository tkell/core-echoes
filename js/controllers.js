var coreEchoesApp = angular.module('coreEchoesApp', []);

var testRoute = [
    {'ip': '10.22.12.1', 'line_text': '10.22.12.1 19.811 ms  25.416 ms  28.152 ms'}, 
    {'ip': '74.201.254.125', 'line_text': 'border2.ge4-28.spotify-3.nyj001.pnap.net 28.161 ms  28.119 ms  28.123 ms'}, 
    {'ip': '216.52.95.88', 'line_text':  'core1.te6-2-bbnet2.nym007.pnap.net 64.714 ms  64.668 ms  64.676 ms'},
    {'ip': '207.239.87.93', 'line_text': '207.239.87.93 44.890 ms  28.026 ms  50.806 ms'}, 
    {'ip': '216.156.0.17', 'line_text': 'vb1010.rar3.nyc-ny.us.xo.net  64.591 ms  64.578 ms  64.562 ms'}, 
    {'ip': '207.88.14.178', 'line_text': '207.88.14.178.ptr.us.xo.net 27.895 ms  12.237 ms  3.546 ms'},
    {'ip': '154.54.11.189', 'line_text': 'te0-0-0-4.ccr21.jfk05.atlas.cogentco.com   11.343 ms  11.294 ms  11.239 ms'}, 
    {'ip': '154.54.31.9', 'line_text': 'be2060.ccr41.jfk02.atlas.cogentco.com 11.188 ms  11.129 ms  5.606 ms'}, 
    {'ip': '154.54.80.162', 'line_text': 'be2518.mpd21.dca01.atlas.cogentco.com 11.150 ms be2148.ccr21.dca01.atlas.cogentco.com (154.54.31.117)  11.126 ms be2518.mpd21.dca01.atlas.cogentco.com (154.54.80.162)  11.059 ms'},
    {'ip': '154.54.31.97', 'line_text': 'be2169.ccr42.atl01.atlas.cogentco.com 27.448 ms be2170.ccr41.atl01.atlas.cogentco.com (154.54.31.105)  27.426 ms be2169.ccr42.atl01.atlas.cogentco.com (154.54.31.97)  27.341 ms'}, 
    {'ip': '154.54.29.18', 'line_text': 'be2172.ccr21.iah01.atlas.cogentco.com 41.541 ms be2173.ccr22.iah01.atlas.cogentco.com (154.54.29.118)  37.263 ms be2172.ccr21.iah01.atlas.cogentco.com (154.54.29.18)  45.683 ms'}, 
    {'ip': '154.54.5.66', 'line_text': 'be2065.ccr21.lax01.atlas.cogentco.com 73.413 ms be2066.ccr22.lax01.atlas.cogentco.com (154.54.7.54)  71.180 ms  79.183 ms'},
    {'ip': '154.54.28.146', 'line_text': 'te8-1.mag01.lax01.atlas.cogentco.com 75.321 ms te7-1.mag02.lax01.atlas.cogentco.com (154.54.47.166)  72.894 ms  72.796 ms'}, 
    {'ip': '154.24.22.122', 'line_text': 'te0-0-2-2.nr11.b001202-4.lax01.atlas.cogentco.com 72.832 ms  72.830 ms te0-0-2-1.nr11.b001202-4.lax01.atlas.cogentco.com (154.24.22.126)  72.780 ms'}, 
    {'ip': '38.122.20.218', 'line_text': '38.122.20.218 72.709 ms  76.311 ms  76.211 ms'},
    {'ip': '69.163.188.170', 'line_text': 'ip-69-163-188-170.dreamhost.com 76.194 ms ip-69-163-188-168.dreamhost.com (69.163.188.168)  73.629 ms ip-69-163-188-170.dreamhost.com (69.163.188.170)  76.145 ms'}, 
    {'ip': '69.163.188.139', 'line_text': 'ip-69-163-188-139.dreamhost.com 76.147 ms  76.100 ms ip-69-163-188-137.dreamhost.com (69.163.188.137)  76.041 ms'}
]

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

    synth1.output.gain.value = 0.1;
    synth2.output.gain.value = 0.1;
    synth3.output.gain.value = 0.1;

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
        var currentIP = $scope.echoes[tempIndex].ip;
        $scope.showText = $scope.echoes[tempIndex].line_text;
        $scope.showDetails = currentIP;
        var synthIndex = tempIndex % 3;
        currentIP = currentIP.split('.');
        currentIP = ipUtils.pad(currentIP);

        var pitchProb = ipUtils.getProb(currentIP[0]);
        var pitches = mapper.getPitches(currentIP.slice(1, 4));
        noteData[synthIndex].note = ipUtils.choose(pitchProb, pitches);

        var rhythmProb = ipUtils.getProb(currentIP[1]);
        var rhythms = mapper.getRhythms([currentIP[0]].concat(currentIP.slice(2, 4)))
        noteData[synthIndex].repetition = ipUtils.choose(rhythmProb, rhythms) / 2; 

        var durationProb = ipUtils.getProb(currentIP[2]);
        var durations = mapper.getDurations(currentIP.slice(0, 2).concat(currentIP[3]));
        noteData[synthIndex].duration = noteData[synthIndex].repetition / 2; 

        var nextTimeout = mapper.getTimeouts(currentIP.slice(0, 3)) / 4;

        // console.log(currentIP, synthIndex, noteData[synthIndex], nextTimeout)
        if (startFlag == true) {
            if (synthIndex == 0) {  
                $scope.isPlaying = true;
                synth1.output.gain.value = 0.03;
                Tone.Transport.setInterval(function(time) {
                    synth1.triggerAttackRelease(noteData[0].note, noteData[0].duration, time);
                }, noteData[0].repetition);
                Tone.Transport.start();
            }

            if (synthIndex == 1) {  
                synth1.output.gain.value = 0.015;
                synth2.output.gain.value = 0.015;
                Tone.Transport.setInterval(function(time) {
                    synth2.triggerAttackRelease(noteData[1].note, noteData[1].duration, time);
                }, noteData[1].repetition);
            }

            if (synthIndex == 2) {  
                startFlag = false;
                synth1.output.gain.value = 0.01;
                synth2.output.gain.value = 0.01;
                synth3.output.gain.value = 0.01;
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
        }
    }
 });
