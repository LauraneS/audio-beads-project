var OscRect = fabric.util.createClass(fabric.Rect, {
	type: 'oscillator',

	initialize: function(options){
		options || (options = {});

		this.callSuper('initialize', options);
		this.set('wave', options.wave || '');
		this.set('frequency', options.frequency || 0 );
		this.set('duration', options.duration || 0);
		this.set('label', options.label || '');
		this.set({hasControls: false, hasBorders: false, selectable: false});
		// this.set('id', options.id = generateUUID());
	},

	toObject: function(){
		return fabric.util.object.extend(this.callSuper('toObject'), {
			wave: this.get('wave'),
			freq: this.get('freq'),
			duration: this.get('duration'),
			label: this.get('label')
		});
	},
	_render: function(ctx) {
    this.callSuper('_render', ctx);

    ctx.font = '15px Helvetica';
    ctx.fillStyle = '#333';
    ctx.fillText(this.label, -this.width/2, -this.height/2 );
  }
});

function OscNode() {
	var osc = new OscRect({
		left:100,
		top:100,
        width: 70,
        height: 50,
        fill: 'blue',
        opacity: 0.3,
        label: "Oscillator"
	});

	canvas.add(osc);
	
}



