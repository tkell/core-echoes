var synth1 = new Tone.MonoSynth();
var synth2 = new Tone.MonoSynth();
var synth3 = new Tone.MonoSynth();

var tempo = 128;
var beatTime = 60 / 128;

synth1.setOscType('triangle');
synth2.setOscType('square');
synth3.setOscType('sine');

// More synth quality here!

synth1.toMaster();
synth2.toMaster();
synth3.toMaster();


noteData = [{'note': 'C4', 'duration': 0.5, 'repetition':  beatTime / 4},
            {'note': 'G4', 'duration': 0.5, 'repetition':  beatTime},
            {'note': 'C5', 'duration': 0.5, 'repetition':  beatTime / 6}
        ]

Tone.Transport.setInterval(function(time) {
    synth1.triggerAttackRelease(noteData[0].note, noteData[0].duration, time);
}, noteData[0].repetition);

Tone.Transport.setInterval(function(time) {
    synth2.triggerAttackRelease(noteData[1].note, noteData[1].duration, time);
}, noteData[1].repetition);

Tone.Transport.setInterval(function(time) {
    synth1.triggerAttackRelease(noteData[2].note, noteData[2].duration, time);
}, noteData[2].repetition);

//start the transport
Tone.Transport.start();