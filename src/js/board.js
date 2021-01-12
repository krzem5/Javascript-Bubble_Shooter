var BALL_R=40,BALL_ROWS=7,ANC_Y=300,DIR_VEC_PT=10,DIR_VEC_PT_DST=60,BALL_SPEED=35,MIN_BALL_DESTROY=3,BALL_DESTROY_BUFF=1,BALL_DECAY=0.08,BALL_COLORS=["#dd0000","#00dd00","#0000dd","#dddd00","#dd00dd","#00dddd"];
class Board{
	_map(v,aa,ab,ba,bb){
		return (v-aa)/(ab-aa)*(bb-ba)+ba;
	}
	_gen_bl(){
		var l=[];
		var pd=window.innerWidth%(BALL_R*2)/2;
		var yo=Math.sqrt(BALL_R*BALL_R*3);
		for (var i=pd+0;i<window.innerWidth-pd;i+=BALL_R*2){
			for (var j=0;j<BALL_ROWS;j+=2){
				l.push(new Ball(this,i+BALL_R,j*yo+BALL_R));
			}
		}
		for (var i=pd+0;i<window.innerWidth-pd-BALL_R*2;i+=BALL_R*2){
			for (var j=1;j<BALL_ROWS;j+=2){
				l.push(new Ball(this,i+BALL_R*2,j*yo+BALL_R));
			}
		}
		return l;
	}
	_gen_sb(){
		var b=new Ball(this,this.ax+0,this.ay+0);
		if (this.sb==null){
			return b;
		}
		while (b.c==this.sb.c){
			b.c=BALL_COLORS[parseInt(Math.random()*BALL_COLORS.length)];
		}
		return b;
	}
	constructor(){
		this._bl=this._gen_bl();
		this.mx=0;
		this.my=0;
		this.ax=parseInt(window.innerWidth/2);
		this.ay=window.innerHeight-ANC_Y;
		this.sb=this._gen_sb();
		this.cl=false;
		this._db=[];
		this._rdb=[];
		this.aim=false;
	}
	update(){
		if (this.cl==true&&this.sb.vx==0&&this.sb.vy==0){
			var dx=this.mx-this.ax;
			var dy=this.my-this.ay;
			var mg=Math.sqrt(dx*dx+dy*dy);
			dx/=mg;
			dy/=mg;
			this.sb.vx=dx;
			this.sb.vy=dy;
		}
		for (var b of this._db){
			b.update();
		}
		for (var b of this._rdb){
			this._db.splice(this._db.indexOf(b),1);
		}
		this._rdb=[];
		this.sb.update();
		this.cl=false;
	}
	draw(){
		ctx.fillStyle="#000000";
		ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
		var nb=[];
		var hb=[];
		if (this.aim==true){
			var dx=this.mx-this.ax;
			var dy=this.my-this.ay;
			var mg=Math.sqrt(dx*dx+dy*dy);
			dx/=mg;
			dy/=mg;
			for (var b of this._bl){
				if (b.c==this.sb.c){
					hb.push(b);
				}
			}
			if(Math.abs(dy,0)>0.2){
				ctx.strokeStyle="#040404";
				ctx.lineWidth=30;
				ctx.lineJoin="round";
				ctx.beginPath();
				ctx.moveTo(this.ax,this.ay);
				var x=this.ax+0;
				var y=this.ay+0;
				var end=false
				while (end==false){
					x+=dx;
					y+=dy;
					var e=false;
					var xl=0;
					var yl=0;
					var md=Infinity;
					var mb=null;
					for (var b of this._bl){
						var dvx=b.x-x;
						var dvy=b.y-y;
						var d=Math.sqrt(dvx*dvx+dvy*dvy);
						if (d<=BALL_R*2){
							var dox=x-b.x;
							var doy=y-b.y;
							var nm=Math.sqrt(dox*dox+doy*doy);
							x+=dox/nm*(BALL_R*2-d);
							y+=doy/nm*(BALL_R*2-d);
							e=true;
						}
						if (d<md){
							md=d+0;
							mb=b;
						}
					}
					if (e==true){
						x+=xl;
						y+=yl;
						var c=1;
						var bl=[new Ball(this,x,y)];
						bl[0].c=this.sb.c+"";
						while (true){
							var a=true;
							for (var b of this._bl){
								var inc=false;
								for (var k of bl){
									if (k==b){
										inc=true;
										break;
									}
								}
								if (inc==true){
									continue;
								}
								for (var o of bl){
									var dx=b.x-o.x;
									var dy=b.y-o.y;
									if (Math.sqrt(dx*dx+dy*dy)<=BALL_R*2+BALL_DESTROY_BUFF&&o.c==b.c){
										c++;
										bl.push(b);
										nb.push(b);
										a=false;
										break;
									}
								}
							}
							if (a==true){
								break;
							}
						}
						var ldx=mb.x-x+dx;
						var ldy=mb.y-y+dy;
						var o=BALL_R/Math.sqrt(ldx*ldx+ldy*ldy);
						x=mb.x+o*(x-dx-mb.x);
						y=mb.y+o*(y-dy-mb.y);
						end=true;
						if (this.sb.vx!=0||this.sb.vy!=0){
							nb=[];
						}
					}
					if (x>window.innerWidth-BALL_R){
						x=window.innerWidth-BALL_R;
						dx*=-1;
					}
					if (x<BALL_R){
						x=BALL_R+0;
						dx*=-1;
					}
					if (y>window.innerHeight-BALL_R){
						y=window.innerHeight-BALL_R;
						dy*=-1;
					}
					ctx.lineTo(x,y);
					if (end==true){
						break;
					}
				}
				ctx.stroke();
			}
		}
		for (var b of this._db){
			b.draw();
		}
		for (var b of this._bl){
			if (this.aim==true&&nb.includes(b)){
				b.draw_br();
			}
			else{
				b.draw(hb.includes(b));
			}
		}
		var dx=this.mx-this.ax;
		var dy=this.my-this.ay;
		var mg=Math.sqrt(dx*dx+dy*dy);
		dx/=mg;
		dy/=mg;
		ctx.fillStyle="#cccccc";
		for (var i=0;i<DIR_VEC_PT;i++){
			ctx.beginPath();
			ctx.arc(this.ax+dx*DIR_VEC_PT_DST*i,this.ay+dy*DIR_VEC_PT_DST*i,this._map(i,0,DIR_VEC_PT,5,1),0,Math.PI*2);
			ctx.fill();
		}
		this.sb.draw();
		ctx.fillStyle="#ffffffa0";
		ctx.beginPath();
		ctx.arc(this.mx,this.my,15,0,Math.PI*2);
		ctx.fill();

	}
	key(e){
		switch (e.key){
			case "a":
				this.aim=!this.aim;
				break;
		}
	}
	mouse(e){
		this.mx=e.clientX;
		this.my=e.clientY;
	}
	click(e){
		this.cl=true;
	}
}
class Ball{
	constructor(b,x,y){
		this.b=b;
		this.x=x;
		this.y=y;
		this.vx=0;
		this.vy=0;
		this.d=-1;
		this.c=BALL_COLORS[parseInt(Math.random()*BALL_COLORS.length)];
	}
	update(){
		if (this.d==-1){
			for (var i=0;i<BALL_SPEED;i++){
				this.x+=this.vx;
				this.y+=this.vy;
				var e=false;
				var xl=0;
				var yl=0;
				for (var b of this.b._bl){
					var dx=b.x-this.x;
					var dy=b.y-this.y;
					var d=Math.sqrt(dx*dx+dy*dy);
					if (d<=BALL_R*2){
						var dox=this.x-b.x;
						var doy=this.y-b.y;
						var nm=Math.sqrt(dox*dox+doy*doy);
						this.x+=dox/nm*(BALL_R*2-d);
						this.y+=doy/nm*(BALL_R*2-d);
						e=true;
					}
				}
				if (e==true){
					this.x+=xl;
					this.y+=yl;
					this.b._bl.push(this);
					var c=1;
					var bl=[this];
					while (true){
						var a=true;
						for (var b of this.b._bl){
							var inc=false;
							for (var k of bl){
								if (k==b){
									inc=true;
									break;
								}
							}
							if (inc==true){
								continue;
							}
							for (var o of bl){
								var dx=b.x-o.x;
								var dy=b.y-o.y;
								if (Math.sqrt(dx*dx+dy*dy)<=BALL_R*2+BALL_DESTROY_BUFF&&o.c==b.c){
									c++;
									bl.push(b);
									a=false;
									break;
								}
							}
						}
						if (a==true){
							break;
						}
					}
					if (c>=MIN_BALL_DESTROY){
						for (var b of bl){
							this.b._bl.splice(this.b._bl.indexOf(b),1);
							b.d=1;
							this.b._db.push(b);
						}
					}
					this.vx=0;
					this.vy=0;
					this.b.sb=this.b._gen_sb();
					return;
				}
				if (this.x>window.innerWidth-BALL_R){
					this.x=window.innerWidth-BALL_R;
					this.vx*=-1;
				}
				if (this.x<BALL_R){
					this.x=BALL_R+0;
					this.vx*=-1;
				}
				if (this.y>window.innerHeight-BALL_R){
					this.y=window.innerHeight-BALL_R;
					this.vy*=-1;
				}
			}
		}
		else{
			this.d-=BALL_DECAY;
			if (this.d<=0){
				this.b._rdb.push(this);
			}
		}
	}
	draw(hb){
		var h=parseInt(this.b._map((this.d==-1?1:this.d),1,0,255,0)).toString(16);
		if (h.length==1){
			h="0"+h;
		}
		ctx.fillStyle=(hb==true?this.c.split("dd").join("e2"):this.c)+h;
		ctx.beginPath();
		ctx.arc(this.x,this.y,BALL_R,0,Math.PI*2);
		ctx.fill();
	}
	draw_br(){
		ctx.fillStyle=this.c.split("dd").join("e2");
		ctx.strokeStyle=this.c.split("dd").join("d0");
		ctx.lineWidth=4;
		ctx.beginPath();
		ctx.arc(this.x,this.y,BALL_R,0,Math.PI*2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(this.x,this.y,BALL_R-2,0,Math.PI*2);
		ctx.stroke();
	}
}