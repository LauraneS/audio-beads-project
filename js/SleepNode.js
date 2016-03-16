function SleepNode(coords){

	var sleepGroup = Node('sleepNode', coords, 30, true, true);
	sleepGroup.item(0).set({stroke:'grey'});
	sleepGroup.duration = document.getElementById("sleep").value;
	sleepGroup.shadow = {
		    color: '#6B6B6B',
		    blur: 30,    
		    offsetX: 0,
		    offsetY: 0,
		    opacity: 1,
		    fillShadow: true, 
		    strokeShadow: true 
	};
	
	fabric.Image.fromURL('sleep.png', function(oImg){
		oImg.scale(0.5);
	 sleepGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(sleepGroup); 

	sleepGroup.on('moving', function(){
		if (sleepGroup.intersected){
			canvas.forEachObject(function(obj){
				if (obj.ID === sleepGroup.loopParent && !sleepGroup.intersectsWithObject(obj)){
					sleepGroup.intersected = false;
					sleepGroup.loopParent = '' ;
					sleepGroup.findHands();
				}
			})
		} else {
			var on = false
			canvas.forEachObject(function(obj){
				if (obj.type === 'loop' && sleepGroup.intersectsWithObject(obj)){
					on = true;
					console.log(on);
				}
				if (!on){
					displayParam(sleepGroup, 'sleepNode', 'selected');
				} else {
					displayNothing();
                	document.getElementById("node-name").style.color = 'red';
                	document.getElementById("node-name").innerHTML ="This node cannot be part of the loop because it is already tied to other nodes.";
				}
			});
		}
	});
}