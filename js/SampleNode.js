function SampleNode(coords){
	var samp = document.getElementById('sample');
	var sampleGroup = Node('sampleNode', coords, 30, true, true);
	sampleGroup.item(0).set({stroke:'#00AE8F'});
	sampleGroup.sample = samp.options[samp.selectedIndex].value;
	sampleGroup.loop = document.getElementById("loop").checked;
	sampleGroup.effects = [];
	sampleGroup.shadow = {
		    color: '#00AE8F',
		    blur: 30,    
		    offsetX: 00,
		    offsetY: 0,
		    opacity: 0.4,
		    fillShadow: true, 
		    strokeShadow: true 
	};

	fabric.Image.fromURL('/png/samplefile.png', function(oImg){
		oImg.scale(0.6);
		sampleGroup.add(oImg.set({left: -oImg.getWidth()/2, top: -oImg.getHeight()/2 + 1}));
		canvas.renderAll();
	})
	canvas.add(sampleGroup); 
	
	sampleGroup.setEffect = function (number, value){
		var fxLength = sampleGroup.effects.length;
		if (number < fxLength){
			sampleGroup.effects[number] = value;
		} else {
			sampleGroup.effects.push(value);
		}
		sampleGroup.item(0).set({stroke:'#00D2F1'});
		sampleGroup.shadow.color = '#00D2F1';
		sampleGroup.addShadow();
    	canvas.renderAll();
	}
	sampleGroup.delEffect = function (number){
		sampleGroup.effects.splice(number,1);
		if (sampleGroup.effects === undefined || sampleGroup.effects.length === 0){
			sampleGroup.item(0).set({stroke:'#00AE8F'});
			sampleGroup.shadow.color = '#00AE8F';
			sampleGroup.addShadow();
    		canvas.renderAll();
		}
	}

	sampleGroup.on('moving', function(){
		if (sampleGroup.intersected){
			canvas.forEachObject(function(obj){
				if (obj.ID === sampleGroup.loopParent && !sampleGroup.intersectsWithObject(obj)){
					sampleGroup.intersected = false;
					sampleGroup.loopParent = '';
					sampleGroup.findHands();
				}
			})
		}
	});
}
