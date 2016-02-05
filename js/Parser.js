function unflatten(canvasObjectArray) {
  		var tree = [],
      	lookup = {},
     	arrElem,
      	keyedElem; 

  // First map the nodes of the array to an object -> create a hash table.
  for(var i = 0, len = canvasObjectArray.length; i < len; i++) {
    arrElem = canvasObjectArray[i];
    lookup[arrElem.ID] = arrElem;
  }

  for (var ID in lookup) {
    if (lookup.hasOwnProperty(ID)) {
      keyedElem = lookup[ID];
      if (keyedElem.type !== 'line'){
	      var parents = keyedElem.parentNode;
	      var parentsNbr = parents.length, k;
	      for(k=0; k < parentsNbr; k++){
	      	if (keyedElem.parentNode[0] !== 0){
		        var parentNode = lookup[keyedElem.parentNode[0]];
		       	parentNode.children.push(keyedElem);
		      }
	      // If the element is at the root level, add it to first level elements array.
	     	 else {
	        	tree.push(keyedElem);
	      	}
	     }
	      
      } 
    }
  }
  return tree;
} 
function parse(canvasObjectArray){
	var length = canvasObjectArray.length, i, j;
	var inspectedNodes = [];

	for (i = 0; i<length; i++){
		var canvasObject = canvasObjectArray[i];
		var canvasObjectType = canvasObject.type;
		var canvasObjectID = canvasObject.ID;
		if (inspectedNodes.indexOf(canvasObjectID) > -1){
			console.log('this node has already been inspected');
		}
		switch(canvasObjectType){
			case 'playNode':
				parsePlay(canvasObject);
				break;
			case 'effectNode':
				parseEffect(canvasObject);
				break;
			case 'sleepNode':
				parseSleep(canvasObject);
				break;
			case 'sampleNode':
				parseSample(canvasObject);
				break;
			case 'loopNode':
				parseLoop(canvasObject);
				break;
		}
		inspectedNodes.push(canvasObjectID);
		var childNbr = canvasObject.children.length;
		for (j=0; j < childNbr; j++){
			parse(canvasObject.children);
		}
	}
}

// function parsePlay(canvasObject){
// 	var param = [{ID: canvasObject.ID, type: canvasObject.type, parentNode: canvasObject.parentNode, children: canvasObject.children, wave: canvasObject.wave, note: canvasObject.note, duration: canvasObject.duration, attack: canvasObject.attack, release: canvasObject.release}];
// 	console.log(param);
// 	return param;
// }
function connectChildren(canvasObject, children){
	var length = children.length, i;
	for (i = 0; i < length; i++){
		canvasObject.connect(children[i]);
	}
}

function parsePlay(canvasObject){
	var attack = canvasObject.attack,
		release = canvasObject.release,
		duration = parseInt(canvasObject.duration),
		wave = canvasObject.wave,
		freqValue = Math.pow(2, (canvasObject.note - 69)/12)*440,
		play = ac.createOscillator();
		//gain = ac.createGain();
	

		play.type = wave;
		play.frequency.value = freqValue;
		play.connect(ac.destination);
		//Likely not working
		// if (canvasObject.children.length == 0){
			play.connect(ac.destination)
		// } else{
		// 	connectChildren(play, canvasObject.children);
		// }
		play.start();
		play.stop(ac.currentTime + duration);
		play.onended = function(){
			parse(canvasObject.children);
			console.log('next');
		}

	
	//TODO: not proper ADSR envelope here
	// gain.gain.setValueAtTime(0, ac.currentTime);
	// gain.gain.linearRampToValueAtTime(1, ac.currentTime + attack);
	// gain.gain.linearRampToValueAtTime(0, ac.currentTime + duration);
	// play.start(ac.currentTime);
	// console.log('on');
}

function parseSleep(canvasObject){
	//return [canvasObject.ID, canvasObject.type, canvasObject.parentNode, canvasObject.children, canvasObject.duration];
	//string += 'sleepNode:canvasObject.ID, canvasObject.type, canvasObject.parentNode, canvasObject.children, canvasObject.duration; ';
	ac.suspend();
	setTimeout(nextInstruction, canvasObject.duration * 1000);
	function nextInstruction() {
		ac.resume();
		parse(canvasObject.children);
	}
}

function parseSample(canvasObject){
	//return [canvasObject.ID, canvasObject.type, canvasObject.parentNode, canvasObject.children, canvasObject.url, canvasObject.loop];
	var audioBuffer = null,
		source = null,
		loop = canvasObject.loop,
		url = canvasObject.url,
		children = canvasObject.children;
		console.log(url);

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
		source.start();
		source.loop = loop;
	}

	function stopSound(){
		source.stop;
	}

	loadSound(url);
	playSound(audioBuffer);
}

function parseEffect(canvasObject){
	var effectInfo =  [canvasObject.ID, canvasObject.type, canvasObject.parentNode, canvasObject.children, canvasObject.effect];
	var effecType = canvasObject.effect;
	switch (effectType){
		case 'echo':
			return effectInfo.concat([]);
			break;
		case 'reverb':
			return effectInfo.concat([canvasObject.roomSize, canvasObject.dampening]);
			break;
		case 'distortion':
			return effectInfo.concat([canvasObject.distortion, canvasObject.oversample]);
			break;
		case 'pingpong':
			return effectInfo.concat([canvasObject.delay]);
			break;
	}
}

function parseLoop(loopObjects){
	//loop contains all the objects
	// for each object 
		// call the relevant parsing method
}

