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

function parse(canvasObjectArray, ite){
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
				parse(canvasObject.children, 1);
				break;
			case 'playNode':
				parsePlay(canvasObject);
				break;
			case 'sleepNode':
				parseSleep(canvasObject);
				break;
			case 'sampleNode':
				parseSample(canvasObject);
				break;
			case 'loop':
				parseLoop(canvasObject);
				break;
		}
		inspectedNodes.push(canvasObjectID);
		ite--;
		if (ite > 0){
			parse(canvasObjectArray, ite);
		}
		// var childNbr = canvasObject.children.length;
		// for (j=0; j < childNbr; j++){
		// 	parse(canvasObject.children);
		// }
	}
}

function parsePlay(canvasObject){
	var duration = parseInt(canvasObject.duration),
		wave = canvasObject.wave,
		freqValue = Math.pow(2, (canvasObject.note - 69)/12)*440,
		effects = canvasObject.effects,
		play = ac.createOscillator();

		play.type = wave;
		play.frequency.value = freqValue;

		//If the node has added effects
		//debugger
		if (effects[0] !== undefined){
			for (var i=0; i < effects.length; i++){
				var effect = connectEffect(effects[i]);	
				if (i === 0){
					play.connect(effect.input);
				} else {
					var prevEffect = connectEffect(effects[i-1]);
					prevEffect.connect(effect.input);
				}
				if (i === effects.length-1){
					effect.connect(ac.destination);
				}
			}
		} else {
			play.connect(ac.destination);
		}
	
		play.start();
		play.stop(ac.currentTime + duration);
		play.onended = function(){
			parse(canvasObject.children,1);
			
			console.log('next');
		}

}

function connectEffect(effect){
	switch (effect) {
		case 'tremolo':
			var tremolo = new tuna.Tremolo({
			    intensity: 0.3,    	//0 to 1
			    rate: 4,         		//0.001 to 8
			    stereoPhase: 0,    						//0 to 180
			    bypass: 0
			});
			return (tremolo);
			break;
		case 'wahwah':
			var wahwah = new tuna.WahWah({
			    automode: true,                						//true/false
			    baseFrequency: 0.5,            						//0 to 1
			    excursionOctaves: 3,           	//1 to 6
			    sweep: 0.2,                    						//0 to 1
			    resonance: 10,                	//1 to 100
			    sensitivity: 0.5,             	 					//-1 to 1
			    bypass: 0
			});
			return (wahwah);
		 	break;
		 	//Something wrong with next 2 effects - they block the sound
		case 'chorus':
			var chorus = new tuna.Chorus({
			    rate: 0.01,         //0.01 to 8+
			    feedback: 0.8,     					//0 to 1+
			    delay: 0.005,     	//0 to 1
			    bypass: 1          					//the value 1 starts the effect as bypassed, 0 or 1
			});
			return (chorus);
			break;
		case 'pingpong':
			var pingpong = new tuna.PingPongDelay({
			    wetLevel: 1, //0 to 1
			    feedback: 0.5, //0 to 1
			    delayTimeLeft: 500,//canvasObject.delay/2*1000, //1 to 10000 (milliseconds)
			    delayTimeRight: 500//canvasObject.delay/2*1000 //1 to 10000 (milliseconds)
			});
			return (pingpong);
			break;

	}
}

function parseSleep(canvasObject){
	//return [canvasObject.ID, canvasObject.type, canvasObject.parentNode, canvasObject.children, canvasObject.duration];
	//string += 'sleepNode:canvasObject.ID, canvasObject.type, canvasObject.parentNode, canvasObject.children, canvasObject.duration; ';
	ac.suspend();
	setTimeout(nextInstruction, canvasObject.duration * 1000);
	function nextInstruction() {
		ac.resume();
		parse(canvasObject.children,1);
	}
}

function parseSample(canvasObject){
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
			for (var i=0; i < effects.length; i++){
				var effect = connectEffect(effects[i]);	
				if (i === 0){
					source.connect(effect.input);
				} else {
					var prevEffect = connectEffect(effects[i-1]);
					prevEffect.connect(effect.input);
				}
				if (i === effects.length-1){
					effect.connect(ac.destination);
				}
			}
		} else {
			source.connect(ac.destination);
		}
	source.start(ac.currentTime);
	source.onended = function(){
			parse(canvasObject.children, 1);
			console.log('next');
		}
}

function parseEffect(canvasObject){
	if (canvasObject.parentType === 'startNode'){
		document.getElementById('node-name').innerHTML = "You haven't connected anything to the start node.";
 		return;
	} else {
		var effectType = canvasObject.effect;
		switch (effectType){
			case 'tremolo':
					var tremolo = new tuna.Tremolo({
					    intensity: canvasObject.intensity,    	//0 to 1
					    rate: canvasObject.rate,         		//0.001 to 8
					    stereoPhase: 0,    						//0 to 180
					    bypass: 0
					});
					tremolo.connect(ac.destination);
					console.log(tremolo.input);
					return (tremolo.input);
					break;
			case 'wahwah':
				var wahwah = new tuna.WahWah({
				    automode: true,                						//true/false
				    baseFrequency: 0.5,            						//0 to 1
				    excursionOctaves: canvasObject.octave,           	//1 to 6
				    sweep: 0.2,                    						//0 to 1
				    resonance: canvasObject.resonance,                	//1 to 100
				    sensitivity: 0.5,             	 					//-1 to 1
				    bypass: 0
				});
				wahwah.connect(ac.destination);
				return (wahwah.input);
			 	break;
			 	//Something wrong with next 2 effects - they block the sound
			case 'chorus':
				var chorus = new tuna.Chorus({
				    rate: canvasObject.rateCho,         //0.01 to 8+
				    feedback: 0.2,     					//0 to 1+
				    delay: canvasObject.delayCho,     	//0 to 1
				    bypass: 0          					//the value 1 starts the effect as bypassed, 0 or 1
				});
				return (chorus.input);
				break;
			case 'pingpong':
				var pingpong = new tuna.PingPongDelay({
				    wetLevel: 0.5, //0 to 1
				    feedback: 1, //0 to 1
				    delayTimeLeft: 100,//canvasObject.delay/2*1000, //1 to 10000 (milliseconds)
				    delayTimeRight: 200//canvasObject.delay/2*1000 //1 to 10000 (milliseconds)
				});
				return (pingpong.input);
				break;
		}
	}
}

function parseLoop(loopObject){
	//loop contains all the objects
	// for each object 
		// call the relevant parsing method
	var children = loopObject.children;
	var length = children.length, i;
	for (i = 0; i < length; i++){
		console.log('here');
		if (i!==0){
			children[i].parentNode = [children[i-1].ID];
		}
		console.log(children);
	for (var j = 0; j < 3; j++){
		parse(children, 3);
	}
		
	}
}


