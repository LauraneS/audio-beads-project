function StartNode(coords){
	
	var startGroup = Node('startNode', coords, false, true);
	startGroup.item(0).set({stroke:'black'});
	startGroup.lockMovementX = true;
	startGroup.lockMovementY = true;
	startGroup.parentNode = [0];

	var startText = new fabric.Text('START', {
		fontSize: 10, 
		fontFamily: 'Trebuchet MS',
		originX: 'center',
		originY: 'center'
	})

	startGroup.add(startText);


	// var startGroup = new fabric.Group([start, hand1, startText],{
	// 	top: 15,
	// 	left: canvas.getWidth()/2 - 15,
	// 	type: 'startNode',
	// 	ID: guid(),
	// 	children: [],
	// 	lockMovementX: true,
	// 	lockMovementY: true, 
	// 	parentNode: [0]
	// })

	canvas.add(startGroup); 
}
