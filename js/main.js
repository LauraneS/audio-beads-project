var ac = new AudioContext(), buf, source;
var line, isMouseDown, isMouseOver, isShiftDown, center;


//Canvas Initialisation 
var canvas = new fabric.Canvas('canvas');
canvas.setHeight(window.innerHeight);
canvas.setWidth(window.innerWidth);

window.addEventListener('resize', function(){
	canvas.setHeight(window.innerHeight);
	canvas.setWidth(window.innerWidth);
})

//Function to draw a line
function makeLine(coords) {
    return new fabric.Line(coords, {
        fill: '',
        stroke: 'black',
        selectable: false
    });
}

// Functions + Events to draw a line between objects by 'adding a child' to a clicked object
['object:moving', 'object:scaling'].forEach(addChildMoveLine);

function addChildLine(options) {
    canvas.off('object:selected', addChildLine);

    // add the line
    var fromObject = canvas.addChild.start;
    var toObject = options.target;
    var from = fromObject.getCenterPoint();
    var to = toObject.getCenterPoint();
    var coords = [from.x, from.y, to.x, to.y];
    var line = makeLine(coords);
    canvas.add(line);
    // so that the line is behind the connected shapes
    line.sendToBack();

    // add a reference to the line to each object
    fromObject.addChild = {
        // this retains the existing arrays (if there were any)
        from: (fromObject.addChild && fromObject.addChild.from) || [],
        to: (fromObject.addChild && fromObject.addChild.to)
    }
    fromObject.addChild.from.push(line);
    toObject.addChild = {
        from: (toObject.addChild && toObject.addChild.from),
        to: (toObject.addChild && toObject.addChild.to) || []
    }
    toObject.addChild.to.push(line);

    // to remove line references when the line gets removed
    line.addChildRemove = function () {
        fromObject.addChild.from.forEach(function(e, i, arr) {
            if (e === line)
                arr.splice(i, 1);
        });
        toObject.addChild.to.forEach(function (e, i, arr) {
            if (e === line)
                arr.splice(i, 1);
        });
    }

    // undefined instead of delete since we are anyway going to do this many times
    canvas.addChild = undefined;
}

function addChildMoveLine(event) {
    canvas.on(event, function (options) {
        var object = options.target;
        var objectCenter = object.getCenterPoint();
        // udpate lines (if any)
        if (object.addChild) {
            if (object.addChild.from)
                object.addChild.from.forEach(function (line) {
                    line.set({ 'x1': objectCenter.x, 'y1': objectCenter.y });
                })
            if (object.addChild.to)
                object.addChild.to.forEach(function (line) {
                    line.set({ 'x2': objectCenter.x, 'y2': objectCenter.y });
                })
        }

        canvas.renderAll();
    });
}

window.addChild = function () {
    canvas.addChild = {
        start: canvas.getActiveObject()
    }

    // for when addChild is clicked twice
    canvas.off('object:selected', addChildLine);
    canvas.on('object:selected', addChildLine);
}


// canvas.on('mouse:down', function(v){
// 	isMouseDown = true;
//   	if (isShiftDown && isMouseOver){
// 	  	//var pointer = canvas.getPointer(v.e)
// 		//var points = [pointer.x, pointer.y, pointer.x, pointer.y]
// 		var points = [center.x, center.y, center.x, center.y]
// 		line = new fabric.Line(points, {
// 			stroke: 'black',
// 		    selectable: false,
// 		    originX: 'center', 
// 		    originY: 'center'
// 		});
// 		canvas.add(line);
// 	}  
// });

// canvas.on('mouse:move', function(v){
// 	if (!isMouseDown) return;
// 	if (isShiftDown && isMouseOver) {
// 		//var pointer = canvas.getPointer(v.e);
// 		line.set({x2: center.x, y2: center.y});
// 		canvas.renderAll();	
// 	}
// });

// canvas.on('mouse:up', function(v){
// 	isMouseDown = false;
// });

// canvas.on('mouse:over', function(e) {
// 	isMouseOver = true;
//     center = e.target.getCenterPoint();
//     console.log(center);
//   });

// function onObjectMoving(e){
// 	canvas.renderAll();
// }

// If Shift key down and mouse over object, user prompted to set parameters for said object
canvas.on('mouse:over', function(e){
	if(isShiftDown){
		var activeObject = e.target;
		setParameters(activeObject);
	}
});

function setParameters(obj) {
	var key = '' + window.prompt("What parameter would you like to set?", "freq");
	var value = window.prompt("Set a value for that parameter");
	obj.set(key,value);
}

//Functions to link keydown events to various functions 
document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 16:  // Shift key down
            isShiftDown = true;
        break;
        case 83: 
        	canvas.forEachObject(function(obj){
        		obj.set({selectable: true});
        	});
        break;
      }
}

document.onkeyup = function(e) {
	switch (e.keyCode) {
		case 16: //Shift key released
			isShiftDown = false;
		break;
	}
}


//Code to generate the web audio api code
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

function startb(url, loop){
	getData(url, loop);
	source.start(0);
}


//Code to add node to the canvas manually 
TempoNode();
LoopNode();
animateBead(bead, dur);
console.log(dur);

// OscNode();
// BufferNod('hihat-plain.wav', true);

