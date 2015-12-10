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

function EffectNode(){
	var fx = new fabric.Path("M530 1184 c-192 -41 -359 -196 -414 -383 -9 -30 -16 -69 -16 -86 l0 -32 107 -2 108 -2 38 43 37 43 25 -30 c14 -16 25 -38 25 -48 0 -10 8 -32 17 -50 15 -27 18 -29 21 -12 1 11 7 29 13 40 5 11 24 67 42 125 27 86 36 105 52 105 20 0 33 -33 41 -110 9 -78 35 -270 41 -300 5 -27 7 -28 14 -10 4 11 8 34 8 52 1 17 5 33 10 35 5 2 20 42 35 91 38 124 64 117 105 -31 11 -38 30 -50 31 -19 1 7 9 22 19 35 18 20 27 22 128 22 59 0 125 3 145 6 35 6 36 7 31 43 -33 239 -207 428 -438 476 -85 18 -140 18 -225 -1z M546 680 c-56 -183 -71 -196 -115 -95 -14 33 -29 62 -33 63 -4 2 -8 13 -8 25 -1 21 -2 21 -23 -5 -22 -27 -24 -27 -150 -29 l-128 -2 6 -46 c24 -175 105 -309 243 -401 100 -68 181 -92 307 -92 126 0 207 24 307 92 136 90 218 224 241 392 l6 37 -52 6 c-29 3 -88 4 -132 2 -64 -4 -81 -8 -90 -23 -49 -81 -66 -103 -79 -98 -8 3 -25 34 -38 70 -12 35 -26 60 -29 56 -10 -10 -59 -169 -59 -189 0 -19 -38 -100 -50 -108 -17 -11 -28 26 -49 165 -12 80 -26 154 -31 165 -5 11 -11 40 -12 65 -3 44 -3 43 -32 -50z");
fx.set({ top: 10, left: 10, scaleX: 0.1, scaleY: 0.1});
canvas.add(fx);
}