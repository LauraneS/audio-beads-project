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
            note: this.note,
            duration: this.duration,
            sample: this.sample,
            wave: this.wave,
            attack: this.attack,
            release: this.release

        });
    };
})(fabric.Object.prototype.toObject);



//fabric.Object.prototype.toObject([this.height, this.ID, this.left, this.text, this.top, this.type, this.width]);

//Canvas Initialisation 
var canvas = new fabric.Canvas('canvas');
canvas.setHeight(window.innerHeight -150);
canvas.setWidth(window.innerWidth*0.80 -20);
canvas.selection = false;
canvas.hoverCursor = canvas.moveCursor ='pointer';
// canvas.on({
//     'object:added': canvasChange,
//     'object:removed': canvasChange,
//     'canvas:cleared' : canvasCleared
// });

canvas.on('object:selected', function(e){
    var activeObjectType = e.target.type;
    if (activeObjectType === 'effectNode'){
         document.getElementById('node-name').innerHTML = "This is an "+ activeObjectType;
    } else {
         document.getElementById('node-name').innerHTML = "This is a "+ activeObjectType;
    }
   
});
var pointer, oX, oY, tX, tY;
$('canvas').mousedown(function() {
        pointer = canvas.getPointer(event.e);
        isMouseDown = true;
        //var pointer = canvas.getPointer(event.e);
        //oX = pointer.x;
        //oY = pointer.y; 
        console.log('we are down');
        var line = makeLine([pointer.x, pointer.y, pointer.x, pointer.y]);
        canvas.add(line);
        $('canvas').mousemove(function(){
            if (isMouseDown){
                var pm = canvas.getPointer(event.e);
                line.set({'x2': pm.x, 'y2': pm.y});
                canvas.renderAll();
                console.log("we are moving");
            }
        });

        $('canvas').mouseup(function() {
        isMouseDown = false;
        var pf = canvas.getPointer(event.e);
        console.log('we are up');
        canvas.off('mouse:move');
        canvas.remove(line);
        var finalLine = makeLine([pointer.x, pointer.y, pf.x, pf.y]);
        canvas.add(finalLine);
        canvas.renderAll();
        console.log('stop');
        // var line = makeLine([oX, oY, tX, tY]);
        // canvas.add(line);
    });
    });

canvas.on('mouse:over', function(e){
    var activeObject= e.target;
    var activeWidth = activeObject.getWidth();
    var activeHeight = activeObject.getHeight();
    var activeCentre = activeObject.getCenterPoint();
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;
    if (isShiftDown) 
    {   canvas.hoverCursor = 'crosshair';
        if(activeCentre.x+activeWidth/4 < posX < activeCentre.x+activeWidth/2 && activeCentre.y-activeHeight/8 < posY < activeCentre.y+activeHeight/8){
            activeObject.selectable = false;
            $('canvas').mousedown(function(){
                 console.log("we're down");
            })
        }

        // if(isMouseDown){
        //     console.log("we're down");
        //     activeObject.selectable = false;
        //     if(activeCentre.x+activeWidth/4 < posX < activeCentre.x+activeWidth/2 && activeCentre.y-activeHeight/8 < posY < activeCentre.y+activeHeight/8){
        //         //Draw line from right triangle
        //         makeline([activeCentre.x +activeWidth/2, activeCentre.y, posX, posY]);
        //     } else if (activeCentre.x-activeWidth/2 < posX < activeCentre.x-activeWidth/4 && activeCentre.y-activeHeight/8 < posY < activeCentre.y+activeHeight/8) {
        //         makeline([activeCentre.x - activeWidth/2, activeCentre.y, posX, posY]);
        //     }
        // }
    }
    
});

// function canvasChange(){
//     var state = JSON.parse(JSON.stringify(canvas));

//     var i, nbr; 
//     for (i = 0, nbr = state.objects.length; i<nbr; i++){
//         console.log(state.objects[i].type);
//         if (state.objects[i].type === 'playNode'){
//             var osc = ac.createOscillator();
//             osc.frequency = state.objects[i].frequency;
//             osc.connect(ac.destination);
//             osc.start(ac.currentTime);
//             osc.stop(ac.currentTime + state.objects[i].duration);
//         } else if (state.objects[i].type === 'sampleNode'){
//             source = ac.createBufferSource();
//             var request = new XMLHttpRequest();

//             request.open('GET', state.objects[i].sample, true);
            

//             request.responseType = 'arraybuffer';


//             request.onload = function() {
//                 var audioData = request.response;

//                 ac.decodeAudioData(audioData, function(buffer) {
//                     source.buffer = buffer;

//                     source.connect(ac.destination);
//                     source.loop = true;              
//                 },

//                 function(e){"Error with decoding audio data" + e.err});

//             }
//             console.log(state.objects[i].sample);
//             request.send();
//             source.start(0);
//         }
//     }

// }

function canvasCleared(){
    ac.close();
    ac = new AudioContext();
}

window.addEventListener('resize', function(){
	canvas.setHeight(window.innerHeight - 150);
	canvas.setWidth(window.innerWidth*0.80 - 20);
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
        case 'sleep':
            SleepNode();
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
// canvas.on('mouse:over', function(e){
// 	if(isShiftDown){
// 		var activeObject = e.target;
// 		setParameters(activeObject);
// 	}
// });

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
          canvas.hoverCursor = 'pointer';
		  break;
	}
}

//Window resize triggers resizing of canvas
window.addEventListener('resize', function(){
    canvas.setHeight(window.innerHeight - 150);
    canvas.setWidth(window.innerWidth*0.80 - 20);
})


//Adding double click event listener (not supported by fabric.js)
window.addEventListener('dblclick', function (e, self) {
    var target = canvas.findTarget(e);
    if (target) {
       console.log('dblclick inside ' + target.type);
    }   
});

function canvasCleared(){
    ac.close();
    ac = new AudioContext();
}

function resetCanvas(){
    canvas.clear();
}

function canvasState(){
    var state = JSON.parse(JSON.stringify(canvas));
    console.log(state);
}
