window.onload = init;

var line, isSdown, center, playing;
var canvas, bufferLoader, bList, ac = new AudioContext(), tuna = new Tuna(ac);
var lastAdded= window._lastAdded = [];

var sourceMouseDown, line;


//Canvas Initialisation 
    canvas = this.__canvas = new fabric.Canvas('canvas');
    canvas.setHeight(window.innerHeight*0.80);
    canvas.setWidth(window.innerWidth*0.80);
    canvas.selection = false;
    canvas.hoverCursor = canvas.moveCursor ='pointer';
    StartNode({x:canvas.getWidth()/2 - 15, y: 15});
    canvas.calcOffset() 

    fabric.util.addListener(document.getElementById('wrapper'), 'scroll', function () {
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
        case 67: //C key down
            canvas.clear().renderAll();
            break;
      }
}
document.onkeyup = function(e) {
    switch (e.keyCode) {
        case 32: //spacebar
            if (playing){
                ac.suspend();
                playing = false;
            } else{
                ac.resume();
                playing = true;
            }
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
            children: this.children,
            duration: this.duration,
            effect: this.effect,
            ID: this.ID,
            loop: this.loop,
            note: this.note,
            parentNode: this.parentNode,
            parentType: this.parentType,
            intersected: this.intersected,
            sample: this.sample,
            wave: this.wave,
            effects: this.effects,
            loopPos: this.loopPos
        });
    };
})(fabric.Object.prototype.toObject);

// canvas.on('mouse:over', function(e){
//     var pointer = canvas.getPointer(e.e);
//     if (e.target.type !== 'line' && e.target.containsBottomArrow(pointer)) {
//         canvas.hoverCursor = 'crosshair';
//     }
//     if(e.target.type !== 'line' && !e.target.containsBottomArrow(pointer)){
//         canvas.hoverCursor = 'pointer';
//     }
// })

canvas.on('object:selected', function(e){
    var activeObject = e.target;
    var activeObjectType = e.target.type;
    displayParam(activeObject, activeObjectType, 'selected');
   
});

canvas.on('object:added', function(e){
    playing = undefined;
    if (e.target.type === 'line'){
        return
    }
    lastAdded.push(e.target);
    canvas.setActiveObject(lastAdded[lastAdded.length - 1]);
    displayParam(e.target, e.target.type, 'added');
    canvas.forEachObject(function(obj) {
      if (obj === e.target) return;
        if (e.target.intersectsWithObject(obj) && obj.type === 'loop' && e.target.type !== 'loop'){
            var center = e.target.getCenterPoint();
            var newleft = obj.closestLoopPoint(center).x-e.target.getWidth()/2;
            var newtop = obj.closestLoopPoint(center).y-e.target.getHeight()/2
            e.target.set({left:newleft, top: newtop}).setCoords();
            canvas.renderAll(); 
            if (e.target.parentNode[e.target.parentNode.length-1] !== obj.ID){
                e.target.intersected = true;
                e.target.parentNode.push(obj.ID);
                e.target.loopPos = obj.loopToPointAngle({x:center.x, y:center.y});
                // obj.children.push({x:center.x, y:center.y, ID:activeObject.ID});
                // obj.sortChildren(obj.children);   
            }
        } 
    });
});

canvas.on({'object:moving':onObjectMoving});

function onObjectMoving(e){
    var activeObject = e.target;
    activeObject.setCoords();
    var currentWidth = canvas.getWidth();
    var currentHeight = canvas.getHeight();

    
    canvas.forEachObject(function(obj) {
      if (obj === activeObject) return;
        if (activeObject.intersectsWithObject(obj) && obj.type === 'loop' && activeObject.type !== 'loop'){
            var center = activeObject.getCenterPoint();
            var newleft = obj.closestLoopPoint(center).x-activeObject.getWidth()/2;
            var newtop = obj.closestLoopPoint(center).y-activeObject.getHeight()/2
            activeObject.set({left:newleft, top: newtop}).setCoords();
            canvas.renderAll(); 
            if (activeObject.parentNode[activeObject.parentNode.length-1] !== obj.ID){
                activeObject.intersected = true;
                activeObject.parentNode.push(obj.ID);
                 e.target.loopPos = obj.loopToPointAngle({x:center.x, y:center.y});
                // obj.children.push({x:center.x, y:center.y, ID:activeObject.ID});
                // obj.sortChildren(obj.children);   
            }
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


canvas.on('mouse:down', function(e){
    if (canvas.getActiveObject() === null){
        displayNothing();
        return
    }
    var pointerDown = canvas.getPointer(e.e);
    canvas.forEachObject(function(obj){
        if(obj.type !== 'line'){
            if(obj.containsBottomArrow(pointerDown)){
                sourceMouseDown = obj;
                sourceMouseDown.set({lockMovementX: true, lockMovementY: true});
                line = makeLine([obj.getBottomArrowCenter().x, obj.getBottomArrowCenter().y, obj.getBottomArrowCenter().x, obj.getBottomArrowCenter().y]);
                canvas.add(line);
                line.sendToBack();
            } 
        }
    }); 
})

//Tracking pointer
canvas.on('mouse:move', function(e){
    var pointer = canvas.getPointer(e.e);
    document.getElementById('pointerx').value = "x: " + pointer.x;
    document.getElementById('pointery').value = "y: " + pointer.y;
    if (sourceMouseDown !== undefined){
        line.set({x2: pointer.x, y2: pointer.y});
        canvas.renderAll();
    }
});

canvas.on('mouse:up', function(e){
    var pointerUp = canvas.getPointer(e.e);
    var objAr;
    if(sourceMouseDown !== undefined){
        canvas.forEachObject(function(obj){
            // if (obj.type === 'startNode' || obj.type === 'line'){
            //     canvas.remove(line);
            //     //line = undefined;
            //     return 
            // }
            if(obj.type === 'loop'){
                console.log(obj.containsTopArrow(pointerUp));
            }
            if(obj.type !== 'startNode' && obj.type !== 'line' && obj.containsTopArrow(pointerUp)){
                //debugger
                line.set({x2:obj.getTopArrowCenter().x, y2:obj.getTopArrowCenter().y});
                addChildLine(sourceMouseDown, obj);
                line.setCoords();
                lastAdded.push(line);
                canvas.setActiveObject(line);
                displayParam(line, 'line', 'added');
                if (sourceMouseDown.type !== 'startNode'){
                    sourceMouseDown.set({lockMovementX: false, lockMovementY: false});
                }
            } 
            else {
                canvas.remove(line);
                canvas.renderAll();
            } 
            sourceMouseDown = undefined;
            line = undefined;
        })
    } 
})

//Function to draw a line
function makeLine(coords) {
    return new fabric.Line(coords, {
        stroke: 'black',
        selectable: true,
        originX: 'center',
        originY: 'center',
        lockMovementX: true,
        lockMovementY: true
    });
};

// Functions + Events to draw a line between objects by 'adding a child' to a clicked object
['object:moving'].forEach(addChildMoveLine);

function addChildLine(fromObject, toObject) {
    toObject.parentNode.push(fromObject.ID);
    toObject.parentType = fromObject.type;


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
        //ONLY WORKS IF ALLOW ONLY ONE PARENT PER NODE 
        toObject.parentNode = [];
    }

    // undefined instead of delete since we are anyway going to do this many times
    canvas.addChild = undefined;
}

function addChildMoveLine(event) {
    canvas.on(event, function (options) {
        var obj = options.target;
        // udpate lines (if any)
        if (obj.addChild) {
            if (obj.addChild.from)
                obj.addChild.from.forEach(function (line) {
                    line.set({ 'x1': obj.getBottomArrowCenter().x, 'y1': obj.getBottomArrowCenter().y});
                    line.setCoords();
                })
            if (obj.addChild.to)
                obj.addChild.to.forEach(function (line) {
                    line.set({ 'x2':obj.getTopArrowCenter().x, 'y2':obj.getTopArrowCenter().y});
                    line.setCoords();
                })
        }
        canvas.renderAll();
    });
}

var playBtClicks = 0;
ac.onstatechange = function(){
    if (ac.state === 'suspended'){
        document.getElementById("playBtn").src="/png/playBtn.png";
    } else 
    if (ac.state === 'closed'){
        debugger
        document.getElementById("playBtn").src="/png/playBtn.png";
        playBtClicks = 0;
    }
}

function canvasState(){
    // if (ac.state === 'running' && playBtClicks === 0){
        playBtClicks++;
        document.getElementById("playBtn").src="/png/pauseBtn.png";
        var state = (JSON.stringify(canvas));
        var stateArray = $.parseJSON(state.substring(11, state.length - 17));
        var tree = unflatten(stateArray);
        parse(tree);
    // } else
    if (ac.state === 'running' && playBtClicks === 1){
        playBtClicks--;
        try{
            ac.suspend();
            console.log("Paused");
        }
        catch(err){
            console.log("There is nothing to pause.");
        }
    } else if (ac.state === 'suspended'){
        document.getElementById("playBtn").src="/png/pauseBtn.png";
        ac.resume();
        console.log("Playing after pause");
        
    }
}

function stopSound(){
    try{
        ac.close();
        playBtClicks = 0;
        document.getElementById("playBtn").src="/png/playBtn.png";
        ac = new AudioContext();
    } catch(err){
        console.log("There is nothing to stop");
    }
}


