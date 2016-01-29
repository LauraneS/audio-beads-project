function SleepNode(){
	var sleep = new fabric.Circle({radius: 20, left:0, stroke:'grey', fill:''});
	
	sleepCenter = sleep.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 5, height: 5, angle: 90, left:0, top: sleepCenter.y - 2.5, fill:'', stroke:'black'
	});

	var hand2 = new fabric.Triangle({
		width: 5, height: 5, angle: -90, left: 41.5, top: sleepCenter.y + 2.5, fill:'', stroke:'black'
	});

	var sleepGroup = new (fabric.Group)([sleep, hand1, hand2],{
		left: fabric.util.getRandomInt(0, canvas.getWidth() + 1), 
		top: fabric.util.getRandomInt(0, canvas.getHeight() + 1),
		type:  'sleepNode',
		ID: guid(),
		parentNode: [],
		children: [],
		duration: document.getElementById("sleep").value
	})

//TODO: add relevant immage here 
	fabric.Image.fromURL('', function(oImg){
		oImg.scale(0.35);
	 sleepGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(sleepGroup); 
}