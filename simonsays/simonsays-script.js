level = 1;
rows = 2;
cols = 2;
colours = [];
simonIsThinking = false;
thisPattern = [];
patternIndex = 0;
patternSpeed = 1000;
patternPop = 1000;
playerGuess = [];
wrongGuesses = 0;
$(document).ready(function(){

	buildTable();

	simonThinking();
	thinkingTime = Math.floor(Math.random()*(2500-1000+1000)+1000)
	setTimeout(()=>{
		loadPattern()
	},thinkingTime);

	$("#newRoundStarterFail").on("click",function(){
		level = 0;
		cols = 2;
		rows = 2;
		doNextLevel();
	});

	$("#newRoundStarter").on("click",function(){
		doNextLevel();
	});

	$("#tryAgain").on("click",function(){
		patternIndex = 0;
		$(".ss-box.ready").removeClass("ready");
		setTimeout(()=>{
			showNextPatternItem()
		},patternSpeed);
	});

});

function doNextLevel() {
	level++;
	simonIsThinking = false;
	thisPattern = [];
	patternIndex = 0;
	playerGuess = [];
	wrongGuesses = 0;
	$(".ss-box.ready").removeClass("ready");
	if ( (level-1) % 5 === 0 ) {
		if ( rows <= 5 && cols < 5 ) {
			if ( rows === cols ) {
				rows++;
			} else {
				cols++;
			}
			buildTable();
		}
		if ( patternSpeed > 500 ) {
			if ( patternSpeed === patternPop ) {
				patternSpeed = patternSpeed - 50;
			} else {
				patternPop = patternPop - 50;
			}
		}
	}
	simonThinking();
	thinkingTime = Math.floor(Math.random()*(2500-1000+1000)+1000)
	setTimeout(()=>{
		loadPattern()
	},thinkingTime);
}

function buildTable() {

	gameTable = $("<TABLE></TABLE>");
	colourIndex = 0;
	for ( r=0 ; r!==rows ; r++ ) {
		rowR = $("<TR></TR>");
		for ( c=0 ; c!==cols ; c++ ) {
			if ( colours.length < colourIndex+1 ) {
				newColour = Math.floor(Math.random()*16777215).toString(16);
				while ( newColour.length !== 6 ) {
					newColour += "0";
				}
				colours.push(newColour);
			}
			box = $("<DIV></DIV>").addClass("ss-box").addClass("box_"+colourIndex).css("background-color","#"+colours[colourIndex]).attr("data-box",colourIndex);
			colC = $("<TD></TD>").append(box);
			rowR.append(colC);
			colourIndex++;
		}
		gameTable.append(rowR);
	}

	$(".game-area").empty();
	$(".game-area").append(gameTable);

}

function loadPattern() {
	simonThinking();

	maxNumber = rows+cols-1;

	while (thisPattern.length !== (maxNumber+1)) {
		thisPattern.push(Math.floor(Math.random() * (maxNumber - 0 + 1) + 0));
	}
	
	setTimeout(()=>{
		showNextPatternItem()
	},patternSpeed);
}

function showNextPatternItem() {
	if ( thisPattern.length === patternIndex ) {
		doPlayerTurn();
		return;
	}
	$(".simonsays .box_"+thisPattern[patternIndex]).addClass("pop");
	setTimeout(()=>{
		hidePatternItem()
	},patternPop);
}

function hidePatternItem() {
	$(".simonsays .box_"+thisPattern[patternIndex]).removeClass("pop");
	patternIndex++;
	setTimeout(()=>{
		showNextPatternItem()
	},patternSpeed);
}

function doPlayerTurn() {
	$(".simonsays .ss-box").addClass("ready");
	$(".simonsays .ss-box.ready").off();
	$(".simonsays .ss-box.ready").on("click",function(){
		playerGuess.push($(this).data().box);
		if ( playerGuess.length === thisPattern.length ) {
			if ( JSON.stringify(playerGuess) === JSON.stringify(thisPattern) ) {
				showResult("yes");
			} else {
				wrongGuesses++;
				playerGuess = [];
				if ( wrongGuesses === 3 ) {
					showResult("dead");
				} else {
					showResult("no");
				}
			}
		}
	});
}

function showResult(type) {
	switch (type) {
		case "yes":
			$("#outcome .modal-header").addClass("bg-success").removeClass("bg-danger").html("Correct!");
			$("#outcome #newRoundStarter").show();
			$("#outcome #newRoundStarterFail").hide();
			$("#outcome .modal-body .level").html(level);
			$("#outcome .modal-body").show();
			$("#outcome #tryAgain").hide();
			break;
		case "no":
			$("#outcome .modal-header").addClass("bg-danger").removeClass("bg-success").html("Nope, try again");
			$("#outcome #newRoundStarter").hide();
			$("#outcome #newRoundStarterFail").hide();
			$("#outcome .modal-body").hide();
			$("#outcome #tryAgain").show();
			break;
		case "dead":
			$("#outcome .modal-header").addClass("bg-danger").removeClass("bg-success").html("Wrong, you failed");
			$("#outcome #newRoundStarter").hide();
			$("#outcome #newRoundStarterFail").show();
			$("#outcome .modal-body").hide();
			$("#outcome #tryAgain").hide();
			break;
	}
	const myModal = new bootstrap.Modal('#outcome').show();
}