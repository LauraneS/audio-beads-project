function SleepNode(coords){

	// var sleepGroup = new (fabric.Group)([sleep, hand1, hand2],{
	// 	left: coords.x, 
	// 	top: coords.y,
	// 	type:'sleepNode',
	// 	ID: guid(),
	// 	parentNode: [],
	// 	parentType: '',
	// 	intersected: false,
	// 	children: [],
	// 	duration: document.getElementById("sleep").value
	// })

	var sleepGroup = Node('sleepNode', coords, true, true);
	sleepGroup.duration = document.getElementById("sleep").value;
	
	fabric.Image.fromURL('/png/sleep.png', function(oImg){
		oImg.scale(0.5);
	 sleepGroup.add(oImg.set({left: -oImg.getWidth()/2, top:-oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(sleepGroup); 
}