function SleepNode(coords){
	var sleep = new fabric.Circle({radius: 20, left:0, stroke:'grey', fill:''});
	
	sleepCenter = sleep.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 5, height: 5, top:-5, angle: -180, left: sleepCenter.x + 2.5, top: 0.9, fill:'', stroke:'black'
	});

	var hand2 = new fabric.Triangle({
		width: 5, height: 5,  angle: -180, top: 46, left: sleepCenter.x + 2.5, fill:'', stroke:'black'
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

//TODO: add relevant immage here 
	// fabric.Image.fromURL('', function(oImg){
	// 	oImg.scale(0.35);
	//  sleepGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
	// 	canvas.renderAll();
	// })
	canvas.add(sleepGroup); 
}