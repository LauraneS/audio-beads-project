var BufferNode = fabric.util.createClass(fabric.Rect, {
	type: 'buffer',

	initialize: function(options){
		options || (options = {});

		this.callSuper('initialize', options);
		this.set('url', options.url || '');
		this.set('loop', options.loop || false);
		this.set('label', options.label || '');
		this.set({hasControls: false, hasBorders: false, selectable: false});
	},

	toObject: function(){
		return fabric.util.object.extend(this.callSuper('toObject'), {
			url: this.get('url'),
			loop: this.get('loop'),
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

function BufferNod() {
	var buff = new BufferNode({
		left:200,
		top:100,
        width: 70,
        height: 50,
        fill: 'red',
        opacity: 0.3,
        label: "Buffer"
	});

	canvas.add(buff);
}
