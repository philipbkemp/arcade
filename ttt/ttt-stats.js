$(document).ready(function(){
	win = parseInt(localStorage.getItem("arcade.ttt.win")) ?? 0;
	draw = parseInt(localStorage.getItem("arcade.ttt.draw")) ?? 0;
	loss = parseInt(localStorage.getItem("arcade.ttt.loss")) ?? 0;

	$(".stat_w").html(win+" win"+(win!==1?'s':''));
	$(".stat_d").html(draw+" draw"+(draw!==1?'s':''));
	$(".stat_l").html(loss+" defeat"+(loss!==1?'s':''));
});