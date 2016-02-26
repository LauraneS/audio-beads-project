function SleepNode(coords){
	var sleep = new fabric.Circle({radius: 30, left:0, stroke:'grey', fill:''});
	
	sleepCenter = sleep.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 10, height: 10, angle: -180, left: sleepCenter.x + 5, fill:'', stroke:'black'
	});

	var hand2 = new fabric.Triangle({
		width: 10, height: 10,  angle: -180, top: 71, left: sleepCenter.x + 5, fill:'', stroke:'black'
	});

	var sleepGroup = new (fabric.Group)([sleep, hand1, hand2],{
		left: coords.x, 
		top: coords.y,
		type:'sleepNode',
		ID: guid(),
		parentNode: [],
		parentType: '',
		intersected: false,
		children: [],
		duration: document.getElementById("sleep").value
	})

	fabric.Image.fromURL('/png/sleep.png', function(oImg){
		oImg.scale(0.5);
	 sleepGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(sleepGroup); 
}