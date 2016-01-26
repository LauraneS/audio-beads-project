
var ac = new AudioContext(), buf, source;
var line, isMouseDown, isMouseOver, isShiftDown, center;

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
            release: this.release, 
            sample: this.sample,
            wave: this.wave
        });
    };
})(fabric.Object.prototype.toObject);

//Canvas Initialisation 
    var canvas = this.__canvas = new fabric.Canvas('canvas');
    canvas.setHeight(window.innerHeight -150);
    canvas.setWidth(window.innerWidth*0.80 -20);
    canvas.selection = false;
    canvas.hoverCursor = canvas.moveCursor ='pointer';
    StartNode();

canvas.on('object:selected', function(e){
    var activeObjectType = e.target.type;
    var elements = ['play-info', 'effect-info', 'sample-info', 'sleep-info'], i;
            
    switch (activeObjectType){
        case 'playNode':
            for (i = 0; i < elements.length; i++){
                if (elements[i] === 'play-info'){
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
        case 'effectNode':
            for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-info'){
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
        case 'sampleNode':
            for (i = 0; i < elements.length; i++){
                if (elements[i] === 'sample-info'){
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
        case 'sleepNode':
            for (i = 0; i < elements.length; i++){
                if (elements[i] === 'sleep-info'){
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
        case 'loop':
            for (i = 0; i < elements.length; i++){
                document.getElementById(elements[i]).style.display = 'none'; 
            }
    }

    if (activeObjectType === 'effectNode'){
         document.getElementById('node-name').innerHTML = "This is an "+ activeObjectType;
    } else if (activeObjectType === 'startNode'){
        document.getElementById('node-name').innerHTML = "This is the "+ activeObjectType + ". <br><br> Connect other nodes to it to start playing.";
    }else {
         document.getElementById('node-name').innerHTML = "This is a "+ activeObjectType;
    }
   
});

canvas.on('mouse:down', function(){
    if (!isMouseOver) {
        document.getElementById('node-name').innerHTML = "No node selected"
    }
});
    

//Adding a line with mouse drag when shift is pressed 
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

function drawLine(object){
    var activeObject = object;
    var activeWidth = activeObject.getWidth();
    var activeHeight = activeObject.getHeight();
    var activeCentre = activeObject.getCenterPoint();
    var isLeft;
    if (!isShiftDown) return;
        canvas.on('mouse:down', function(o) {
            isMouseDown = true;
            if (isShiftDown){
                var pointerO = canvas.getPointer(o.e);
                if (activeCentre.x+15<pointerO.x<(activeCentre.x+25) && activeCentre.y-(activeHeight/8)< pointerO.y<activeCentre.y+(activeHeight/8)){
                    line = makeLine([activeCentre.x +activeWidth/2, activeCentre.y, activeCentre.x +activeWidth/2, activeCentre.y]);
                    canvas.add(line);
                    isLeft = false;
                } else if ((activeCentre.x-25)< pointerO.x < (activeCentre.x-15) && (activeCentre.y-activeHeight/8) < pointerO.y < (activeCentre.y+activeHeight/8)){
                    line = makeLine([activeCentre.x -activeWidth/2, activeCentre.y, activeCentre.x -activeWidth/2, activeCentre.y]);
                    canvas.add(line);
                    isLeft = true;
                }
            }
        });
        canvas.on('mouse:move', function(o){
            if (!isMouseDown) return;
            var pointer = canvas.getPointer(o.e);
            line.set({'x2': pointer.x, 'y2': pointer.y});
            canvas.renderAll();
        });
        canvas.on('mouse:up', function(o) {
                isMouseDown = false;
                if (isShiftDown){
                    var pf = canvas.getPointer(o.e);
                    canvas.remove(line);
                    if (isLeft){
                        var finalLine = makeLine([activeCentre.x -activeWidth/2, activeCentre.y, pf.x, pf.y]);
                        canvas.add(finalLine);
                        canvas.renderAll();
                    } else {
                        var finalLine = makeLine([activeCentre.x +activeWidth/2, activeCentre.y, pf.x, pf.y]);
                        canvas.add(finalLine);
                        canvas.renderAll(); 
                    } 
                    if (activeObject.type === 'startNode') return;
                    activeObject.lockMovementX = false;
                    activeObject.lockMovementY = false;
                 }  
        });
}


function canvasCleared(){
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
    StartNode();
}

function canvasState(){
    var state = JSON.parse(JSON.stringify(canvas));
    console.log(state);
}
