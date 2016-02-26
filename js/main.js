window.onload = init;

var line, isMouseDown, isMouseOver, isShiftDown, isSdown, center, playing;
var canvas, bufferLoader, bList, ac = new AudioContext(), tuna = new Tuna(ac);
var lastAdded= window._lastAdded = [];

var sourceMouseDownID, line;


//Canvas Initialisation 
    canvas = this.__canvas = new fabric.Canvas('canvas');
    canvas.setHeight(window.innerHeight*0.80);
    canvas.setWidth(window.innerWidth*0.80 -20);
    //canvas.selection = false;
    canvas.hoverCursor = canvas.moveCursor ='pointer';
    StartNode({x:canvas.getWidth()/2 - 15, y: 15});
    canvas.calcOffset() 

    fabric.util.addListener(document.getElementById('wrapper'), 'scroll', function () {
    console.log('scroll');
    canvas.calcOffset();
});

function init(){
    //Loading samples 
    bufferLoader = new BufferLoader(
    ac,
    [
        '/samples/hihat-plain.wav',
        '/samples/kick-big.wav',
        '/samples/alien.mp3',
        '/samples/beat.mp3',
        '/samples/bass.mp3',
        '/samples/flute.wav'
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList){
    bList = bufferList;
}

//Generate UID for each node
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

//Functions to link keydown events to various functions 
document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 16:  // Shift key down
            isShiftDown = true;
            canvas.hoverCursor = 'crosshair';
            break;        
        case 67: //C key down
            canvas.clear().renderAll();
            break;
        case 83: 
            isSdown = true;
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
        case 32: //spacebar
            if (playing){
                ac.suspend();
                playing = false;
            } else{
                ac.resume();
                playing = true;
            }
            break;
         case 83: 
            isSdown = false;
            canvas.forEachObject(function(obj){
                obj.set({selectable: false});
            });
            break;
    }
}

//Setting properties for all objects
fabric.Object.prototype.set({
    hasControls: false, hasBorders: false, selectable: true
});

//Adding custom parameters to the JSON serialisation of the canvas 
fabric.Object.prototype.toObject = (function (toObject){
    return function(){
        return fabric.util.object.extend(toObject.call(this), {
            attack: this.attack,
            children: this.children,
            duration: this.duration,
            effect: this.effect,
            ID: this.ID,
            loop: this.loop,
            note: this.note,
            parentNode: this.parentNode,
            parentType: this.parentType,
            intersected: this.intersected,
            release: this.release, 
            sample: this.sample,
            wave: this.wave,
            intensity: this.intensity, 
            rate: this.rate,
            rateCho: this.rateCho, 
            delayCho: this.delayCho,
            delay: this.delay,
            octave: this.octave,
            resonance:this.resonance
        });
    };
})(fabric.Object.prototype.toObject);

//Tracking pointer
canvas.on('mouse:move', function(e){
    var pointer = canvas.getPointer(e.e);
    document.getElementById('pointerx').value = "x: " + pointer.x;
    document.getElementById('pointery').value = "y: " + pointer.y;

    //change coords of line for end to be pointer coords 
    
});

canvas.on('mouse:down', function(e){
    var pointer = canvas.getPointer(e.e);
    canvas.forEachObject(function(obj) {
        //debugger
        obj.contains(pointer);
        obj.containsTopArrow(pointer);
        obj.containsBottomArrow(pointer);
        //Never mousedown on toparrow
        //When containsbottomarrow = true 
        // update sourcereference = obj.ID;
        // line = canvas.newline()
    });
});



function isContainedWithinHigherCo(obj, point){
    var x = point.x;
    var y = point.y;
    var center_x = obj.getCenterPoint().x;
    var center_y = obj.getCenterPoint().y;
    if( (center_x - 10 < x) && (x < center_x + 10) && (obj.getTop()< y) && (y < obj.getTop()-10)){
        return true;
    }
}

function isContainedWithinLowerCo(obj, point){
    var x = point.x;
    var y = point.y;
}

canvas.on('object:selected', function(e){
    var activeObject = e.target;
    var activeObjectType = e.target.type;
    displayParam(activeObject, activeObjectType, 'selected');
   
});

canvas.on('object:added', function(e){
    playing = undefined;
    lastAdded.push(e.target);
    displayParam(e.target, e.target.type, 'added');
});

canvas.on({'object:moving':onObjectMoving});

function onObjectMoving(e){
    var activeObject = e.target;
    activeObject.setCoords();
    var currentWidth = canvas.getWidth();
    var currentHeight = canvas.getHeight();

    
    canvas.forEachObject(function(obj) {
      if (obj === activeObject) return;
        if (activeObject.intersectsWithObject(obj)){
            if (obj.type === 'loop'){
                if (activeObject.parentNode[activeObject.parentNode.length-1] !== obj.ID){
                    activeObject.intersected = true;
                    activeObject.parentNode.push(obj.ID);       
                }
            } 
        } else if (isSdown && activeObject.intersected){
            activeObject.parentNode.pop();
            console.log(activeObject.parentNode);
            activeObject.intersected = false;
        }
    });

    // if(activeObject.getLeft()+activeObject.getWidth() > currentWidth){
    //     canvas.setWidth(currentWidth+50);
    //     $("#wrapper").scrollLeft(activeObject.getLeft());
    //     $("#wrapper").on('scroll', canvas.calcOffset.bind(canvas));
    // } 
    // if (activeObject.getTop()+activeObject.getHeight() > currentHeight){
    //     canvas.setHeight(currentHeight+50);
    //     $("#wrapper").scrollTop(activeObject.getTop());
    //     $("#wrapper").on('scroll', canvas.calcOffset.bind(canvas));
    // }
}

// canvas.on('mouse:down', function(){
//     if (!isMouseOver) {
//         document.getElementById('node-name').innerHTML = "No node selected";
//         var elements = ['play-info', 'effect-info', 'sample-info', 'sleep-info'], i;
//         for (i = 0; i < elements.length; i++){
//             document.getElementById(elements[i]).style.display = 'none';
//         }
//     }
// });
    

// Adding a line with mouse drag when shift is pressed 
canvas.on('mouse:over', function(e){
    isMouseOver = true;
    var activeObject= e.target;
    if (isShiftDown) {
        activeObject.lockMovementX = activeObject.lockMovementY = true; 
        canvas.hoverCursor = 'crosshair';
        drawLine(activeObject);
    }   
});

canvas.on('mouse:out', function(e){
    isMouseOver = false;
});

var pointerStart, pointerEnd;
canvas.on('mouse:down', function(e){
    if (isShiftDown){
        pointerStart = canvas.getPointer(e.e);
    } 
})

canvas.on('mouse:up', function(e){
    //check whether pointer coords are within an object 
    // set source id = undefined
    if (isShiftDown){
        pointerEnd = canvas.getPointer(e.e);
        canvas.add(makeLine([pointerStart.x, pointerStart.y, pointerEnd.x, pointerEnd.y]));
        pointerStart = pointerEnd = undefined;
    }
    
})

function drawLine(object){
    var activeWidth = object.getWidth();
    var activeHeight = object.getHeight();
    var activeCentre = object.getCenterPoint();
    var drawing;
    if (!isShiftDown) return;
    var line;
        canvas.on('mouse:down', function(o) {
            isMouseDown = true;
            if (isShiftDown){
                var pointer = canvas.getPointer(o.e);
                if (isContained(object, pointer)){
                    line = makeLine([activeCentre.x, activeCentre.y + activeHeight/2, activeCentre.x, activeCentre.y+activeHeight/2]);
                    canvas.add(line);
                    drawing = true;
                }
            }
            canvas.on('mouse:move', function(o){
                if (!isMouseDown) return;
                else if (drawing){
                    var pointer = canvas.getPointer(o.e);
                    line.set({'x2': pointer.x, 'y2': pointer.y});
                    canvas.renderAll();
                } 
            });
            canvas.on('mouse:up', function(o) {
                isMouseDown = false;
                if (isShiftDown && drawing){
                    var pf = canvas.getPointer(o.e);
                    canvas.remove(line);
                    var finalLine = makeLine([activeCentre.x, activeCentre.y + activeHeight/2, pf.x, pf.y])
                    canvas.add(finalLine);
                    canvas.renderAll();
                    drawing = false;
                 }  
            });
        });    
}




function canvasCleared(){
}

//Function to draw a line
function makeLine(coords) {
    return new fabric.Line(coords, {
        stroke: 'black',
        selectable: false
    });
};

// function angleVal(coords) {
//     var angle = 0,
//         x, y;

//     x = (coords[2] - coords[0]);
//     y = (coords[3] - coords[1]);

//     if (x === 0){
//         if (y < 0){
//             angle = -180;
//         } else {
//             angle = 0;
//         }
//     } else if (y === 0){
//         if (x < 0){
//             angle = -45;
//         } else {
//             angle = 45;
//         }
//     } else {
//         angle = y/x;
//     }

//     // if (x === 0) {
//     //     angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
//     // } else if (y === 0) {
//     //     //angle = (x > 0) ? 0 : Math.PI;
//     //     angle = 180;
//     // } else {
//     //     angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
//     // }

//     // return (angle * 180 / Math.PI);
// }


// function makeArrow(coords) {
//     return new fabric.Triangle({
//             left: 50,
//             top: 50,
//             angle: angleVal(coords),
//             originX: 'center',
//             originY: 'center',
//             width: 10,
//             height: 8.7,
//             fill: '#000'
//     });
// }

// Functions + Events to draw a line between objects by 'adding a child' to a clicked object
['object:moving'].forEach(addChildMoveLine);

function addChildLine(options) {
    canvas.off('object:selected', addChildLine);

    // add the line
    var fromObject = canvas.addChild.start;
    var toObject = options.target;
    if (toObject.type === 'startNode') {
        document.getElementById('node-name').innerHTML = "You cannot add this line.";
        return;
    }
    var from = fromObject.getCenterPoint()
    var to = toObject.getCenterPoint();
    var coords = [from.x, from.y + fromObject.getHeight()/2 - 1, to.x, to.y- toObject.getHeight()/2];
    var line = makeLine(coords);
    //var arrow = makeArrow(coords);
    canvas.add(line);
    //fromObject.children.push(toObject.ID);
    toObject.parentNode.push(fromObject.ID);
    toObject.parentType = fromObject.type;
    
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
                    line.set({ 'x1': objectCenter.x, 'y1': objectCenter.y + object.getHeight()/2 });
                })
            if (object.addChild.to)
                object.addChild.to.forEach(function (line) {
                    line.set({ 'x2': objectCenter.x, 'y2': objectCenter.y - object.getHeight()/2 });
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

function canvasCleared(){
    ac.close();
    ac = new AudioContext();
    playing = undefined;
    document.getElementById("playBtn").src="/png/playBtn.png";
}

function resetCanvas(){
    canvas.clear();
    ac.suspend();
    ac.close();
    playing = undefined;
    document.getElementById("playBtn").src="/png/playBtn.png";
    StartNode({x:canvas.getWidth()/2 - 15, y: 15});
    document.getElementById('node-name').innerHTML = "Click an object to get started!";
    ac = new AudioContext();
}


function canvasState(){
    if (playing === undefined){
        var state = (JSON.stringify(canvas));
        var stateArray = $.parseJSON(state.substring(11, state.length - 17));
        var tree = unflatten(stateArray);
        parse(tree);
        playing = true;
        document.getElementById("playBtn").src="/png/pauseBtn.png";
    } else if (playing){
        try{
            ac.suspend();
            playing = false;
            document.getElementById("playBtn").src="/png/playBtn.png";
            console.log("Paused");
        }
        catch(err){
            console.log("There is nothing to pause.");
        }
    } else if (!playing){
        ac.resume();
        playing = true;
        console.log("Playing after pause");
        document.getElementById("playBtn").src="/png/pauseBtn.png";
    }
    
}

function stopSound(){
    try{
        ac.close();
        playing = undefined;
    } catch(err){
        console.log("There is nothing to stop");
    }
}


