var label, value, dur;
function TempoNode(){
	label = new fabric.Text('tempo:', {
		top: 2,
		left:2, 
		fontSize: 20,
		hasBorders: false,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,

	});

	value = new fabric.IText('60',{
		top: label.top,
		left: label.left + label.getWidth(),
		fontSize: 20,
		hasControls: false, 
        hasBorders: false
	});

	canvas.add(label, value);
	value.on('editing:exited', function(){
		dur= 60000/parseInt(value.getText());
		animateBead(bead, dur);
		
	});
}