function Node(type, coords, topArrow, bottomArrow){
	this.type = type;

	var c = new fabric.Circle({radius: 30, left:0, stroke:'red', fill:''});
	var cCenter = c.getCenterPoint();
	var hand1, hand2;
	
		hand1 = new fabric.Triangle({
			width: 10, height: 10, angle: -180, left: cCenter.x + 5, fill:'', stroke:'black'
		});

		hand2 = new fabric.Triangle({
			width: 10, height: 10, angle: -180, top: 71, left: cCenter.x + 5, fill:'', stroke:'black'
		});
	var group = new fabric.Group([c, hand1, hand2],{
			left: coords.x,
			top:coords.y,
			type: type,
			parentType: '',
			ID: guid(),
			parentNode: [],
			children: [],
			intersected: false
	});
	if (!topArrow){
		group = new fabric.Group([c, hand2],{
			left: coords.x,
			top:coords.y,
			type: type,
			parentType: '',
			ID: guid(),
			parentNode: [],
			children: [],
			intersected: false
		}); 
	}

	group.contains = function(point){
	    var x = point.x;
	    var y = point.y;
	    var center_x = group.getCenterPoint().x;
	    var center_y = group.getCenterPoint().y;
	    if ( Math.pow(x-center_x,2) + Math.pow(y-center_y,2) < 900){
	    	console.log("Inside circle");
	        return true;
	    }
	}
	group.containsTopArrow = function(point){
		if (!topArrow) return;
		
	    var x = point.x;
	    var y = point.y;
	    var test = hand1.getCenterPoint();
	    var local = toLocalPoint(test,'left' , 'top');
	    console.log(local);
	    // var center_x = hand1.getCenterPoint().x;
	    // var center_y = hand1.getCenterPoint().y;
	    // var left = hand1.getLeft();
	    // var top = hand1.getTop();
	    // var width = hand1.getWidth();
	    // var height = hand1.getHeight();
	    // var tv = {x: center_x, y:center_y+height/2};
	    // var lv = {x: center_x - width/2, y:center_y-height/2};
	    // var rv = {x: center_x + width/2, y:center_y-height/2};
	    
	    // var b1 = (x - lv.x) * (tv.y - lv.y) - (tv.x - lv.x) * (y - lv.y) < 0.0;
	    // var b2 = (x - rv.x) * (lv.y - rv.y) - (lv.x - rv.x) * (y - rv.y) < 0.0;
	    // var b3 = (x - tv.x) * (rv.y - tv.y) - (rv.x - tv.x) * (y - tv.y) < 0.0;
	    // if ((b1 == b2) && (b2 == b3)){
	    // 	console.log('Top arrow: true');
	    // 	return true;
	    // }
	    return false;
	}

	group.containsBottomArrow = function(point){
		if (!bottomArrow) return;
	    var x = point.x;
	    var y = point.y;
	    var box = hand2.getBoundingRect();
	    if( box.left < x && x < box.left + box.width && box.top < y && y < box.top+box.height){
	    	console.log("Bottom Arrow: true");
	    	return true;
	    } 
	    return false;
	}
	return group;
}
