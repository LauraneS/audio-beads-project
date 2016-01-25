function StartNode(){
	var start = new fabric.Circle({radius: 20, originX: 'center',
		originY: 'center', stroke:'black', fill:''});
	
	startCenter = start.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 5, height: 5, angle: -90, left: 20, top: startCenter.y + 2.5, fill:'', stroke:'black'
	});

	var startText = new fabric.Text('START', {
		fontSize: 10, 
		fontFamily: 'Trebuchet MS',
		originX: 'center',
		originY: 'center'
	})

	var startGroup = new fabric.Group([start, hand1, startText],{
		left: 15,
		top: canvas.getHeight()/2 - 10,
		type: 'startNode',
		ID: guid(),
		children: [],
		lockMovementX: true,
		lockMovementY: true
	})

	canvas.add(startGroup); 
}