var canvas = new fabric.Canvas('canvas');
canvas.setHeight(window.innerHeight);
canvas.setWidth(window.innerWidth);

window.addEventListener('resize', function(){
	canvas.setHeight(window.innerHeight);
	canvas.setWidth(window.innerWidth);
})

console.log("0");
OscNode();
console.log("1");
BufferNod('hihat-plain.wav', true);
console.log(JSON.stringify(canvas));
console.log("2");


canvas.on('object:selected', function(e){
	var activeObject = e.target;
	if (activeObject.get('type') === 'oscillator') {
		activeObject.set('wave', window.prompt("Please enter a type of wave", "sine"));

		activeObject.set('freq', window.prompt("Please enter a frequency", "200"));		
		activeObject.set('duration', window.prompt("Please enter a duration", "2"));
	} else if (activeObject.get('type') === 'buffer') {
		activeObject.set('url', window.prompt("Please enter an url to a wav sound", "hihat-plain.wav"));
		activeObject.set('loop', window.prompt("Please enter true if you want the sound to loop", "true"));		
	}
	
});

var ac = new AudioContext();
var buf;

function play(){
	
	var state = JSON.stringify(canvas);
	var stateObj = JSON.parse(state);
	
	console.log(stateObj.objects[0]);
		
	var i, nbr; 
	for (i = 0, nbr = stateObj.objects.length; i<nbr; i++){
		console.log(stateObj.objects[i].type);
		if (stateObj.objects[i].type === 'oscillator'){
			var osc = ac.createOscillator();
			osc.type = stateObj.objects[i].wave;
			osc.frequency = stateObj.objects[i].freq;
			osc.connect(ac.destination);
			osc.start(ac.currentTime);
			osc.stop(ac.currentTime + stateObj.objects[i].duration);
		} else if (stateObj.objects[i].type === 'buffer'){
			console.log(stateObj.objects[i].url);
			startb(stateObj.objects[i].url, stateObj.objects[i].loop);
		}
	}
}

function getData(url, loop) {
			  source = ac.createBufferSource();
			  var request = new XMLHttpRequest();

			  request.open('GET', url, true);

			  request.responseType = 'arraybuffer';


			  request.onload = function() {
			    var audioData = request.response;

			    ac.decodeAudioData(audioData, function(buffer) {
			        source.buffer = buffer;

			        source.connect(ac.destination);
			        source.loop = loop;
			      },

			      function(e){"Error with decoding audio data" + e.err});

			  }

			  request.send();
}
var source;
function startb(url, loop){
	getData(url, loop);
	source.start(0);
}



