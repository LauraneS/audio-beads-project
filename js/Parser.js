function parse(canvasObjectArray){
	var length = canvasObjectArray.length, i;
	var inspectedNodes = [];
	for (i = 0; i<length; i++){
		var canvasObject = canvasObjectArray[i];
		var canvasObjectType = canvasObject.type;
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
	}
}

function parsePlay(canvasObject){
	return [canvasObject.ID, canvasObject.type, canvasObject.parent, canvasObject.children, canvasObject.note, canvasObject.duration, canvasObject.attack, canvasObject.release];
}

function parseSleep(canvasObject){
	return [canvasObject.ID, canvasObject.type, canvasObject.parent, canvasObject.children, canvasObject.duration];
}

function parseSample(canvasObject){
	return [canvasObject.ID, canvasObject.type, canvasObject.parent, canvasObject.children, canvasObject.url, canvasObject.loop];

}

function parseEffect(canvasObject){
	var effectInfo =  [canvasObject.ID, canvasObject.type, canvasObject.parent, canvasObject.children, canvasObject.effect];
	var effecType = canvasObject.effect;
	switch (effectType){
		case 'echo':
			return effectInfo.concat([]);
			break;
		case 'reverb':
			return effectInfo.concat([]);
			break;
		case 'vibrato':
			return effectInfo.concat([]);
			break;
		case 'distortion':
			return effectInfo.concat([]);
			break;
		case 'pingpong':
			return effectInfo.concat([]);
			break;
	}
}

function parseLoop(loopObjects){
	//loop contains all the objects
	// for each object 
		// call the relevant parsing method
}

