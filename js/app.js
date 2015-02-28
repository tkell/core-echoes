var synth1 = new Tone.MonoSynth();
var synth2 = new Tone.MonoSynth();
var synth3 = new Tone.MonoSynth();

var tempo = 128;
var beatTime = 60 / 128;

synth1.setOscType('triangle');
synth2.setOscType('square');
synth3.setOscType('sine');

// More synth quality here

synth1.toMaster();
synth2.toMaster();
synth3.toMaster();

Tone.Transport.setInterval(function(time) {
    synth1.triggerAttackRelease("C4", 0.5, time);
}, 1);

Tone.Transport.setInterval(function(time){
    synth2.triggerAttackRelease("G4", 1.75, time);
}, 3);

Tone.Transport.setInterval(function(time){
    synth3.triggerAttackRelease("C5", 0.75, time);
}, 4);

//start the transport
Tone.Transport.start();