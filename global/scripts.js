function grabStats(game) {
	win = localStorage.getItem("arcade."+game+".win");
	draw = localStorage.getItem("arcade."+game+".draw");
	loss = localStorage.getItem("arcade."+game+".loss");

	win = win ? parseInt(win) : 0;
	draw = draw ? parseInt(draw) : 0;
	loss = loss ? parseInt(loss) : 0;

	$(".stat_w").html(win+" win"+(win!==1?'s':''));
	$(".stat_d").html(draw+" draw"+(draw!==1?'s':''));
	$(".stat_l").html(loss+" defeat"+(loss!==1?'s':''));
}

function killStats(game) {
	if ( confirm("Are you sure you want to wipe your stats for this game?") ) {
		localStorage.removeItem("arcade."+game+".win");
		localStorage.removeItem("arcade."+game+".draw");
		localStorage.removeItem("arcade."+game+".loss");
		grabStats(game);
	}
}