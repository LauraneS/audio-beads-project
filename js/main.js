var ac = new AudioContext(), buf, source;
var line, isMouseDown, isMouseOver, isShiftDown, center;

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

//Setting properties for all objects
fabric.Object.prototype.set({
    hasControls: false, hasBorders: false, selectable: true
});

fabric.Object.prototype.toObject = (function (toObject){
    return function(){
        return fabric.util.object.extend(toObject.call(this), {
            ID: this.ID,
            children: this.children,
            parentNode: this.parentNode,
            frequency: this.frequency,
            duration: this.duration,
            sample: this.sample
        });
    };
})(fabric.Object.prototype.toObject);

//fabric.Object.prototype.toObject([this.height, this.ID, this.left, this.text, this.top, this.type, this.width]);

//Canvas Initialisation 
var canvas = new fabric.Canvas('canvas');
canvas.setHeight(window.innerHeight -150);
canvas.setWidth(window.innerWidth -20);
canvas.selection = false;
canvas.hoverCursor = canvas.moveCursor ='pointer';
canvas.on({
    // 'object:moving': canvasChange,
    'object:added': canvasChange,
    'object:removed': canvasChange,
    'canvas:cleared' : canvasCleared
});

function canvasChange(){
    var state = JSON.parse(JSON.stringify(canvas));

    var i, nbr; 
    for (i = 0, nbr = state.objects.length; i<nbr; i++){
        console.log(state.objects[i].type);
        if (state.objects[i].type === 'playNode'){
            var osc = ac.createOscillator();
            osc.frequency = state.objects[i].frequency;
            osc.connect(ac.destination);
            osc.start(ac.currentTime);
            osc.stop(ac.currentTime + state.objects[i].duration);
        } else if (state.objects[i].type === 'sampleNode'){
            source = ac.createBufferSource();
            var request = new XMLHttpRequest();

            request.open('GET', state.objects[i].sample, true);
            

            request.responseType = 'arraybuffer';


            request.onload = function() {
                var audioData = request.response;

                ac.decodeAudioData(audioData, function(buffer) {
                    source.buffer = buffer;

                    source.connect(ac.destination);
                    source.loop = true;              
                },

                function(e){"Error with decoding audio data" + e.err});

            }
            console.log(state.objects[i].sample);
            request.send();
            source.start(0);
        }
    }

}

function canvasCleared(){
    ac.close();
    ac = new AudioContext();
}

window.addEventListener('resize', function(){
	canvas.setHeight(window.innerHeight - 150);
	canvas.setWidth(window.innerWidth - 20);
})

//Adding double click event listener (not supported by fabric.js)
window.addEventListener('dblclick', function (e, self) {
    var target = canvas.findTarget(e);
    if (target) {
       console.log('dblclick inside ' + target.type);
    }   
});


function createNode(arg){
    switch(arg){
        case 'play':
            PlayNode();
            break;
        case 'loop':
            LoopNode();
            break;
        case 'fx':
            EffectNode();
            break;
        case 'sample':
            SampleNode();
            break;
    }
}

//Function to draw a line
function makeLine(coords) {
    return new fabric.Line(coords, {
        stroke: 'black',
        selectable: false
    });
};

// ['object:moving'].forEach(clipToLoop);
// function clipToLoop(event){
//     canvas.on(event, function (options){
//         var object = options.target;
//         canvas.forEachObject(function (obj){
//             if (obj == object) return;
//             obj.setOpacity(options.target.intersectsWithObject(obj) ? 0.5 : 1);
//         });
//     });
// }

// canvas.on({
//     'object:moving': onMove,
    
//   });

//   function onMove(options) {
//     options.target.setCoords();
//     canvas.forEachObject(function(obj) {
//       if (obj === options.target) return;
//       if (options.target.intersectsWithObject(obj)){
//         if(obj.type === 'loop') {
//             var ta = (Math.floor((Math.random() * 360) + 1))*Math.PI/180;
//             options.target.set({left:obj.getCenterPoint().x + Math.cos(ta), top: obj.getCenterPoint().y + Math.sin(ta)});
//         }
//       } 
//     });
//   }

// Functions + Events to draw a line between objects by 'adding a child' to a clicked object
['object:moving'].forEach(addChildMoveLine);

function addChildLine(options) {
    canvas.off('object:selected', addChildLine);

    // add the line
    var fromObject = canvas.addChild.start;
    var toObject = options.target;
    var from = fromObject.getCenterPoint()
    var to = toObject.getCenterPoint();
    var coords = [from.x + fromObject.getWidth()/2, from.y, to.x - toObject.getWidth()/2, to.y];
    var line = makeLine(coords);
    canvas.add(line);
    fromObject.children.push(toObject.ID);
    toObject.parentNode.push(fromObject.ID);
    
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
                    line.set({ 'x1': objectCenter.x + object.getWidth()/2, 'y1': objectCenter.y });
                })
            if (object.addChild.to)
                object.addChild.to.forEach(function (line) {
                    line.set({ 'x2': objectCenter.x - object.getWidth()/2, 'y2': objectCenter.y });
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
        case 67: //C key down
            canvas.clear().renderAll();
            TempoNode();
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

function resetCanvas(){
    canvas.clear();
}

function canvasState(){
    var state = JSON.parse(JSON.stringify(canvas));
    console.log(state);
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

var dialog, form;
var note = $( "#note" );
var duration = $( "#duration" );
var allFields = $( [] ).add( note ).add( duration );

dialog = $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: false,
    buttons: {
        "Apply": console.log('applied'),
        Cancel: function() {
          dialog.dialog( "close" );
          console.log('closed');
        }
    },
    close: function() {
        form[ 0 ].reset();
        allFields.removeClass( "ui-state-error" );
    }
});

form = dialog.find( "form" ).on( "submit", function( event ) {
      event.preventDefault(); 
    });
function openDialog(){
    dialog.dialog( "open" );
}