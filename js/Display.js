//Drag and drop to create a new node
function dragStart(ev) {
    ev.dataTransfer.effectAllowed='move';
    ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
    ev.dataTransfer.setDragImage(ev.target,0,0);
    console.log("dragstart");
    return true;
}
function dragEnter(ev) {
    event.preventDefault();
    console.log("dragenter");
    return true;
}
         
function dragOver(ev) {
    console.log("dragover");
    return false;
}
         
function dragDrop(ev) {
    var src = ev.dataTransfer.getData("Text");
    console.log(src);
    console.log("drop");
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
            break;
    }
    ev.stopPropagation();
    return false;
}

//Display the correct parameters depending on effect chosen
document.getElementById("effect-name").oninput = function(){
	var value = document.getElementById("effect-name").value;
	console.log(value);
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