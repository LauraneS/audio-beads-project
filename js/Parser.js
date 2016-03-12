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

function parse(canvasObjectArray, t){
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
			case 'startNode':
				parse(canvasObject.children, t);
				break;
			case 'playNode':
				parsePlay(canvasObject, t);
				break;
			case 'sleepNode':
				parseSleep(canvasObject, t);
				break;
			case 'sampleNode':
				parseSample(canvasObject, t);
				break;
			case 'loop':
				parseLoop(canvasObject, t);
				break;
		}
		inspectedNodes.push(canvasObjectID);
		// var childNbr = canvasObject.children.length;
		// for (j=0; j < childNbr; j++){
		// 	parse(canvasObject.children);
		// }
	}
}

function parsePlay(canvasObject, t){
	var duration = parseInt(canvasObject.duration),
		wave = canvasObject.wave,
		freqValue = Math.pow(2, (canvasObject.note - 69)/12)*440,
		effects = canvasObject.effects,
		play = ac.createOscillator();

		play.type = wave;
		play.frequency.value = freqValue;

		//If the node has added effects
		
		if (effects[0] !== undefined){
			var prevEffect;
			for (var i=0; i < effects.length; i++){
				var effect = connectEffect(effects[i]);	
				if (i === 0){
					play.connect(effect.input);
				} else {
					// var prevEffect = connectEffect(effects[i-1]);
					prevEffect.connect(effect.input);
				}
				if (i === effects.length-1){
					effect.connect(ac.destination);
				}
				prevEffect = effect;
			}
		} else {
			play.connect(ac.destination);
		}
		if (t !== undefined){
			play.start(ac.currentTime + t);
			play.stop(ac.currentTime + t + duration);
		} else {
			play.start(ac.currentTime);
			play.stop(ac.currentTime + duration);	
		}
		
		play.onended = function(){
			parse(canvasObject.children);
		}

}

function connectEffect(effect){
	switch (effect) {
		case 'tremolo':
			return new tuna.Tremolo({
			    intensity: 0.3,    	//0 to 1
			    rate: 4,         		//0.001 to 8
			    stereoPhase: 0,    						//0 to 180
			    bypass: 0
			});
			//return (tremolo);
			break;
		case 'wahwah':
			return new tuna.WahWah({
			    automode: true,                						//true/false
			    baseFrequency: 0.5,            						//0 to 1
			    excursionOctaves: 3,           	//1 to 6
			    sweep: 0.2,                    						//0 to 1
			    resonance: 10,                	//1 to 100
			    sensitivity: 0.5,             	 					//-1 to 1
			    bypass: 0
			});
		 	break;
		 	//Something wrong with next 2 effects - they block the sound
		case 'chorus':
			return new tuna.Chorus({
			    rate: 0.01,         //0.01 to 8+
			    feedback: 0.8,     					//0 to 1+
			    delay: 0.005,     	//0 to 1
			    bypass: 1          					//the value 1 starts the effect as bypassed, 0 or 1
			});
			break;
		case 'pingpong':
			return new tuna.PingPongDelay({
			    wetLevel: 1, //0 to 1
			    feedback: 0.5, //0 to 1
			    delayTimeLeft: 500,//canvasObject.delay/2*1000, //1 to 10000 (milliseconds)
			    delayTimeRight: 500//canvasObject.delay/2*1000 //1 to 10000 (milliseconds)
			});
			break;

	}
}

function parseSleep(canvasObject, t){
	var tt = parseInt(canvasObject.duration);
	console.log(tt);
	parse(canvasObject.children, tt);
}

function parseSample(canvasObject, t){
	var source = ac.createBufferSource();
	effects = canvasObject.effects;
	switch (canvasObject.sample){
		case 'hihat':
			source.buffer = bList[0];
			break;
		case 'drum-kick':
			source.buffer = bList[1];
			break;
		case 'alien':
			source.buffer = bList[2];
			break;
		case 'beat':
			source.buffer = bList[3];
			break;
		case 'bass':
			source.buffer = bList[4];
			break;
		case 'flute':
			source.buffer = bList[5];
			break;
	}
	source.loop = canvasObject.loop;

	if (effects[0] !== undefined){
		var prevEffect;
			for (var i=0; i < effects.length; i++){
				var effect = connectEffect(effects[i]);	
				if (i === 0){
					source.connect(effect.input);
				} else {
					//var prevEffect = connectEffect(effects[i-1]);
					prevEffect.connect(effect.input);
				}
				if (i === effects.length-1){
					effect.connect(ac.destination);
				}
				prevEffect = effect;
			}
		} else {
			source.connect(ac.destination);
		}
	if (t !== undefined){
		source.start(ac.currentTime + t);
	} else {
		source.start(ac.currentTime);
	}
	source.onended = function(){
			parse(canvasObject.children);
			console.log('next');
		}
}

function parseLoop(loopObject){
	//loop contains all the objects
	// for each object 
		// call the relevant parsing method
	loopObject.sortChildren(loopObject.children);

}


