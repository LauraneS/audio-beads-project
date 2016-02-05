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
	console.log("we are parsing");
	var length = canvasObjectArray.length, i, j;
	console.log(length);
	var inspectedNodes = [];

	for (i = 0; i<length; i++){
		var canvasObject = canvasObjectArray[i];
		var canvasObjectType = canvasObject.type;
		console.log(canvasObjectType);
		var canvasObjectID = canvasObject.ID;
		if (inspectedNodes.indexOf(canvasObjectID) > -1){
			console.log('this node has already been inspected');
		}
		switch(canvasObjectType){
			case 'playNode':
				parsePlay(canvasObject);
				console.log('play');
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
		console.log(inspectedNodes);
		console.log(canvasObject.children);
		var childNbr = canvasObject.children.length;
		for (j=0; j < childNbr; j++){
			parse(canvasObject.children);
		}
	}
}

function parsePlay(canvasObject){
	return [canvasObject.ID, canvasObject.type, canvasObject.parent, canvasObject.children, canvasObject.wave, canvasObject.note, canvasObject.duration, canvasObject.attack, canvasObject.release];
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

