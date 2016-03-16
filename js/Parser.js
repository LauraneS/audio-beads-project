var doneThreads, threads;
function setButton() {
	var button = document.getElementById("playBtn");
	button.src="/png/playBtn.png";
    button.title = "play";
    smtgChanged = false;
}

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
	      		if (keyedElem.type !== 'loop' && keyedElem.type !== 'startNode' && keyedElem.intersected){
	      			var loopParentNode = lookup[keyedElem.loopParent];
	      			loopParentNode.loopChildren.push(keyedElem);
	      		}
		    	var parents = keyedElem.parentNode;
		      	var parentsNbr = parents.length, k;
		      	for(k=0; k < parentsNbr; k++){
		      		if (keyedElem.parentNode[0] !== 0){
		      			var parentNode = lookup[keyedElem.parentNode[0]];
		      			console.log(parentNode.type);
		      			if (parentNode.type !== 'condition'){
			       			parentNode.children.push(keyedElem);
		      			} else {
		      				if (keyedElem.parentType === 'left' ){
			       				parentNode.leftChildren.push(keyedElem);
			       			} else {
		      					parentNode.rightChildren.push(keyedElem);
		      				}
		      			}	
			      	}
		      		// If the element is at the root level (so their parent is equal to O), add it to first level elements array.
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
				parseStart(canvasObject, t);
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
			case 'condition':
				parseCond(canvasObject, t);
				break;
		}
		inspectedNodes.push(canvasObjectID);
	}
}

function parseStart(canvasObject, t){
	if (canvasObject.children[0] === undefined){
		displayNothing();
		document.getElementById("node-name").style.color = 'red';
		document.getElementById("node-name").innerHTML = "No hearing anything? <br> <br> Have you connected something to the startNode?";
		setButton();
	} else {
		threads = canvasObject.children.length;
		console.log(threads);
		doneThreads = 0;
		parse(canvasObject.children, t);
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
			if (canvasObject.children[0] === undefined){
				doneThreads++;
				if (doneThreads === threads) {
					setButton();
				}
			} else {
				parse(canvasObject.children);
			}
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
		if (canvasObject.children[0] === undefined){
			doneThreads++;
			if (doneThreads === threads) {
				setButton();
			}
		} else {
			parse(canvasObject.children);
		}		
	}
}

function parseLoop(loopObject){
	console.log(loopObject.iteration);
	//Sort children in clockwise order
	var loopChildren = loopObject.loopChildren;
	var length = loopChildren.length;
	loopChildren.sort(function (a, b) {
        if (a.loopPos > b.loopPos) {
          return 1;
        }
        if (a.loopPos < b.loopPos) {
          return -1;
        }
        return 0;
      });	

	// for each object 
		// call the relevant parsing method
	var t = 0;
	if (loopObject.iteration === '-- select an option --'){
		displayNothing();
		document.getElementById("node-name").style.color = 'red';
		document.getElementById("node-name").innerHTML = "Ooops! You forgot to specify a parameter for one of your loops...";
	} else if (loopObject.iteration === 'forever'){
			window.setInterval(function(){
				for (var k=0; k < length; k++){
					switch(loopChildren[k].type){
						case 'playNode':
							parsePlayLoop(loopChildren[k], t);
							t += parseInt(loopChildren[k].duration);
							break;
						case 'sleepNode':
							t += parseInt(loopChildren[k].duration)
							break;
						case 'sampleNode':
							var tt = parseSampleLoop(loopChildren[k], t);
							t += tt;
							break;
					}
				}
			}, 0);
	} else {
		for (var j = 0; j < parseInt(loopObject.x); j++){
			for (var k=0; k < length; k++){
				switch(loopChildren[k].type){
					case 'playNode':
						parsePlayLoop(loopChildren[k], t);
						t += parseInt(loopChildren[k].duration);
						break;
					case 'sleepNode':
						t += parseInt(loopChildren[k].duration)
						break;
					case 'sampleNode':
						var tt = parseSampleLoop(loopChildren[k], t);
						t += tt;
						break;
				}
			}
		}
		if (loopObject.children[0] === undefined){
			doneThreads++;
			if (doneThreads === threads) {
				setButton();
			}
		} else {
				parse(loopObject.children, t);
		}
	}
}

function parsePlayLoop(canvasObject, t){
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
}

function parseSampleLoop(canvasObject, t){
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
	return source.buffer.duration;
}

function parseCond(canvasObject, t){
	var cond = canvasObject.condition;
	switch (cond){
		case 'mouse':
			if(canvasObject.mouse === 'up'){
				if (!isDown){
					parse(canvasObject.leftChildren, t);
				} else {
					parse(canvasObject.rightChildren, t);
				}
			} else if (canvasObject.mouse === 'down'){
				if (isDown){
					parse(canvasObject.leftChildren, t);
				} else {
					parse(canvasObject.rightChildren, t);
				}
			} else {
				displayNothing();
				document.getElementById("node-name").style.color = 'red';
				document.getElementById("node-name").innerHTML = "Double check the parameters for your conditions.";
			}
			break;
		case 'key':
			if (parseInt(canvasObject.key) === keyDown){
				parse(canvasObject.leftChildren, t);
			} else {
				parse(canvasObject.rightChildren, t);
			}
			break;
		case 'rand':
			var n = Math.floor(Math.random() * (parseInt(canvasObject.rand[1]) - parseInt(canvasObject.rand[0]) + 1) + parseInt(canvasObject.rand[0]));
			console.log(n);
			var c = parseInt(canvasObject.rand[3]);
			console.log(c);
			switch(canvasObject.rand[2]){
				case 'more':
					if (n > c){
						parse(canvasObject.leftChildren, t);
					} else {
						parse(canvasObject.rightChildren, t);
					}
					break;
				case 'less':
					if (n < c){
						parse(canvasObject.leftChildren, t);
					} else {
						parse(canvasObject.rightChildren, t);
					}
					break;
				case 'eq':
					if (n = c){
						parse(canvasObject.leftChildren, t);
					} else {
						parse(canvasObject.rightChildren, t);
					}
			}		break;
			break;
	}
}


