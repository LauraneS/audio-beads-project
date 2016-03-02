//var isDClicked = false;

$(document).ready(function(){
  $('.buttons').dblclick(function(e){
    e.preventDefault();
  });
});

//Drag and drop to create a new node
function dragStart(ev) {
    ev.dataTransfer.effectAllowed='move';
    ev.dataTransfer.setData("text", ev.target.getAttribute('id'));
    ev.dataTransfer.setDragImage(ev.target,0,0);
    return true;
}
function dragEnter(ev) {
    event.preventDefault();
    return true;
}
         
function dragOver(ev) {
    return false;
}
         
function dragDrop(ev) {
    //debugger
    var pointer = canvas.getPointer(ev.e)
    console.log(pointer);
    var src = ev.dataTransfer.getData("text");
    switch (src){
        case 'playImg':
            PlayNode(pointer);
            break;
        case 'loopImg':
            LoopNode(pointer);
            break;
        case 'effectImg':
            // EffectNode(pointer);
            canvas.forEachObject(function(obj){
                debugger
                var left = obj.getLeft();
                var top = obj.getTop();
                var width = obj.getWidth();
                var height = obj.getHeight();
                var center = obj.getCenterPoint();
                console.log(obj.getLeft() < pointer.x < obj.getLeft()+obj.getWidth());
                if ((obj.getLeft() < pointer.x < obj.getLeft()+obj.getWidth())){
                    if(obj.getTop()<pointer.y<obj.getTop()+obj.getHeight()){
                        if (obj.type ==='playNode' || obj.type === 'sampleNode'){
                        obj.item(0).setStroke('blue');
                        }  
                    }
                }
            });
            break;
        case 'sampleImg':
            SampleNode(pointer);
            break;
        case 'sleepImg':
            SleepNode(pointer);
            break;
    }
    var lastObject = lastAdded[lastAdded.length - 1];
    canvas.setActiveObject(lastObject);
    console.log(canvas.getActiveObject);
    ev.stopPropagation();
    return false;
}
//Display relevant parameters
function displayParam(node, nodeType, evt){
    var elements = ['play-info', 'effect-info', 'sample-info', 'sleep-info', 'line-info'], i;
    switch (nodeType){
        case 'playNode':
            for (i = 0; i < elements.length; i++){
                if (elements[i] === 'play-info'){
                    
                    document.getElementById("note").value = document.getElementById("noteInput").value = node.note;
                    document.getElementById("wave-type").value = node.wave;
                    document.getElementById("duration").value = document.getElementById("durationInput").value = node.duration;
                    //document.getElementById("attack").value = document.getElementById("attackInput").value = node.attack;
                    //document.getElementById("release").value = document.getElementById("releaseInput").value = node.release;
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
                    document.getElementById("sample").value = node.sample;
                    document.getElementById("loop").checked= node.loop;
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
        case 'sleepNode':
            for (i = 0; i < elements.length; i++){
                if (elements[i] === 'sleep-info'){
                    document.getElementById(elements[i]).style.display = 'block';
                    document.getElementById("sleep").value = document.getElementById("sleepInput").value = node.duration;
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
        case 'loop':
            for (i = 0; i < elements.length; i++){
                document.getElementById(elements[i]).style.display = 'none'; 
            }
            break;
        case 'startNode':
            for (i = 0; i < elements.length; i++){
                document.getElementById(elements[i]).style.display = 'none'; 
            }
            break;
        case 'line':
            for (i = 0; i < elements.length; i++){
                if (elements[i] === 'line-info'){
                    document.getElementById(elements[i]).style.display = 'block';
                    document.getElementById("delete-line").selectedIndex = 0;
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
    }
    if (nodeType === 'effectNode'){
        if (evt === 'selected'){
            document.getElementById('node-name').innerHTML = "This is an "+ nodeType;
        } else {
            document.getElementById('node-name').innerHTML = "You added an "+ nodeType;
        }
         
    } else if (nodeType === 'startNode'){
        document.getElementById('node-name').innerHTML = "This is the "+ nodeType + ". <br><br> Connect other nodes to it to start playing.";
    } else {
        if (evt === 'selected'){
            document.getElementById('node-name').innerHTML = "This is a "+ nodeType;
        } else {
            document.getElementById('node-name').innerHTML = "You added a "+ nodeType;
        }
    }
}
//Display the correct parameters depending on effect chosen
document.getElementById("effect-name").oninput = function(){
	var value = document.getElementById("effect-name").value;
	var elements = ["effect-wah", "effect-tremolo", "effect-chorus", "effect-pingpong"];
	switch (value){
		case 'wahwah':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-wah'){
                    document.getElementById("octave").value = document.getElementById("octInput").value = canvas.getActiveObject().octave;
                    document.getElementById("resonance").value = document.getElementById("resInput").value = canvas.getActiveObject().resonance;
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
		case 'tremolo':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-tremolo'){
                    document.getElementById("intensity").value = document.getElementById("intensityInput").value = canvas.getActiveObject().intensity;
                    document.getElementById("rate").value = document.getElementById("rateInput").value = canvas.getActiveObject().rate;
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
		case 'chorus':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-chorus'){
                    document.getElementById("rateCho").value = document.getElementById("rateChoInput").value = canvas.getActiveObject().rateCho;
                    document.getElementById("delayCho").value = document.getElementById("delayChoInput").value = canvas.getActiveObject().delayCho;
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
		case 'pingpong':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-pingpong'){
                    document.getElementById("delay").value = document.getElementById("delayInput").value = canvas.getActiveObject().delay;
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
	}
};

//Event listeners for input changes on parameters
document.getElementById("note").oninput = document.getElementById("noteInput").oninput = function(){
    canvas.getActiveObject().note = this.value;
};
document.getElementById("duration").oninput = document.getElementById("durationInput").oninput= function(){
    canvas.getActiveObject().duration = this.value;
};
document.getElementById("wave-type").oninput = function(){
    canvas.getActiveObject().wave = this.value;
};
// document.getElementById("attack").oninput = document.getElementById("attackInput").oninput = function(){
//     canvas.getActiveObject().attack = this.value;
// };
// document.getElementById("release").oninput = document.getElementById("releaseInput").oninput = function(){
//     canvas.getActiveObject().release = this.value;
// };
document.getElementById("effect-name").onchange = function(){
    canvas.getActiveObject().effect = this.options[this.selectedIndex].value;
};
document.getElementById("octave").oninput = function(){
    canvas.getActiveObject().octave = this.value;
};
document.getElementById("resonance").oninput = function(){
    canvas.getActiveObject().resonance = this.value;
};
document.getElementById("intensity").oninput = function(){
    canvas.getActiveObject().intensity = this.value;
};
document.getElementById("rate").oninput = function(){
    canvas.getActiveObject().rate = this.value;
};
document.getElementById("rateCho").oninput = function(){
    canvas.getActiveObject().rateCho = this.value;
};
document.getElementById("delayCho").oninput = function(){
    canvas.getActiveObject().delayCho = this.value;
};

document.getElementById("delay").oninput = function(){
    canvas.getActiveObject().delay = this.value;
};
document.getElementById("sample").onchange = function(){
    canvas.getActiveObject().sample=this.options[this.selectedIndex].value;
};
document.getElementById("loop").oninput = function(){
    canvas.getActiveObject().loop = this.checked;
    console.log(canvas.getActiveObject().loop );
};
document.getElementById("sleep").oninput = document.getElementById("sleepInput").oninput= function(){
    canvas.getActiveObject().duration = this.value;
};

document.getElementById("delete-line").onchange = function(){
    if (this.options[this.selectedIndex].value === 'yes'){
        canvas.getActiveObject().addChildRemove();
        canvas.remove(canvas.getActiveObject());
        document.getElementById("node-name").innerHTML = "The line has been deleted.";
        document.getElementById('line-info').style.display = 'none';
    }
}

//On window resize
window.addEventListener('resize', function(){
    canvas.setHeight(window.innerHeight - 150);
    canvas.setWidth(window.innerWidth*0.80 - 20);
})

//Adding double click event listener (not supported by fabric.js)
// window.addEventListener('dblclick', function (e, self) {
//     var target = canvas.findTarget(e);
//     if (target) {
//        console.log('dblclick inside ' + target.type);
//     }  else if (!isDClicked) {
//         canvas.setZoom(3);
//         isDClicked = true;
//     } else {
//         console.log(canvas.getZoom());
//         canvas.setZoom(1);
//         isDClicked = false;
//     }
// });

//Deleting objects
document.getElementById('delete').onmouseup = function(){
    var actObject = canvas.getActiveObject();

    //Deleting lines (if any) connected to the node
    if (actObject.addChild) {
        if (actObject.addChild.from)
            // step backwards since we are deleting
            for (var i = actObject.addChild.from.length - 1; i >= 0; i--) {
                var line = actObject.addChild.from[i];
                line.addChildRemove();
                canvas.remove(line);
            }
        if (actObject.addChild.to)
            for (var i = actObject.addChild.to.length - 1; i >= 0; i--) {
                var line = actObject.addChild.to[i];
                line.addChildRemove();
                canvas.remove(line);
            }
    }
    canvas.remove(actObject);
    canvas.renderAll();
    document.getElementById('info').value = "on trash";
}

document.getElementById('delete').onmouseout = function(){
    document.getElementById('info').value = "";
}

    

