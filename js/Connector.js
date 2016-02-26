function Connector(parentCoords, width, height){
	return new fabric.Triangle({
		width: width, height: height, angle: -180, left: parentCoords.x + this.width/2, fill:'', stroke:'black'
	});

}