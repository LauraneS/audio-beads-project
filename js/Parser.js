//var string = '';
function parse(canvasObjectArray){
	var length = canvasObjectArray.length, i, j;
	var inspectedNodes = [];


	for (i = 0; i<length; i++){
		var canvasObject = canvasObjectArray[i];
		var canvasObjectType = canvasObject.type;
		var canvasObjectID = canvasObject.ID;
		if (inspectedNodes.indexOf(canvasObjectID) > -1) return;
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
		var children = canvasObject.children.length;
		for (j = 0; j < children; j++ ){
			
		}
	}
	//console.log(string);
}

function parsePlay(canvasObject){
	return [canvasObject.ID, canvasObject.type, canvasObject.parent, canvasObject.children, canvasObject.note, canvasObject.duration, canvasObject.attack, canvasObject.release];
	//string += 'playNode: canvasObject.ID, canvasObject.type, canvasObject.parent, canvasObject.children, canvasObject.note, canvasObject.duration, canvasObject.attack, canvasObject.release;';
}

function parseSleep(canvasObject){
	return [canvasObject.ID, canvasObject.type, canvasObject.parent, canvasObject.children, canvasObject.duration];
	//string += 'sleepNode:canvasObject.ID, canvasObject.type, canvasObject.parent, canvasObject.children, canvasObject.duration; ';
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

