var ac = new AudioContext();
//var now = ac.currentTime;

// function MyCustomNode(){
//   this.input = audioContext.createGainNode();
//   var output = audioContext.createGainNode();
//   this.connect = function(target){
//      output.connect(target);
//   };
// }
function connectChildren(canvasObject, children){
	var length = children.length, i;
	for (i = 0; i < length; i++){
		canvasObject.connect(children[i]);
	}
}

function interpretPlay(playObject){
//[1]ID, [2]type, [3].parent, [4].children, [5].wave, [6].note, [7].duration, 
//[8].attack, [9].release]
	var attack = playObject[8],
		release = playObject[9],
		duration = playObject[7],
		wave = playObject[5],
		freqValue = Math.pow(2, (playObject[6] - 69)/12)*440,
		play = ac.createOscillator(),
		gain = ac.createGain();
	

		play.type = wave;
		play.frequency.value = freqValue;
		play.connect(gain);
		//Likely not working
		connectChildren(play, playObject[4]);

	
	//TODO: not proper ADSR envelope here
	gain.gain.setValueAtTime(0, now);
	gain.gain.linearRampToValueAtTime(1, now + attack);
	gain.gain.linearRampToValueAtTime(0, now + playObject[7])

}




function interpretSample(sampleObject){
	//1ID, 2type, 3parent, 4children, 5url, 6loop
	var audioBuffer = null,
		source = null,
		loop = sampleObject[6],
		url = sampleObject[5],
		children = sampleObject[4];

	function loadSound(url){
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			ac.decodeAudioData(request.response, function(buffer) {
		    	audioBuffer = buffer;
		    });
		}
		request.send();
	}

	function playSound(anybuffer) {
		source = ac.createBufferSource();
		source.buffer = anybuffer;
		source.connect(ac.destination);
		source.start(now);
		source.loop = loop;
	}

	function stopSound(){
		source.stop;
	}

	loadSound(url);
	playSound(audioBuffer);

}

function interpretSleep(sleepObject){

}