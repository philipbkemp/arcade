roundStarter = "PLAYER";
nextTurn = "PLAYER";
grid = [["","",""],["","",""],["","",""]];
simonIsThinking = false;
$(document).ready(function(){

	$(".ttt td").on("click",function(square){
		data = $(square.target).data();
		if ( nextTurn === "PLAYER" && data.content === "" ) {
			nextTurn = "SIMON";
			if ( ! placeNaught(data.row,data.col) ) {
				simonThinking();
				thinkingTime = Math.floor(Math.random()*(2500-1000+1000)+1000)
				setTimeout(()=>{
					simonsTurn()
				},thinkingTime);
			}
		}
	});

	$("#newRoundStarter").on("click",function(){
		grid = [["","",""],["","",""],["","",""]];
		$(".game-area").removeClass("simonThinking");
		$(".ttt table").removeClass("complete").removeClass("drawn");
		$(".ttt table td").each(function(){
			$(this).html("").removeClass("picked").removeClass("winner").data().content = "";
		});
		if ( roundStarter === "PLAYER" ) {
			roundStarter = "SIMON";
			nextTurn = "SIMON";
			simonIsThinking = false;
			simonThinking();
			thinkingTime = Math.floor(Math.random()*(2500-1000+1000)+1000)
			setTimeout(()=>{
				simonsTurn()
			},thinkingTime);
		} else {
			roundStarter = "PLAYER";
			nextTurn = "PLAYER";
			simonIsThinking = false;
		}
	});

});

function simonThinking() {
	simonIsThinking = !simonIsThinking;
	if ( simonIsThinking ) {
		$(".game-area").addClass("simonThinking");
	} else {
		$(".game-area").removeClass("simonThinking");
	}
}

function simonsTurn() {
	options = [];
	grid.forEach(function(r,rIndex){
		r.forEach(function(c,cIndex){
			if ( c === "" ) {
				options.push([rIndex,cIndex]);
			}
		});
	});
	min = 1;
	max = options.length;
	if ( max <= 0 ) {
		return;
	}
	choice = Math.floor(Math.random()*(max-min+min)+min);
	square = options[choice-1];
	r = square[0]+1;
	c = square[1]+1;
	nextTurn = "PLAYER";
	simonThinking();
	placeCross(r,c);
}

function placeNaught(r,c) {
	$square = $("td[data-row="+r+"][data-col="+c+"]");
	$square.html("<i class='fa-solid fa-o fa-fw fa-3x'></i>");
	$square.addClass("picked");
	$square.data().content = "o";
	grid[r-1][c-1] = "o";
	return checkForWinner();
}

function placeCross(r,c) {
	$square = $("td[data-row="+r+"][data-col="+c+"]");
	$square.html("<i class='fa-solid fa-x fa-fw fa-3x'></i>");
	$square.addClass("picked");
	$square.data().content = "x";
	grid[r-1][c-1] = "x";
	return checkForWinner();
}

function checkForWinner() {
	winner = false;
	winningPlayer = "";
	["o","x"].forEach(function(tile){
		// check rows
		rowOne = grid[0][0] === tile && grid[0][1] === tile && grid[0][2] === tile;
		rowTwo = grid[1][0] === tile && grid[1][1] === tile && grid[1][2] === tile;
		rowThree = grid[2][0] === tile && grid[2][1] === tile && grid[2][2] === tile;
		colOne = grid[0][0] === tile && grid[1][0] === tile && grid[2][0] === tile;
		colTwo = grid[0][1] === tile && grid[1][1] === tile && grid[2][1] === tile;
		colThree = grid[0][2] === tile && grid[1][2] === tile && grid[2][2] === tile;
		forwardSlash = grid[0][0] === tile && grid[1][1] === tile && grid[2][2] === tile;
		backSlash = grid[2][0] === tile && grid[1][1] === tile && grid[0][2] === tile;
		if ( rowOne || rowTwo || rowThree || colOne || colTwo || colThree || forwardSlash || backSlash ) {
			winner = true;
			winningPlayer = tile;
			if ( rowOne ) {
				winningTile(0,0); winningTile(0,1); winningTile(0,2);
			} else if ( rowTwo ) {
				winningTile(1,0); winningTile(1,1); winningTile(1,2);
			} else if ( rowThree ) {
				winningTile(2,0); winningTile(2,1); winningTile(2,2);
			} else if ( colOne ) {
				winningTile(0,0); winningTile(1,0); winningTile(2,0);
			} else if ( colTwo ) {
				winningTile(0,1); winningTile(1,1); winningTile(2,1);
			} else if ( colThree ) {
				winningTile(0,2); winningTile(1,2); winningTile(2,2);
			} else if ( forwardSlash ) {
				winningTile(0,0); winningTile(1,1); winningTile(2,2);
			} else if ( backSlash ) {
				winningTile(2,0); winningTile(1,1); winningTile(0,2);
			}
		}
	});

	if ( ! winner ) {
		options = [];
		grid.forEach(function(r,rIndex){
			r.forEach(function(c,cIndex){
				if ( c === "" ) {
					options.push([rIndex,cIndex]);
				}
			});
		});
		if ( options.length === 0 ) {
			gameTied();
			winner = true;
		}
	}

	if ( winner && winningPlayer === "o" ) {
		showWinner("PLAYER");
	} else if ( winner && winningPlayer === "x" ) {
		showWinner("SIMON");
	} else if ( winner ) {
		showWinner("");
	}

	return winner;
}

function winningTile(r,c) {
	r++;
	c++;
	$square = $("td[data-row="+r+"][data-col="+c+"]");
	$square.addClass("winner");
	$(".ttt table").addClass("complete");
}

function gameTied() {
	$(".ttt table").addClass("complete").addClass("drawn");
}

function showWinner(winner) {

	win = localStorage.getItem("arcade.ttt.win") ?? 0;
	draw = localStorage.getItem("arcade.ttt.draw") ?? 0;
	loss = localStorage.getItem("arcade.ttt.loss") ?? 0;

	switch ( winner ) {
		case "PLAYER":
			$("#outcomeLabel").html("You win!");
			$(".modal-header").removeClass("bg-danger").addClass("bg-success");
			win++;
			break;
		case "SIMON":
			$("#outcomeLabel").html("You lose");
			$(".modal-header").removeClass("bg-success").addClass("bg-danger");
			loss++;
			break;
		default:
			$("#outcomeLabel").html("It's a draw");
			$(".modal-header").removeClass("bg-success").removeClass("bg-danger");
			draw++;
	}
	localStorage.setItem("arcade.ttt.win",win);
	localStorage.setItem("arcade.ttt.draw",draw);
	localStorage.setItem("arcade.ttt.loss",loss);
	$(".modal-body span.win").html(win);
	$(".modal-body span.loss").html(loss);
	const myModal = new bootstrap.Modal('#outcome').show();
}