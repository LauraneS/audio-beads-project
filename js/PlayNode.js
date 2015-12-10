var LabeledCircle = fabric.util.createClass(fabric.Circle, {

	  type: 'labeledCircle',

	  initialize: function(options) {
	    options || (options = { });

	    this.callSuper('initialize', options);
	    this.set('label', options.label || '');
	  },

	  toObject: function() {
	    return fabric.util.object.extend(this.callSuper('toObject'), {
	      label: this.get('label')
	    });
	  },

	  _render: function(ctx) {
	    this.callSuper('_render', ctx);
	    ctx.font = '10px Helvetica';
	    ctx.fillStyle = '#333';
	    
	    ctx.fillText(this.label, -this.width/3-1, -this.height/2 + this.radius); //need to be less random!!
	  }
});

function PlayNode(){
	
	// var play = new fabric.loadSVGFromURL('svg/play.svg', function(objects){
	// 	var group = new fabric.PathGroup(objects, {
	// 		originX: 'center',
 //  			originY: 'center',
	// 		scaleX: 0.5,
	// 		scaleY: 0.5
	// 	});
	// 	canvas.add(group);
	// 	canvas.renderAll()
	// 	console.log(group.type);
	// });
	var play = new fabric.Path('M532 1265 c-213 -48 -395 -223 -457 -440 -21 -72 -24 -218 -6 -295 41 -174 165 -331 321 -407 105 -51 171 -66 280 -66 169 0 308 59 430 182 281 283 222 746 -121 953 -35 21 -93 48 -129 59 -85 27 -234 34 -318 14z m288 -61 c181 -51 331 -202 386 -389 27 -92 23 -231 -9 -324 -114 -328 -486 -478 -792 -318 -78 41 -191 154 -232 232 -135 258 -50 574 197 734 132 86 292 109 450 65z M700 745 l0 -235 -26 17 c-60 39 -175 9 -182 -49 -8 -70 152 -95 214 -33 24 24 24 26 24 229 l0 205 58 -26 c60 -26 75 -40 67 -60 -3 -7 -8 -20 -11 -28 -3 -8 -1 -15 5 -15 14 0 51 59 51 83 0 28 -42 63 -100 84 -29 10 -59 28 -67 41 -9 12 -19 22 -24 22 -5 0 -9 -105 -9 -235z');
	play.set({ originX: 'center', originY: 'center', scaleX: 0.1, scaleY:0.1, flipY: true });
	


	var note = new LabeledCircle({
		radius: 20,
	    fill:'',
	    stroke:'black',
	    strokeWidth:3,
	    hasBorders: false,
	    hasControls: false,
	    label: 'note',
	    left: 0,
	    top:130
	});

	var attack = new LabeledCircle({
		radius: 20,
	    fill:'',
	    stroke:'black',
	    strokeWidth:3,
	    hasBorders: false,
	    hasControls: false,
	    label: 'attack',
	    left:40,
	    top:130
	});

	var release = new LabeledCircle({
		radius: 20,
	    fill:'',
	    stroke:'black',
	    strokeWidth:3,
	    hasBorders: false,
	    hasControls: false,
	    label: 'release',
	    left:80,
	    top:130
	});
	
	
	var playNode = new fabric.Group([ play, note, attack, release ], {
  		left: 0,
  		top: 100
});

canvas.add(playNode); 
}