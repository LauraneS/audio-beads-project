window.onload = init;

var line, isMouseDown, isMouseOver, isShiftDown, isSdown, center, playing = true;
var canvas, bufferLoader, bList, ac = new AudioContext(), tuna = new Tuna(ac);
var lastAdded= window._lastAdded = [];

//Canvas Initialisation 
    canvas = this.__canvas = new fabric.Canvas('canvas');
    canvas.setHeight(window.innerHeight*0.80);
    canvas.setWidth(window.innerWidth*0.80 -20);
    //canvas.selection = false;
    canvas.hoverCursor = canvas.moveCursor ='pointer';
    StartNode();

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
            break;        
        case 67: //C key down
            canvas.clear().renderAll();
            break;
        case 83: 
            isSdown = true;
            // canvas.forEachObject(function(obj){
            //     obj.set({selectable: true});
            // });
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
            // canvas.forEachObject(function(obj){
            //     obj.set({selectable: true});
            // });
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

  
canvas.on('object:selected', function(e){
    var activeObject = e.target;
    var activeObjectType = e.target.type;
    displayParam(activeObject, activeObjectType, 'selected');
   
});

canvas.on('object:added', function(e){
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
                console.log(activeObject.parentNode);
            }
            //console.log(activeObject.parentNode);
        } else if (isSdown && activeObject.intersected){
            activeObject.parentNode.pop();
            console.log(activeObject.parentNode);
            activeObject.intersected = false;
        }
    });

    if(activeObject.getLeft()+activeObject.getWidth() > currentWidth){
        canvas.setWidth(currentWidth+50);
        $("#wrapper").scrollLeft(activeObject.getLeft());
        $("#wrapper").on('scroll', canvas.calcOffset.bind(canvas));
    } 
    if (activeObject.getTop()+activeObject.getHeight() > currentHeight){
        canvas.setHeight(currentHeight+50);
        $("#wrapper").scrollTop(activeObject.getTop());
        $("#wrapper").on('scroll', canvas.calcOffset.bind(canvas));
    }
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
    

// //Adding a line with mouse drag when shift is pressed 
// canvas.on('mouse:over', function(e){
//     isMouseOver = true;
//     var activeObject= e.target;
//     if (isShiftDown) {
//         activeObject.lockMovementX = activeObject.lockMovementY = true; 
//         canvas.hoverCursor = 'crosshair';
//         drawLine(activeObject);
//     }   
// });

// canvas.on('mouse:out', function(e){
//     isMouseOver = false;
// });

// function drawLine(object){
//     var activeObject = object;
//     var activeWidth = activeObject.getWidth();
//     var activeHeight = activeObject.getHeight();
//     var activeCentre = activeObject.getCenterPoint();
//     var isLeft;
//     if (!isShiftDown) return;
//         canvas.on('mouse:down', function(o) {
//             isMouseDown = true;
//             if (isShiftDown){
//                 var pointerO = canvas.getPointer(o.e);
//                 if (activeCentre.x+15<pointerO.x<(activeCentre.x+25) && activeCentre.y-(activeHeight/8)< pointerO.y<activeCentre.y+(activeHeight/8)){
//                     line = makeLine([activeCentre.x +activeWidth/2, activeCentre.y, activeCentre.x +activeWidth/2, activeCentre.y]);
//                     canvas.add(line);
//                     isLeft = false;
//                 } else if ((activeCentre.x-25)< pointerO.x < (activeCentre.x-15) && (activeCentre.y-activeHeight/8) < pointerO.y < (activeCentre.y+activeHeight/8)){
//                     line = makeLine([activeCentre.x -activeWidth/2, activeCentre.y, activeCentre.x -activeWidth/2, activeCentre.y]);
//                     canvas.add(line);
//                     isLeft = true;
//                 }
//             }
//         });
//         canvas.on('mouse:move', function(o){
//             if (!isMouseDown) return;
//             var pointer = canvas.getPointer(o.e);
//             line.set({'x2': pointer.x, 'y2': pointer.y});
//             canvas.renderAll();
//         });
//         canvas.on('mouse:up', function(o) {
//                 isMouseDown = false;
//                 if (isShiftDown){
//                     var pf = canvas.getPointer(o.e);
//                     canvas.remove(line);
//                     if (isLeft){
//                         var finalLine = makeLine([activeCentre.x -activeWidth/2, activeCentre.y, pf.x, pf.y]);
//                         canvas.add(finalLine);
//                         canvas.renderAll();
//                     } else {
//                         var finalLine = makeLine([activeCentre.x +activeWidth/2, activeCentre.y, pf.x, pf.y]);
//                         canvas.add(finalLine);
//                         canvas.renderAll(); 
//                     } 
//                     if (activeObject.type === 'startNode') return;
//                     activeObject.lockMovementX = false;
//                     activeObject.lockMovementY = false;
//                  }  
//         });
// }


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
    playing = true;
}

function resetCanvas(){
    canvas.clear();
    ac.suspend();
    ac.close();
    playing = true;
    StartNode();
    document.getElementById('node-name').innerHTML = "Click an object to get started!";
    ac = new AudioContext();
}

function canvasState(){
    console.log('on');
    if (!playing){
        ac.resume();
        playing = true;
        console.log("Playing after pause");
    }
    //canvasCleared();
    var state = (JSON.stringify(canvas));
    var stateArray = $.parseJSON(state.substring(11, state.length - 17));
    //var stateArray = eval('(' + state + ')');
    //console.log(stateArray);

    var tree = unflatten(stateArray);
    parse(tree);
    //console.log(JSON.stringify(tree, null, " "));
}

function pauseSound(){
    try{
        ac.suspend();
        playing=false;
        console.log("Paused");
    }
    catch(err){
        console.log("There is nothing to pause.");
    }
}

function stopSound(){
    try{
        ac.close();
    } catch(err){
        console.log("There is nothing to stop");
    }
}
