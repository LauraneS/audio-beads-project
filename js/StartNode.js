function StartNode(){
	var start = new fabric.Circle({radius: 20, originX: 'center',
		originY: 'center', stroke:'black', fill:''});
	
	startCenter = start.getCenterPoint();
	
	var hand1 = new fabric.Triangle({
		width: 5, height: 5, angle: -180, top: 26, left: startCenter.x + 2.5, fill:'', stroke:'black'
	});

	var startText = new fabric.Text('START', {
		fontSize: 10, 
		fontFamily: 'Trebuchet MS',
		originX: 'center',
		originY: 'center'
	})

	var startGroup = new fabric.Group([start, hand1, startText],{
		top: 15,
		left: canvas.getWidth()/2 - 10,
		type: 'startNode',
		ID: guid(),
		children: [],
		lockMovementX: true,
		lockMovementY: true, 
		parentNode: [0]
	})

	canvas.add(startGroup); 
}