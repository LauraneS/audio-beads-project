function SleepNode(coords){

	var sleepGroup = Node('sleepNode', coords, 30, true, true);
	sleepGroup.item(0).set({stroke:'grey'});
	sleepGroup.duration = document.getElementById("sleep").value;
	
	fabric.Image.fromURL('/png/sleep.png', function(oImg){
		oImg.scale(0.5);
	 sleepGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(sleepGroup); 

	sleepGroup.on('mouseup', function(){
		if (sleepGroup.intersected){
			canvas.forEachObject(function(obj){
				if (obj.ID === sleepGroup.parentNode[0] && !sleepGroup.intersectsWithObject(obj)){
					sleepGroup.intersected = false;
					sleepGroup.parentNode.pop();
				}
			})
		}
	});
}