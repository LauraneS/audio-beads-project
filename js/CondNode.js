function CondNode(coords){
	var c = new fabric.Triangle({width:30, height:20, left:0, stroke:'#CC0063', fill:'white'});
	var cCenter = c.getCenterPoint();
	var hand1, hand2, hand3;
		
		//Left
		hand1 = new fabric.Triangle({
			width:10, height: 10, angle: -90, top: c.height, fill:'', stroke:'black'
		});
		//Right
		hand2 = new fabric.Triangle({
			width: 10, height: 10, angle: 90, top: c.height, left: c.width, fill:'', stroke:'black'
		});
		//Top
		hand3 = new fabric.Triangle({
			width:10, height:10, angle: 180, left: cCenter.x + c.height, fill:'', stroke: 'black'
		});
	var group = new fabric.Group([c, hand1, hand2, hand3],{
			left: coords.x,
			top:coords.y,
			type: type,
			parentType: '',
			ID: guid(),
			parentNode: [],
			loopParent: '',
			children: [],
			intersected: false, 
	});

	group.getAbsCenter = function(){
		return group.getCenterPoint();
	}

	group.containsTopArrow = function(point){
	    var x = point.x;
	    var y = point.y;
	    var absCenterX = hand3.group.getCenterPoint().x + hand3.getCenterPoint().x;
	    var absCenterY = hand3.group.getCenterPoint().y + hand3.getCenterPoint().y;
	    var width = hand3.getWidth();
	    var height = hand3.getHeight();
	    var bv = {x: absCenterX, y:absCenterY+height/2};
	    var lv = {x: absCenterX - width/2, y:absCenterY-height/2};
	    var rv = {x: absCenterX + width/2, y:absCenterY-height/2};

	    var b1 = (x - lv.x) * (bv.y - lv.y) - (bv.x - lv.x) * (y - lv.y) < 0.0;
	    var b2 = (x - rv.x) * (lv.y - rv.y) - (lv.x - rv.x) * (y - rv.y) < 0.0;
	    var b3 = (x - bv.x) * (rv.y - bv.y) - (rv.x - bv.x) * (y - bv.y) < 0.0;
	    if ((b1 == b2) && (b2 == b3)){
	    	return true;
	    }
	    return false;
	}

	group.containsLeftArrow = function(point){
	    var x = point.x;
	    var y = point.y;
	    var absCenterX = hand1.group.getCenterPoint().x + hand1.getCenterPoint().x;
	    var absCenterY = hand1.group.getCenterPoint().y + hand1.getCenterPoint().y;
	    var width = hand1.getWidth();
	    var height = hand1.getHeight();
	    var bv = {x: absCenterX, y:absCenterY+height/2};
	    var lv = {x: absCenterX - width/2, y:absCenterY-height/2};
	    var rv = {x: absCenterX + width/2, y:absCenterY-height/2};

	    var b1 = (x - lv.x) * (bv.y - lv.y) - (bv.x - lv.x) * (y - lv.y) < 0.0;
	    var b2 = (x - rv.x) * (lv.y - rv.y) - (lv.x - rv.x) * (y - rv.y) < 0.0;
	    var b3 = (x - bv.x) * (rv.y - bv.y) - (rv.x - bv.x) * (y - bv.y) < 0.0;
	    if ((b1 == b2) && (b2 == b3)){
	    	return true;
	    }
	    return false;
	}

	group.containsRightArrow = function(point){
	    var x = point.x;
	    var y = point.y;
	    var absCenterX = hand2.group.getCenterPoint().x + hand2.getCenterPoint().x;
	    var absCenterY = hand2.group.getCenterPoint().y + hand2.getCenterPoint().y;
	    var width = hand2.getWidth();
	    var height = hand2.getHeight();
	    var bv = {x: absCenterX, y:absCenterY+height/2};
	    var lv = {x: absCenterX - width/2, y:absCenterY-height/2};
	    var rv = {x: absCenterX + width/2, y:absCenterY-height/2};

	    var b1 = (x - lv.x) * (bv.y - lv.y) - (bv.x - lv.x) * (y - lv.y) < 0.0;
	    var b2 = (x - rv.x) * (lv.y - rv.y) - (lv.x - rv.x) * (y - rv.y) < 0.0;
	    var b3 = (x - bv.x) * (rv.y - bv.y) - (rv.x - bv.x) * (y - bv.y) < 0.0;
	    if ((b1 == b2) && (b2 == b3)){
	    	return true;
	    }
	    return false;
	}
}