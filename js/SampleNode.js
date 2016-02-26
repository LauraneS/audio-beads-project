function SampleNode(coords){
	var samp = document.getElementById('sample');
	var sampleGroup = Node('sampleNode', coords, true, true);
	sampleGroup.sample = samp.options[samp.selectedIndex].value;
	sampleGroup.loop = document.getElementById("loop").checked;

	fabric.Image.fromURL('/png/file.png', function(oImg){
		oImg.scale(0.7);
		sampleGroup.add(oImg.set({left: -oImg.getWidth()/2, top: -oImg.getHeight()/2}));
		canvas.renderAll();
	})
	canvas.add(sampleGroup); 
}
