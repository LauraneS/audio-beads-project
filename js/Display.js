//Drag and drop to create a new node
function dragStart(ev) {
    ev.dataTransfer.effectAllowed='move';
    ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
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
    var src = ev.dataTransfer.getData("Text");
    switch (src){
        case 'playNode':
            PlayNode();
            break;
        case 'loop':
            LoopNode();
            break;
        case 'effectNode':
            EffectNode();
            break;
        case 'sampleNode':
            SampleNode();
            break;
        case 'sleepNode':
            SleepNode();
            //document.getElementById("sleep-info").style.display = 'block';
            break;
    }
    ev.stopPropagation();
    return false;
}
//Display relevant parameters
function displayParam(node, nodeType, evt){
    var elements = ['play-info', 'effect-info', 'sample-info', 'sleep-info'], i;
    switch (nodeType){
        case 'playNode':
            for (i = 0; i < elements.length; i++){
                if (elements[i] === 'play-info'){
                    
                    document.getElementById("note").value = document.getElementById("noteInput").value = node.note;
                    document.getElementById("wave-type").value = node.wave;
                    document.getElementById("duration").value = document.getElementById("durationInput").value = node.duration;
                    document.getElementById("attack").value = document.getElementById("attackInput").value = node.attack;
                    document.getElementById("release").value = document.getElementById("releaseInput").value = node.release;
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
    }

    if (nodeType === 'effectNode'){
        if (evt === 'selected'){
            document.getElementById('node-name').innerHTML = "This is an "+ nodeType;
        } else {
            document.getElementById('node-name').innerHTML = "You added an "+ nodeType;
        }
         
    } else if (nodeType === 'startNode'){
        document.getElementById('node-name').innerHTML = "This is the "+ nodeType + ". <br><br> Connect other nodes to it to start playing.";
    }else {
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
	var elements = ["effect-echo", "effect-reverb", "effect-distortion", "effect-pingpong"];
	switch (value){
		case 'echo':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-echo'){
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
		case 'reverb':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-reverb'){
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
		case 'distortion':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-distortion'){
                    document.getElementById(elements[i]).style.display = 'block';
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
		case 'pingpong':
		for (i = 0; i < elements.length; i++){
                if (elements[i] === 'effect-distortion'){
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
document.getElementById("attack").oninput = document.getElementById("attackInput").oninput = function(){
    canvas.getActiveObject().attack = this.value;
};
document.getElementById("release").oninput = document.getElementById("releaseInput").oninput = function(){
    canvas.getActiveObject().release = this.value;
};
// document.getElementById("effect-name").oninput = function(){
//     canvas.getActiveObject().effect = this.value;
// };
// document.getElementById("roomSize").oninput = function(){
//     canvas.getActiveObject().roomSize = this.value;
// };
// document.getElementById("dampening").oninput = function(){
//     canvas.getActiveObject().dampening = this.value;
// };
// document.getElementById("distortion").oninput = function(){
//     canvas.getActiveObject().distortion = this.value;
// };

// // $(document).ready(function(){
// //         $('#oversample input[type=radio]').click(function(){
// //             alert(this.value);
// //         });
// //     });

// document.getElementById("delay").oninput = function(){
//     canvas.getActiveObject().delay = this.value;
// };
document.getElementById("sample").oninput = function(){
    canvas.getActiveObject().sample = this.value;
};
document.getElementById("loop").onclick = function(){
    canvas.getActiveObject().loop = this.checked;
};
document.getElementById("sleep").oninput = document.getElementById("sleepInput").oninput= function(){
    canvas.getActiveObject().duration = this.value;
};


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