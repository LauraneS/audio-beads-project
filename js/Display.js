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
    var pointer = canvas.getPointer(ev.e)
    var src = ev.dataTransfer.getData("text");
    switch (src){
        case 'playImg':
            PlayNode(pointer);
            break;
        case 'loopImg':
            LoopNode(pointer);
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
    ev.stopPropagation();
    return false;
}

function displayNothing(){
    document.getElementById("node-name").style.color = 'black';
    var elements = ['play-info', 'sample-info', 'sleep-info', 'line-info', 'loop-info'], i;
    for (i= 0; i < elements.length; i++){
        document.getElementById(elements[i]).style.display = 'none';
    }
    document.getElementById('node-name').innerHTML = "Not sure what to do next? <br><br> Some suggestions:<br>  - Add a new node <br> - Connect 2 nodes <br> - Press Play";    
}
//Display relevant parameters
function displayParam(node, nodeType, evt){
    document.getElementById("node-name").style.color = 'black';
    var elements = ['play-info', 'sample-info', 'sleep-info', 'line-info', 'loop-info'], i;
    switch (nodeType){
        case 'playNode':
            for (i = 0; i < elements.length; i++){
                if (elements[i] === 'play-info'){
                    
                    document.getElementById("note").value = document.getElementById("noteInput").value = node.note;
                    document.getElementById("wave-type").value = node.wave;
                    document.getElementById("duration").value = document.getElementById("durationInput").value = node.duration;
                    if (node.effects.length > -1){
                        document.getElementById("play-effects").style.display ='block';
                        $( "#play-effects" ).empty();
                        for (var j = 0; j<node.effects.length; j++){
                            addEffectValue(node.effects[j], j, '#play-effects');
                        }
                    }
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
                    if (node.effects.length > -1){
                        document.getElementById("samp-effects").style.display ='block';
                        $( "#samp-effects" ).empty();
                        for (var j = 0; j<node.effects.length; j++){
                            addEffectValue(node.effects[j], j, '#samp-effects');
                        }
                    }
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
                if (elements[i] === 'loop-info'){
                    document.getElementById(elements[i]).style.display = 'block';
                    document.getElementById("iteration").value = node.iteration;
                } else {
                    document.getElementById(elements[i]).style.display = 'none'; 
                }  
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
    if (nodeType === 'startNode'){
        document.getElementById('node-name').innerHTML = "This is the "+ nodeType + ". <br><br> Connect other nodes to it to start playing.";
    } else {
        if (evt === 'selected'){
            document.getElementById('node-name').innerHTML = "This is a "+ nodeType + ".";
        } else {
            document.getElementById('node-name').innerHTML = "You added a "+ nodeType + ".";
        }
    }
}

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

document.getElementById("sample").onchange = function(){
    canvas.getActiveObject().sample=this.options[this.selectedIndex].value;
};
document.getElementById("loop").onchange = function(){
    canvas.getActiveObject().loop = this.checked;
    console.log(canvas.getActiveObject().loop);
};
document.getElementById("sleep").oninput = document.getElementById("sleepInput").oninput= function(){
    canvas.getActiveObject().duration = this.value;
};
document.getElementById("iteration").onchange = function(){
    canvas.getActiveObject().iteration = this.options[this.selectedIndex].value;
    console.log(canvas.getActiveObject().iteration);
    var value = this.value;
    if (this.value === "x"){
        document.getElementById("xtimes-nbr").style.display = 'block';
        document.getElementById("xInput").value = canvas.getActiveObject().x;
    } else {
        document.getElementById("xtimes-nbr").style.display = "none";
    }
}

document.getElementById("xInput").onchange = function(){
    canvas.getActiveObject().x = this.value;
}

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
    canvas.item(0).set({left:canvas.getWidth()/2 - 15, top: 15});
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

var effectClicks;
function addEffect(div){
    effectClicks = canvas.getActiveObject().effects.length;
    $('<p id="effect-'+effectClicks+'"><span id="effectvalue-'+effectClicks+'"> Effect ' +(effectClicks+1) +': </span> \
        <select id="effect-'+effectClicks+'-value">\
        <option value="wahwah" >Wah-Wah</option>\
        <option value="tremolo" >Tremolo</option>\
        <option value="chorus">Chorus</option>\
        <option value="pingpong">Pingpong</option>\
        </select><button id="buttonfx-'+effectClicks+'">Delete</button></p>').appendTo($(div));
    
    var select_id = document.getElementById("effect-"+effectClicks+"-value");
    
    canvas.getActiveObject().setEffect(effectClicks, select_id.options[select_id.selectedIndex].value);

    
    select_id.onchange = function(){ 
        var value = $(this).val();
        canvas.getActiveObject().setEffect(parseInt(this.id.charAt(7)),value);
    };
    var button_id = document.getElementById("buttonfx-"+effectClicks);
    button_id.onclick = function(){
        var i = parseInt(this.id.charAt(9));
        var d = div.substr(1,div.length);
        remEffect(i, d);
    }
    effectClicks++;
    return false;
}
function addEffectValue(val, nbr, div){
    $('<p id="effect-'+nbr+'"><span id="effectvalue-'+nbr+'"> Effect ' +(nbr+1) +': </span> \
        <select id="effect-'+nbr+'-value">\
        <option value="wahwah" >Wah-Wah</option>\
        <option value="tremolo" >Tremolo</option>\
        <option value="chorus">Chorus</option>\
        <option value="pingpong">Pingpong</option>\
        </select><button id="buttonfx-'+nbr+'">Delete</button></p>').appendTo($(div));
    var select_id = document.getElementById("effect-"+nbr+"-value");
        switch (val){
            case 'wahwah':
                select_id.selectedIndex = 0;
                break;
            case 'tremolo':
                select_id.selectedIndex = 1;
                break;
            case 'chorus':
                select_id.selectedIndex = 2;
                break;
            case 'pingpong':
                select_id.selectedIndex = 3;
                break;
        } 
        
        select_id.onchange = function(){ 
            var value = $(this).val();
            canvas.getActiveObject().setEffect(parseInt(this.id.charAt(7)),value);
        };
        var button_id = document.getElementById("buttonfx-"+nbr);
        button_id.onclick = function(){
            var i = parseInt(this.id.charAt(9));
            var d = div.substr(1,div.length);
            remEffect(i, d);
        }
}

function remEffect(number, div){
    effectClicks = canvas.getActiveObject().effects.length;
    var id = "effect-"+number;
    document.getElementById(div).removeChild(document.getElementById(id));
    canvas.getActiveObject().delEffect(number);
    if(number !== effectClicks){
        var i;
        for (i = number+1; i < effectClicks; i++){
            id = "effect-"+i;
            document.getElementById(id).id = "effect-"+(i-1);
            //id = "effect-"+(i-1);

            var val = "effectvalue-"+i;
            document.getElementById("effectvalue-"+i).textContent = "Effect "+(i)+": ";
            document.getElementById(val).id = "effectvalue-"+(i-1);

            var button_id = "buttonfx-"+i;
            document.getElementById(button_id).id = "buttonfx-"+(i-1);
            button_id = "buttonfx-"+(i-1);

            var select_id = "effect-"+i+"-value";
            document.getElementById(select_id).id = "effect-"+(i-1)+"-value";
            select_id = "effect-"+(i-1)+"-value";
            canvas.getActiveObject().setEffect(number,document.getElementById(select_id).options[document.getElementById(select_id).selectedIndex].value);
        }
    }
    effectClicks--;
    
}

    

