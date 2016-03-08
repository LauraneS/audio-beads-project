function StartNode(coords){
	
	var startGroup = Node('startNode', coords, 30, false, true);
	startGroup.lockMovementX = true;
	startGroup.lockMovementY = true;
	startGroup.parentNode = [0];

	var startText = new fabric.Text('START', {
		fontSize: 14, 
		fontFamily: 'Trebuchet MS',
		originX: 'center',
		originY: 'center'
	})

	startGroup.add(startText.set({top:-4}));
	canvas.add(startGroup); 
}
