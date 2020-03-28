var cnv,ctx,BOARD;
function init(){
	cnv=document.getElementsByClassName("cnv")[0];
	ctx=cnv.getContext("2d");
	resize();
	window.addEventListener("resize",resize,false);
	window.addEventListener("keypress",onkeypress);
	window.addEventListener("mousemove",onmousemove);
	window.addEventListener("mousedrag",onmousedrag);
	window.addEventListener("click",onclick);
	document.body.oncontextmenu=()=>false;
	BOARD=new Board();
	requestAnimationFrame(render);
}
function render(){
	ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
	BOARD.update();
	BOARD.draw();
	requestAnimationFrame(render);
}
function resize(){
	cnv.style.width=`${window.innerWidth}px`;
	cnv.style.height=`${window.innerHeight}px`;
	cnv.width=window.innerWidth;
	cnv.height=window.innerHeight;
}
function onkeypress(e){
	BOARD.key(e);
}
function onmousemove(e){
	BOARD.mouse(e);
}
function onmousedrag(e){
	BOARD.mouse(e);
}
function onclick(e){
	BOARD.click(e);
}
document.addEventListener("DOMContentLoaded",init,false);