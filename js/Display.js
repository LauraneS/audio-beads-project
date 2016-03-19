var lastDeleted;
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
        case 'condImg':
            CondNode(pointer);
            break;
    }
    var lastObject = lastAdded[lastAdded.length - 1];
    canvas.setActiveObject(lastObject);
    ev.stopPropagation();
    return false;
}
var ongoing;
function taskStart(){
    if (ongoing){
        return
    } else {
        clickCount = 0;
        delCount = 0;
        startTime = undefined;
        endTime = undefined;
        ongoing = true;
        //load new task
        //reset mouse clicks and deletion counters
        startTime = new Date().getTime();
        console.log(startTime);
        document.getElementById("taskStart").innerHTML = "Started";
        $('#taskStart').attr('style', 'margin-left:15px;background-color: grey');
        $('#taskFinish').attr('style', 'margin-left:5px;background-color: white');
    }
}

function taskFinish(){
    if (ongoing){
        endTime = new Date().getTime();
        var elapsedT = (endTime-startTime)/1000;
        //CSV
        data.push([userID, taskS, elapsedT, clickCount, delCount]);
        //8 tasks timed by the system
        if(taskS === taskF){
            data.forEach(function(infoArray, index){
                dataString = infoArray.join(",");
                csvContent += index < data.length ? dataString+ "\n" : dataString;

            }); 
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            var title = "user" + userID + "task"+taskS+"_data.csv";
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", title);

            document.getElementById("taskNbr").innerHTML = "Done!";
            setTimeout(function(){link.click();}, 5000);
            $('#taskFinish').attr('style', 'margin-left:5px;background-color: grey');
            $('#taskStart').attr('style', 'margin-left:15px; background-color: grey');
            $('#taskFinish').onclick = function(){
                return false;
            }
            $('#taskStart').onclick = function(){
                return false;
            }

        } else {
            data.forEach(function(infoArray, index){
                dataString = infoArray.join(",");
                csvContent += index < data.length ? dataString+ "\n" : dataString;

            }); 
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            var title = "user" + userID + "task" + taskS+ "_data.csv"
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", title);

            setTimeout(function(){link.click();}, 60000);
             taskS++;
            document.getElementById("taskNbr").innerHTML = "Task "+ taskS;
            document.getElementById("taskStart").innerHTML = "Start";
            $('#taskFinish').attr('style', 'margin-left:5px; background-color: grey');
            $('#taskStart').attr('style', 'margin-left:15px; background-color: white');
            ongoing = false;
        }
        
        // if (last Task){
            // data.forEach(function(infoArray, index){
            //     dataString = infoArray.join(",");
            //     csvContent += index < data.length ? dataString+ "\n" : dataString;

            // }); 
            // var encodedUri = encodeURI(csvContent);
            // var link = document.createElement("a");
            // var title = "user" + userID + "_data.csv"
            // link.setAttribute("href", encodedUri);
            // link.setAttribute("download", title);

            // link.click();
            //document.getElementById("taskNbr").innerHTML = "Done!";
        // }
        // else 
        
    } else {
        return
    }
}

function displayNothing(){
    canvas.forEachObject(function(obj){
        if (obj.type === 'line'){
            obj.setShadow(null);
        } else {
            obj.removeShadow();
        }
    });
    document.getElementById("node-name").style.color = 'black';
    var elements = ['play-info', 'sample-info', 'sleep-info', 'line-info', 'loop-info', 'cond-info'], i;
    for (i= 0; i < elements.length; i++){
        document.getElementById(elements[i]).style.display = 'none';
    }
    document.getElementById('node-name').innerHTML = "Not sure what to do next? <br><br> Some suggestions:<br>  - Add a new node <br> - Connect 2 nodes <br> - Press Play";    
}
//Display relevant parameters
function displayParam(node, nodeType, evt){
    canvas.forEachObject(function(obj){
        if (obj === node && nodeType === 'line'){
            obj.setShadow({
                color: obj.stroke,
                blur: 10,    
                offsetX: 0,
                offsetY: 0,
                opacity: 1,
                fillShadow: true, 
                strokeShadow: true 
            });
        } else if (obj === node && nodeType !== 'line'){
            try{
                obj.addShadow();
            } catch(err){
                console.log(err);
            }
            
        } else {
            if (obj.type === 'line'){
                obj.setShadow(null);
            } else {
                obj.removeShadow();
            }
        }
    });
    document.getElementById("node-name").style.color = 'black';
    var elements = ['play-info', 'sample-info', 'sleep-info', 'line-info', 'loop-info', 'cond-info'], i;
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
        case 'condition':
            for (i = 0; i < elements.length; i++){
                if (elements[i] === 'cond-info'){
                    document.getElementById(elements[i]).style.display = 'block';
                    document.getElementById("condition").value = node.condition;
                    var elt = ["mouse-event", "key-event", "rand-event"], j;
                    switch(node.condition){
                        case 'mouse':
                            for (j = 0; j < elt.length; j++){
                                if (elt[j] === 'mouse-event'){
                                    document.getElementById(elt[j]).style.display = 'block';
                                    document.getElementById("down-up").value = canvas.getActiveObject().mouse;
                                } else {
                                    document.getElementById(elt[j]).style.display = 'none';
                                }
                            }
                            break;
                        case 'key':
                            for (j = 0; j < elt.length; j++){
                                if (elt[j] === 'key-event'){
                                    document.getElementById(elt[j]).style.display = 'block';
                                    document.getElementById("whichkey").value = canvas.getActiveObject().key;
                                } else {
                                    document.getElementById(elt[j]).style.display = 'none';
                                }
                            }
                            break;
                        case 'rand':
                            for (j = 0; j < elt.length; j++){
                                if (elt[j] === 'rand-event'){
                                    document.getElementById(elt[j]).style.display = 'block';
                                    document.getElementById("aInput").value = canvas.getActiveObject().rand[0];
                                    document.getElementById("bInput").value = canvas.getActiveObject().rand[1];
                                    document.getElementById("comp").value = canvas.getActiveObject().rand[2];
                                    document.getElementById("cInput").value = canvas.getActiveObject().rand[3];
                                } else {
                                    document.getElementById(elt[j]).style.display = 'none';
                                }
                            }
                            break;
                    }
                } else {
                    document.getElementById(elements[i]).style.display = 'none';
                }
            }
            break;
    }
    if (evt === 'selected'){
        switch (nodeType){
            case 'startNode':
                document.getElementById('node-name').innerHTML = "This is the Start bead. <br><br> Connect other nodes to it to start playing.";
                break;
            case 'playNode':
                document.getElementById('node-name').innerHTML = "This is a Note bead.";
                break;
            case 'sleepNode':
                document.getElementById('node-name').innerHTML = "This is a Sleep bead.";
                break;
            case 'sampleNode':
                document.getElementById('node-name').innerHTML = "This is a Sample bead.";
                break;
            case 'loop':
                document.getElementById('node-name').innerHTML = "This is a Loop.";
                break;
            case 'condition':
                document.getElementById('node-name').innerHTML = "This is a Condition.";
                break;
            case 'line':
                document.getElementById('node-name').innerHTML = "This is a line.";
                break;
        }
        
    } else {
        switch (nodeType){
            case 'playNode':
                document.getElementById('node-name').innerHTML = "You added a Note bead.";
                break;
            case 'sleepNode':
                document.getElementById('node-name').innerHTML = "You added a Sleep bead.";
                break;
            case 'sampleNode':
                document.getElementById('node-name').innerHTML = "You added a Sample bead.";
                break;
            case 'loop':
                document.getElementById('node-name').innerHTML = "You added a Loop.";
                break;
            case 'condition':
                document.getElementById('node-name').innerHTML = "You added a Condition.";
                break;
            case 'line':
                document.getElementById('node-name').innerHTML = "You added a line.";
                break;
        }
    }
}

//Listen for changes on Play parameters
document.getElementById("note").oninput = document.getElementById("noteInput").oninput = function(){
    canvas.getActiveObject().note = this.value;
    smtgChanged = true;
};
document.getElementById("duration").oninput = document.getElementById("durationInput").oninput= function(){
    canvas.getActiveObject().duration = this.value;
    smtgChanged = true;
};
document.getElementById("wave-type").oninput = function(){
    canvas.getActiveObject().wave = this.value;
    smtgChanged = true;
};

//Listen for changes on Sample parameters
document.getElementById("sample").onchange = function(){
    canvas.getActiveObject().sample=this.options[this.selectedIndex].value;
    smtgChanged = true;
};
document.getElementById("loop").onchange = function(){
    canvas.getActiveObject().loop = this.checked;
    smtgChanged = true;
};

//Listen for changes on Sleep parameters
document.getElementById("sleep").oninput = document.getElementById("sleepInput").oninput= function(){
    canvas.getActiveObject().duration = this.value;
    smtgChanged = true;
};

//Listen for change on Loop parameters
document.getElementById("iteration").onchange = function(){
    canvas.getActiveObject().iteration = this.options[this.selectedIndex].value;
    smtgChanged = true;
    var value = this.value;
    if (this.value === "x"){
        document.getElementById("xtimes-nbr").style.display = 'block';
        canvas.getActiveObject().x = document.getElementById("xInput").value;
    } else {
        document.getElementById("xtimes-nbr").style.display = "none";
    }
}
document.getElementById("xInput").oninput = function(){
    canvas.getActiveObject().x = this.value;
    smtgChanged = true;
}

//Listen for changes on Condition parameters
document.getElementById("condition").onchange = function(){
    canvas.getActiveObject().condition = this.options[this.selectedIndex].value;
    console.log( canvas.getActiveObject().condition);
    smtgChanged = true;
    var value = this.value;
    var el = ["mouse-event", "key-event", "rand-event"], i;

    switch(value){
        case 'mouse':
            canvas.getActiveObject().item(4).setElement(Image1);
            canvas.getActiveObject().item(4).setTop(-8);
            canvas.renderAll();
            for (i = 0; i < el.length; i++){
                if (el[i] === 'mouse-event'){
                    document.getElementById(el[i]).style.display = 'block';
                    document.getElementById("down-up").options[document.getElementById("down-up").selectedIndex].value = "up";
                } else {
                    document.getElementById(el[i]).style.display = 'none';
                }
            }
            break;
        case 'key':
            canvas.getActiveObject().item(4).setElement(Image2);
            canvas.getActiveObject().item(4).setTop(-4);
            canvas.renderAll();
            for (i = 0; i < el.length; i++){
                if (el[i] === 'key-event'){
                    document.getElementById(el[i]).style.display = 'block';
                    document.getElementById("whichkey").options[document.getElementById("whichkey").selectedIndex].value = "65";
                } else {
                    document.getElementById(el[i]).style.display = 'none';
                }
            }
            break;
        case 'rand':
             canvas.getActiveObject().item(4).setElement(Image3);
            canvas.getActiveObject().item(4).setTop(-4);
            canvas.renderAll();
            for (i = 0; i < el.length; i++){
                if (el[i] === 'rand-event'){
                    document.getElementById(el[i]).style.display = 'block';
                    document.getElementById("aInput").value = "0";
                    document.getElementById("bInput").value = "5";
                    document.getElementById("comp").value = "more";
                    document.getElementById("cInput").value = "3";
                } else {
                    document.getElementById(el[i]).style.display = 'none';
                }
            }
            break;
    }
}
document.getElementById("down-up").onchange = function(){
    smtgChanged = true;
    canvas.getActiveObject().mouse = this.options[this.selectedIndex].value;
}
document.getElementById("whichkey").onchange = function(){
    smtgChanged = true;
    canvas.getActiveObject().key = this.options[this.selectedIndex].value;
}
document.getElementById("comp").onchange = function(){
    smtgChanged = true;
    canvas.getActiveObject().rand[2] = this.options[this.selectedIndex].value;
}
document.getElementById("aInput").onchange = function(){
    smtgChanged = true;
    canvas.getActiveObject().rand[0] = this.value;
}
document.getElementById("bInput").onchange = function(){
    smtgChanged = true;
    canvas.getActiveObject().rand[1] = this.value;
}
document.getElementById("cInput").onchange = function(){
    smtgChanged = true;
    canvas.getActiveObject().rand[3] = this.value;
}


//Listen for changes on line deletion
document.getElementById("delete-line").onchange = function(){
    if (this.options[this.selectedIndex].value === 'yes'){
        canvas.getActiveObject().addChildRemove();
        canvas.remove(canvas.getActiveObject());
        document.getElementById("node-name").innerHTML = "The line has been deleted.";
        document.getElementById('line-info').style.display = 'none';
        delCount++;
        smtgChanged = true;
    }
}

//On window resize
window.addEventListener('resize', function(){
    canvas.setHeight(window.innerHeight*0.92);
    canvas.setWidth(wrapper.offsetWidth);
    canvas.item(0).set({left:canvas.getWidth()/2 - 30, top: 15}).setCoords();
    canvas.renderAll();
})

//Deleting objects
document.getElementById('delete').onmouseup = function(){
    var actObject = canvas.getActiveObject();
    if (actObject.type === 'line'){
        actObject.addChildRemove();
        canvas.remove(actObject);
        canvas.renderAll();
        delCount++;
        smtgChanged = true;
        return
    }

    //Deleting lines (if any) connected to the node
    if (actObject.addChild) {
        if (actObject.addChild.from)
            // step backwards since we are deleting
            for (var i = actObject.addChild.from.length - 1; i >= 0; i--) {
                var line = actObject.addChild.from[i];
                line.addChildRemove();
                canvas.remove(line);
                delCount++;
            }
        if (actObject.addChild.to)
            for (var i = actObject.addChild.to.length - 1; i >= 0; i--) {
                var line = actObject.addChild.to[i];
                line.addChildRemove();
                canvas.remove(line);
                delCount++;
            }
    }
    lastDeleted = actObject;
    canvas.remove(actObject);
    canvas.renderAll();
    delCount++;
    smtgChanged = true;
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
    smtgChanged = true;

    
    select_id.onchange = function(){ 
        var value = $(this).val();
        canvas.getActiveObject().setEffect(parseInt(this.id.charAt(7)),value);
        smtgChanged = true;
    };
    var button_id = document.getElementById("buttonfx-"+effectClicks);
    button_id.onclick = function(){
        var i = parseInt(this.id.charAt(9));
        var d = div.substr(1,div.length);
        remEffect(i, d);
        smtgChanged = true;
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
            smtgChanged = true;
        };
        var button_id = document.getElementById("buttonfx-"+nbr);
        button_id.onclick = function(){
            var i = parseInt(this.id.charAt(9));
            var d = div.substr(1,div.length);
            remEffect(i, d);
            smtgChanged = true;
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
    smtgChanged = true;
    effectClicks--;   
}

function undelete(){
    try{
        lastDeleted.set({
            left:canvas.getWidth()/2-lastDeleted.getWidth()/2, 
            top:canvas.getHeight()-lastDeleted.getHeight()/2 - 120, 
            parentNode:[], 
            parentType:'',
            intersected:false,
            loopParent:''
        });
        canvas.add(lastDeleted);
        lastDeleted = undefined;
    } catch (err){
        console.log("Nothing to undelete.");
    }
    
}

function clearCanvas(){
    canvas.clear();
    StartNode({x:canvas.getWidth()/2 - 30, y: 15});
}

// var isDClicked = false;

// $(document).ready(function(){
//   $('.buttons').dblclick(function(e){
//     e.preventDefault();
//   });
// });
// //Adding double click event listener (not supported by fabric.js)
// window.addEventListener('dblclick', function (e, self) {
//     canvas.setZoom(3);
// });



