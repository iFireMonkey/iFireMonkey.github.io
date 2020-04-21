var loses = 0;
var wins = 0;
			
var play = function(userChoice) {
					
					document.getElementById("player").innerHTML="";
					document.getElementById("opponent").innerHTML="";
					document.getElementById("results").innerHTML="";
				
					
					if (userChoice == "rock" || userChoice == "paper" || userChoice == "scissors") {
						document.getElementById("player").innerHTML='You chose' + ' ' + userChoice + '.';
					} else if (userChoice == "FireMonkey") {
						document.getElementById("player").innerHTML='You chose' + ' ' + userChoice + '.';
					} else {
						document.getElementById("player").innerHTML="That is not a valid choice, try again.";
						
						return false;
					}
				
					var computerChoice = Math.random();
					if (computerChoice < 0.34) {
						computerChoice = "rock";
					} else if(computerChoice <= 0.67) {
						computerChoice = "paper";
					} else {
						computerChoice = "scissors";
					}
				 
				 	document.getElementById("opponent").innerHTML='| Your opponent chose' + ' ' + computerChoice + '.';
				 
					 var compare = function (choice1,choice2) {
						if (choice1 == choice2) {
							return "You tied!";
						} else if (choice1 == "rock"){
							if (choice2 =="scissors") {
								wins++;
								return "Rock wins!";
							} else {
								loses++;
								return "Sorry, paper wins.";
							}
						} else if (choice1 == "paper") {
							if (choice2 == "rock") {
								wins++;
								return "Paper wins";
							} else {
								loses++;
								return "Sorry, scissors win.";
							}
						} else if (choice1 == "scissors") {
							if (choice2 == "rock") {
								loses++;
								return "Sorry, rock wins";
							} else {
								wins++;
								return "Scissors wins!";
							}
						} else if (choice1 == "FireMonkey") {
							wins++;
							return "FireMonkey Won!";
						} else {
							return "Whoops, the game broke, you're a winner in our book.";
						}
					};

					var winner = compare(userChoice,computerChoice);
					document.getElementById("results").innerHTML=winner;
					document.getElementById("wins").innerHTML=wins;
					document.getElementById("loses").innerHTML=loses;
			};

var reset = function() {
	loses = 0;
	wins = 0;
	document.getElementById("wins").innerHTML=wins;
	document.getElementById("loses").innerHTML=loses;
};