/** some quick nasty global vars **/
var GameName = "Deadventure";
var GameVersion = "0.6a";

var TITLE = $('h1');
var LOCATION = $('h2 em');
var DESCRIPTION = $('h3 em');
var ACTIONBAR = $('#action .bar');
var OUTPUT = $('#output');
var ITEM = '.item';
var INVENTORYITEM = '.inventoryitem';

/** functions **/
var Engine = {
	HungerThirstTimer: null,
	Collectables: [],
	Save: function() {
		var toSave = JSON.stringify(Player);
		window.localStorage.setItem("Scavenger_Save", toSave);
		window.localStorage.setItem("Scavenger_Seed", Math.seedrandom());
	},
	Load: function() {
		var toLoad = window.localStorage.getItem("Scavenger_Save");
		Player = JSON.parse(toLoad);
		var toSeed = window.localStorage.getItem("Scavenger_Seed");
		Math.seedrandom(toSeed);
	},
	GetImage: function(type) {
		$.ajax({
		  dataType: "jsonp",
		  url: 'http://ajax.googleapis.com/ajax/services/search/images',
		  data: {
			v: "1.0",
			rsz: 8,
			q: "\"" + type + "\" 320 -shutterstock"
		  }, success: function ( json ) {
			var rand = Math.floor(Math.random() * 3); //json.responseData.results.length),
			results = json.responseData.results[rand].tbUrl;
			//console.log(results);
			$('#locName').attr('src', results);
		  }
		});
	},
	Rest: function() {
		if (Player.Travelling == false) {
			Player.Asleep = true;
			Engine.Print("\"I'm just resting my eyes...\"","lightgreen","left");
			$('#action .bar').animate({
				"width":"100%"
			}, 25000, function() {
				$(this).css('width','0%');
				Player.Health += 10;
				Player.Asleep = false;
				if (Player.Health > 100) { Player.Health = 100; }
				Engine.CheckHealth("rest");
				Player.Hunger -= 10;
				Player.Thirst -= 10;
				Player.Experience.Stealth += 2;
				Engine.CheckExperience();
				Engine.CheckHungerThirst();
				Engine.Print("\"Morning! I feel better now!\"","lightgreen","left");
			});
		}
	},
	Percent: function(num1, num2) {
		return (number_one / number_two) * 100;
	},
	Init: function(load) {
		var dateSeed = new Date();
		Math.seedrandom(dateSeed);
		$(TITLE).html(GameName + " <sup>" + GameVersion + "</sup>");
		Engine.GenerateMap(true, load);
		Engine.CheckHealth("start");
		Engine.CheckHungerThirst();
		Engine.UpdateWeight();
		Engine.UpdateAlertness();
		Engine.CheckExperience();
		Engine.RunEventTimer();
		Engine.HungerThirstTimer = setInterval(function() {
			Player.Hunger--;
			Player.Thirst--;
			Engine.Save();
			Engine.CheckHungerThirst();
		}, 6000);
		$("#travel").on("click", function() {		
			clearTimeout(Engine.EventTimer);
			Engine.EventTimer = null;
			Engine.Travel();
			return false;
		});
		$("#inventory").on("click", function() {
			var invText = "";
			var totalWeight = 0;
			if (Player.Inventory.length > 0) {
				invText += "\"I'm carrying...\"<br />";
			}
			for (var i = 0; i < Player.Inventory.length; i++) {
				totalWeight = totalWeight + Player.Inventory[i].Weight;
				var stats = "Weighs: " + Player.Inventory[i].Weight + ", ";
				if (Player.Inventory[i].Hunger > 0) {
					stats += "Hunger: " + Player.Inventory[i].Hunger + ", ";
				}
				if (Player.Inventory[i].Thirst > 0) {
					stats += "Thirst: " + Player.Inventory[i].Thirst + ", ";
				}
				if (Player.Inventory[i].Health > 0) {
					stats += "Health: " + Player.Inventory[i].Health + ", ";
				}
				if (Player.Inventory[i].Attack > 0) {
					stats += "Attack: " + Player.Inventory[i].Attack + ", ";
				}
				invText += "<span class='inventoryitem' title='" + stats + "' name='" + i + "'>" + Player.Inventory[i].Name + "</span> <span class='discard' name='" + i + "'>X</span>";
			}
			if (invText.length > 0) {
				Engine.Print(invText + "<br /><span style='display:inline-block;'>I can carry about  " + Engine.Dec((Player.Strength - totalWeight) + Player.Container) + "kg more</span>","orange", "left");
				$(INVENTORYITEM).on('click', function() {
					if (Player.Asleep == false) {
						var thisId = $(this).attr('name');
						Engine.UseItem(thisId);
						$(this).parent().remove();
						Engine.UpdateWeight();
						Player.Alerted--;
						Engine.UpdateAlertness();
					}
					return false;
				}).hover(function(){
						// Hover over code
						var title = $(this).attr('title');
						$(this).data('tipText', title).removeAttr('title');
						$('<p class="tooltip"></p>')
						.text(title)
						.appendTo('body')
						.fadeIn('fast');
				}, function() {
						// Hover out code
						$(this).attr('title', $(this).data('tipText'));
						$('.tooltip').remove();
				}).mousemove(function(e) {
						var mousex = e.pageX + 20; //Get X coordinates
						var mousey = e.pageY + 10; //Get Y coordinates
						$('.tooltip')
						.css({ top: mousey, left: mousex })
				});;
				$('.discard').on('click', function() {
					if (Player.Asleep == false) {
						var thisId = $(this).attr('name');
						var thisName = Player.Inventory[thisId].Name;
						Player.Inventory.splice(thisId,1);
						
						if (thisName == Player.WeaponName) {
							Player.WeaponName = "Fists";
							Player.WeaponAttack = 0;
						}
		
						Engine.Print("\"I destroyed the " + thisName + "\"", "orange","left");
						$(this).parent().remove();
						Engine.UpdateWeight();
					}
					return false;
				});
			} else {
				Engine.Print("\"I have no belongings but " + invText + " I can carry about " + Engine.Dec((Player.Strength - totalWeight) + Player.Container) + "kg\"","orange","left");
			}
			return false;
		});
	},
	CheckHungerThirst: function() {
		var h = Player.Hunger;
		if (h > 100) { h = 100; }
		$('#hunger .bar').animate({
			"width": h + "%"
		}, 350);
		var t = Player.Thirst;
		if (t > 100) { t = 100; }
		$('#thirst .bar').animate({
			"width": t + "%"
		}, 350);
		if (h <= 0) { 
			h = 0;
			Player.Health -= 2;
			Engine.Print("\"I'm starving\"","red","center");
			Engine.CheckHealth("hunger");
		}
		if (t <= 0) { 
			t = 0; 
			Player.Health -= 3;
			Engine.Print("\"I'm dehydrating\"","red","center");
			Engine.CheckHealth("thirst");
		}
		Engine.Score();
	},
	Score: function() {
		var pointing =  Math.floor(Player.Clicks * 100) + 
						Math.floor(Player.Distance * 100) + 
						Math.floor(Player.Dexterity * 10) + 
						Math.floor(Player.Healing * 10) + 
						Math.floor(Player.Search * 10) + 
						Math.floor(Player.Stealth * 10) + 
						Math.floor(Player.Experience.Dexterity) + 
						Math.floor(Player.Experience.Healing) + 
						Math.floor(Player.Experience.Search) + 
						Math.floor(Player.Experience.Stealth);
		Player.Score = pointing;
		$('.points,#score').html('I have ' + pointing + ' points');
	},
	CheckHealth: function(reason) {
		var h = Player.Health;
		if (h > 100) { h = 100; }
		$('#health .bar').animate({
			"width": h + "%"
		}, 350, function() {
			if (Player.Health <= 0) {
				var reasoning = Player.Name + " died.";
				if (reason == "hunger") {
					reasoning = Player.Name + " starved to death";
				}
				if (reason == "thirst") {
					reasoning = Player.Name + " dehydrated";
				}
				if (reason == "attacked") {
					reasoning = Player.Name + " was beaten to death and eaten";
				}
				if (reason == "retreat") {
					reasoning = Player.Name + " was killed while running away...";
				}
				$('body').css('background-color','#111').html('<div id="dead">DEAD</div><div id="score">Score: 0pts</div><h2 style="align: center;">' + reasoning + '<div id="recording" style="text-align: center;">[[[ SCORE SAVED ]]]</div>');
		
				var score = Engine.Score();
				
				if (Player.Health !== -666) {
					Player.Health = -666;
					
					$.ajax({
						url: "php/hiscores.php?action=save?v=1",
						type: "post",
						data: {
							"player": JSON.stringify(Player)
						},
						Success: function(data) {
							$('#recording').html("Hi-score saved!");
						},
						error: function(err) {
							alert("ERROR WITH SCORE");
							console.log(err);
						}
					});
					
					setTimeout(function() {
						window.localStorage.removeItem("Scavenger_Save");
						window.localStorage.removeItem("Scavenger_Seed");
					}, 500);
					
				}
			
			}
		});
	},
	Travel: function() {
		if (Player.Encumbered == false) {
			if (Player.Searching == false) {
				if (Player.Travelling == false) {
					if (Player.Asleep == false) {
						Player.Travelling = true;
						Engine.GenerateMap(false, "continue");
						$('#travel').css({
							"background-color":"red",
							"color":"white"
						});
					} else {
						Engine.Print("\"zzzZZ zzzZZZZ\"", "orange", "left");
					}
				} else {
					Engine.Print("\"I'm going as fast as I can!\"", "orange", "left");
				}
			} else {
				Engine.Print("\"I'll finish my search first.\"", "orange", "left");
			}		
		} else {
			Engine.Print("\"I am encumbered, I need to drop or use something!\"", "red", "left");
		}
		Engine.RunEventTimer();
	},
	UseItem: function(id) {
		if (Player.Asleep == false && Player.Travelling == false) {
			var removeItem = false;
			if (Player.Inventory[id].Hunger > 0) {
				Player.Hunger += Player.Inventory[id].Hunger;
				var thisName = Player.Inventory[id].Name;
			}
			if (Player.Inventory[id].Thirst > 0) {
				if (removeItem == false) {
					Player.Thirst += Player.Inventory[id].Thirst;
					var thisName = Player.Inventory[id].Name;
					removeItem = true;
				}
			}
			if (Player.Inventory[id].Container > 0) {
				if (removeItem == false) {
					Player.Container = Player.Inventory[id].Container;
					var thisName = Player.Inventory[id].Name;
					Engine.UpdateWeight();
					removeItem = true;
				}
			}
			if (removeItem == true) {
				Engine.Print("\"I've used " + thisName + "\"","lightgreen","left");
			}
			if (Player.Inventory[id].Health > 0) {
				if (Player.Health < 100 && removeItem == false) {
					Player.Health += Player.Inventory[id].Health;
					var thisName = Player.Inventory[id].Name;
					if (Player.Health > 100) { Player.Health = 100; }
					if (removeItem == false) {
						removeItem = true;
						Engine.Print("\"I feel better having used " + thisName + " to patch myself up\"","lightgreen","left");
						Player.Experience.Healing += 2;
						Engine.CheckExperience();
					}
				} else {
					Engine.Print("\"I'm already feeling pretty good thanks.\"","red","left");
				}
			}
			if (Player.Inventory[id].Attack > 0) {
				Player.WeaponAttack = Player.Inventory[id].Attack;
				Player.WeaponName = Player.Inventory[id].Name;
				
				if (Player.WeaponName == "Fists") { //error here
					//$(LOCATION).html(areaName).after(" with your <em style='color:orange;'>Fists</em>");
				} else {
					//$(LOCATION).html(areaName).after(" with the <em style='color:orange;'>" + Player.WeaponName + '</em>');
				}
		
				Engine.Print("\"I've equipped my " + Player.Inventory[id].Name + ". It gives me +" + Player.Inventory[id].Attack + " attack!\"","lightgreen","left");
			}
			if (Player.Inventory[id].Hunger == 0 && Player.Inventory[id].Thirst == 0 && Player.Inventory[id].Health == 0 && Player.Inventory[id].Attack == 0 && Player.Inventory[id].Container == 0) {
				Engine.Print("\"It's a " + Player.Inventory[id].Name + "\"","orange","left");
			}
			if (removeItem == true) {
				Player.Inventory.splice(id,1);
			}
			Engine.CheckHealth("used");
			Engine.CheckHungerThirst();
		}
	},
	Camel: function(str) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
			return index == 0 ? letter.toUpperCase() : letter.toUpperCase();
		});
	},
	UpdateWeight: function() {
		var totalWeight = 0;
		for (var i = 0; i < Player.Inventory.length; i++) {
			totalWeight = totalWeight + Player.Inventory[i].Weight;
		}
		if (Engine.Dec((Player.Strength - totalWeight) + Player.Container) > 0) {
			Player.Encumbered = false;
		} else {
			Player.Encumbered = true;
		}
		$('.weight').html("I can carry " + Engine.Dec((Player.Strength - totalWeight) + Player.Container) + "kg more");
	},
	Dec: function(num) {
		return Math.round(num * 100) / 100;
	},
	TestRandom: function(num) {
		for (var n = 0; n < num; n++) {
			console.log( Areas[Engine.GetArea()].Name );
		}
	},
	GetArea: function() {
		var areaRarity = Math.floor(Math.random() * 100);
		var rarity = 0;
		if (areaRarity >= 0 && areaRarity < 40) {
			rarity = 0;
		} else if (areaRarity >= 40 && areaRarity < 70) {
			rarity = 1;
		} else if (areaRarity >= 70 && areaRarity < 85) {
			rarity = 2;
		} else if (areaRarity >= 85 && areaRarity < 99) {
			rarity = 3;
		}
		var randomStartingArea = Math.floor(Math.random() * Areas.length);
		return randomStartingArea;
	},
	GenerateMap: function(start, load) {
		Player.Exploring = false;
		if (start == true) {
			var randomStartingArea = Engine.GetArea();
			Player.Explored.push(randomStartingArea);
			
			if (Player.Difficulty == "easy") {
				Player.Alerted = 8;
				Player.Awareness = 8;
			} else if (Player.Difficulty == "medium") {
				Player.Alerted = 5;
				Player.Awareness = 5;
			} else if (Player.Difficulty == "hard") {
				Player.Alerted = 3;
				Player.Awareness = 3;
			}
			if (load == "load") {
				Engine.Print("\I've loaded progress from my journal\"", "lightgreen","left");
			} else {
				Engine.Print("\"I've arrived!\"","lightgreen","left");
			}
			Player.Exploring = true;
			Engine.UpdateScreen();
		} else if (start == false) {	
			var travelSpeed = 4000 / Player.Speed;
			if (Player.Sneaking == true) {
				travelSpeed = travelSpeed * 2;
			}
			$(ACTIONBAR).animate({
				"width": "100%"
			}, travelSpeed, function() {
				$(this).css('width','0%');
				Player.Hunger--;
				Player.Thirst--;
				Engine.CheckHungerThirst();
				
				$('#fast,#slow').css({
					"background-color":"white",
					"color":"black"
				});
								
				$('#travel').css({
					"background-color":"white",
					"color":"black"
				});
		
				var randomStartingArea = Math.floor(Math.random() * Areas.length);
				Player.Exploring = true;
				Player.Explored.push(randomStartingArea);
				var visited = "";
				$('li').remove();
				Player.Travelling = false;
				Player.Distance += eval("0." + Math.floor(Math.random() * 4));
				$('.distance').html("I have travelled " + Engine.Dec(Player.Distance) + ' Miles travelled');
				Engine.Print("\"I've reach the destination.\"","lightgreen","left");
				if (Player.Sneaking == true) {
					Player.Experience.Stealth += 2;
				} else {
					Player.Experience.Speed += 2;
					Player.Experience.Strength++;
				}
				Engine.CheckExperience();
				if (Player.Alerted < 0) { Player.Alerted = 0; }
				Player.Alerted = Player.Alerted + 1;
				if (Player.Alerted > 4) {
					if (Player.Alerted > 10) {
						Player.Alerted = 10;
					}
				} else {
					if (Player.Alerted > 4) {
						Player.Alerted = 4;
					}
				}
				Engine.UpdateAlertness();
				Engine.UpdateScreen();
			});
		}
	},
	UpdateAlertness: function() {
		$('.awareness').remove();
		for (var a = 0; a < Player.Alerted; a++) {
			$('.alertness').append('<span class="awareness">&#9763;</span>');
		}
		if (Player.Alerted >= 4) {
			$('.awareness').css('color','lightblue');
		} else if (Player.Alerted == 3) {
			$('.awareness').css('color','lightgreen');
		} else if (Player.Alerted == 2) {
			$('.awareness').css('color','orange');
		} else if (Player.Alerted == 1) {
			$('.awareness').css('color','red');
		}
	},
	Print: function(text, colour, align) {
		if (align) {
			$(OUTPUT).prepend("<li class='bubble animated slideInLeft' style='text-align: " + align + "; color: " + colour + "'>" + text + "</li>");
		} else {
			$(OUTPUT).prepend("<li class='bubble animated slideInLeft' style='color: " + colour + "'>" + text + "</li>");
		}
	},
	Attacked: function(regen) {
		var whatEnemy = 0;
		if (Player.Strength == 1) {
			whatEnemy = 0;
		} else if (Player.Strength == 2) {
			whatEnemy = 1;
		} else if (Player.Strength == 3) {
			whatEnemy = 2;
		} else if (Player.Strength == 4) {
			whatEnemy = 3;
		}
		$('#light h2 span').html(Engine.Camel(Enemies[whatEnemy].Name));
		if (Player.WeaponAttack == 0) {
			$('#light h2 span#attackingweapon').html("Fists");
		} else {
			$('#light h2 span#attackingweapon').html(Player.WeaponName);
		}
		$('#light h2 .enemyhp').html(Enemies[whatEnemy].Health);
		Engine.Print("\"I got attacked by a " + Enemies[whatEnemy].Name + ", I need to pay more attention\"","red","left");
		var thisHP = Enemies[whatEnemy].Health;
		setTimeout(function() {
			$('#fade,#light').fadeIn(500);
			var a = 0;
			var d = 0;
			$('.attack').off();
			$('.attack').on('click', function() {
				if  (Player.Attacking == false) {
					Player.Attacking = true;
					clearTimeout(Engine.EventTimer);
					Engine.EventTimer = null;
					Engine.RunEventTimer();
					a = Engine.Dec(Math.floor(Math.floor(Math.random() * Player.Strength) / 3)) + Player.WeaponAttack;
					s = 0;
					thisHP -= a;
					if (thisHP < 0) { thisHP = 0; }
					$('#light h2 .enemyhp').html(thisHP);
					if (thisHP <= 0) {
						$('#fade,#light').fadeOut(500);
						Engine.Print("\"You killed the bastard!\"", "lightgreen","left");
						Player.Attacking = false;
						Player.Experience.Strength++;
						Engine.CheckExperience();
					} else {
						Player.Health = Player.Health - Math.floor(Math.random() * Enemies[whatEnemy].Attack);
						$('#result').html("&gt;&gt; OUCH! &lt;&lt;");
						setTimeout(function() {
							$('#result').html("");
							Player.Attacking = false;
						}, 500);
						Engine.CheckHealth("attacked");
					}
				}
				return false;
			});
			$('.defend').off();
			$('.defend').on('click', function() {	
				if  (Player.Attacking == false) {
					Player.Attacking = true;	
					clearTimeout(Engine.EventTimer);
					Engine.EventTimer = null;
					Engine.RunEventTimer();
					a = 0;
					s = Math.floor(Math.random() * Player.Stealth) + Player.Dexterity;
					Player.Health = Player.Health - Math.floor(Math.floor(Math.random() * Enemies[whatEnemy].Attack) - d);
					$('#result').html("Blocked!");
					setTimeout(function() {
						$('#result').html("");
						Player.Attacking = false;
					}, 500);
					Player.Experience.Dexterity += 0.5;
					Player.Experience.Stealth += 0.5;
					Engine.CheckExperience();
					Engine.CheckHealth("attacked");
				}
				return false;
			});
			$('.retreat').off();
			$('.retreat').on('click', function() {
				var chance = Math.floor(Math.floor(Math.random() * 100) / Player.Speed);
				if (chance < 25) {
					$('#fade,#light').css('display','none');
					Engine.Print("\"I'm running away!!\"", "lightgreen","left");
					Engine.Travel();
				} else {
					$('#result').html("It followed me!");
					setTimeout(function() {
						$('#result').html("");
					}, 500);
					Player.Health = Player.Health - Math.floor(Math.random() * Enemies[whatEnemy].Attack);
					Engine.CheckHealth("retreat");
				}
				return false;
			});
		}, 750);
		if (regen == 0) {
			
		} else {
			Player.Alerted = Player.Awareness; //reset
		}
		Engine.UpdateAlertness();
		var a = Math.random() * 25 - 5;
		var x = Math.floor(Math.random() * 25) + 40;
		var y = Math.floor(Math.random() * 400) + 32;
		$('body').prepend('<div class="zombiesound animated zoomIn" style="color: red; top: ' + y + 'px; left: ' + x + '%; font-size: 128px; transform:rotate(' + a + 'deg) scale(1.25);">ARRRGHHHH!</div>');
		$('.zombiesound').delay(2000).animate({
			"opacity":0.0,
			"font-size": "0px"
		}, 4500, function() {
			$(this).remove();
		});
	},
	AddSound: function(bad) {
		if (bad == true) {
			Player.Alerted--;
			if (Player.Alerted < 0) {
				Engine.Attacked();
			}
			var a = Math.random() * 25 - 5;
			var x = Math.floor(Math.random() * 25) + 50;
			var y = Math.floor(Math.random() * 400) + 32;
			var r = Math.floor(Math.random() * 50) + 100;
			var g = Math.floor(Math.random() * 50) + 100;
			var b = Math.floor(Math.random() * 50) + 100;
			var t = Math.floor(Math.random() * 8);
			var text = "";
			switch(t) {
				case 0:
					text = "Groan";
					break;
				case 1:
					text = "Moan";
					break;
				case 2:
					text = "Creek";
					break;
				case 3:
					text = "Shuffle";
					break;
				case 4:
					text = "Scream";
					break;
				case 5:
					text = "..BANG..";
					break;
				case 6:
					text = "moaaan..";
					break;
				case 7:
					text = "Ggrrgh..gh..";
					break;
					break;
				default:
					break;
			}
			$('body').prepend('<div class="zombiesound animated zoomIn" style="color: rgb(255,'+g+','+b+'); top: ' + y + 'px; left: ' + x + '%; transform:rotate(' + a + 'deg) scale(1.25);">' + text + '</div>');
			Engine.UpdateAlertness();
			$('.zombiesound').delay(2000).animate({
				"opacity":0.0,
				"font-size": "0px"
			}, 8500, function() {
				$(this).remove();
			});
		}
	},
	Search: function(speed) {
		if (Player.Exploring == true && Player.Travelling == false) {
			if (Player.Searching == false) {
				Player.Searching = true;
				var searchTime = 5000;
				var alerted = Math.floor(Math.random() * 100) / Player.Stealth;
				var extra = 2;
				if (speed == "fast") {
					searchTime = Math.ceil(searchTime / (Player.Dexterity + 1));
					alerted + 45;
					extra = 1;
				}
				var stealthy = (Player.Stealth - 1) * 10;
				alerted -= stealthy;
				//console.log(alerted);
				if (alerted > 65) {
					var text = Math.floor(Math.random() * 3);
					switch(text) {
						case 0:
							Engine.Print("\"What was that sound?!\"","red","left");
							break;
						case 1:
							Engine.Print("\"Damn, that made me jump!\"","red","left");
							break;
						case 2:
							Engine.Print("\"Christ, I hope that wasn't <em>them</em>...\"","red","left");
							break;
						default:
							break;
					}
					Engine.AddSound(true);
					Player.Searching = false;
				} else {
					Engine.Print("\"I'm searching...\"","orange","left");
					$(ACTIONBAR).animate({
						"width": "100%"
					}, searchTime, function() {
						Player.Experience.Dexterity += extra;
						Player.Experience.Search += extra;
						Engine.CheckExperience();
						$(this).css('width','0px');
						Engine.FindItems(speed);
						Player.Clicks++;
						$('#clicks .searches').html("I have conducted " + Player.Clicks + " Searches");
						Player.Searching = false;
					});
				}
			} else {
				Engine.Print("\"Slow down. I'm still searching!\"","red","left");
			}
		}
	},
	CheckExperience: function() {
		$('#strengthXP').css('width',Math.floor(Player.Experience.Strength * 2) + "%");
		$('#dexterityXP').css('width',Math.floor(Player.Experience.Dexterity * 2) + "%");
		$('#healingXP').css('width',Math.floor(Player.Experience.Healing * 2) + "%");
		$('#stealthXP').css('width',Math.floor(Player.Experience.Stealth * 2) + "%");
		$('#searchXP').css('width',Math.floor(Player.Experience.Search * 2) + "%");
		$('#speedXP').css('width',Math.floor(Player.Experience.Speed * 2) + "%");
		
		if (Player.Experience.Strength >= 50) {
			Player.Strength += 1.0;
			Player.Experience.Strength = 0;
			Engine.Print("\"I feel strnger!\"", "gold","center");
		}
		if (Player.Experience.Dexterity >= 50) {
			Player.Dexterity += 1;
			Player.Experience.Dexterity = 0;
			Engine.Print("\"I feel more nimble!\"", "gold","center");
		}
		if (Player.Experience.Healing >= 50) {
			Player.Healing += 1;
			Player.Experience.Healing = 0;
			Engine.Print("\"I understand healing better now!\"", "gold","center");
		}
		if (Player.Experience.Stealth >= 50) {
			Player.Stealth += 1;
			Player.Experience.Stealth = 0;
			Engine.Print("\"I feel as quiet as a mouse!\"", "gold","center");
		}
		if (Player.Experience.Search >= 50) {
			Player.Search += 1;
			Player.Experience.Search = 0;
			Engine.Print("\"I've got a keen eye!\"", "gold","center");
		}
		if (Player.Experience.Speed >= 50) {
			Player.Speed += 1;
			Player.Experience.Speed = 0;
			Engine.Print("\"I feel faster!\"", "gold","center");
		}
		
		$('#strengthXP').css('width',Math.floor(Player.Experience.Strength * 2) + "%");
		$('#dexterityXP').css('width',Math.floor(Player.Experience.Dexterity * 2) + "%");
		$('#healingXP').css('width',Math.floor(Player.Experience.Healing * 2) + "%");
		$('#stealthXP').css('width',Math.floor(Player.Experience.Stealth * 2) + "%");
		$('#searchXP').css('width',Math.floor(Player.Experience.Search * 2) + "%");
		$('#speedXP').css('width',Math.floor(Player.Experience.Speed * 2) + "%");
	},
	TakeItem: function(item, ele) {
		var weight = Items[item].Weight;
		var totalWeight = 0;
		for (var i = 0; i < Player.Inventory.length; i++) {
			totalWeight = totalWeight + Player.Inventory[i].Weight;
		}
		if (totalWeight + weight <= (Player.Strength + Player.Container)) {
			$(ele).fadeOut(350);
			if ($(ele).children('span').length < 1) {
				if ($(ele).parent().children('.item').length > 1) {
					$(ele).remove();
				} else {
					$(ele).parent().remove();
				}
			}
			Engine.Print("\"I've picked it up\"", "lightgreen");
			Player.Inventory.push(Items[item]);
			Engine.UpdateWeight();
		} else {
			Engine.Print("\"The " + Items[item].Name + " is was heavy, now I'm carrying too much\"","red","left");
			Player.Encumbered = true;
		}
	},
	FindItems: function(speed) {
		if (Player.Exploring == true && Player.Travelling == false) {
			var chance = Math.floor(Math.random() * 100) - (5 * Player.Search);
			if (chance < Areas[Player.Explored[Player.Explored.length-1]].LootChance) {
				var howManyItems = Math.floor(Math.random() * 1);
				howManyItems = 1 + Math.floor(Math.random() * Player.Search);
				if (speed == "slow") {
					howManyItems += Math.floor(Math.random() * 2);
				}
				var text  = "You found " + howManyItems + " items:<br />";
					for (var i = 0; i < howManyItems; i++) {
						Engine.Collectables.push(i);
						var randomItem = Math.floor(Math.random() * Items.length);
						var stats = "Weighs: " + Items[randomItem].Weight + ", ";
						if (Items[randomItem].Hunger > 0) {
							stats += "Hunger: " + Items[randomItem].Hunger + ", ";
						}
						if (Items[randomItem].Thirst > 0) {
							stats += "Thirst: " + Items[randomItem].Thirst + ", ";
						}
						if (Items[randomItem].Health > 0) {
							stats += "Health: " + Items[randomItem].Health + ", ";
						}
						if (Items[randomItem].Attack > 0) {
							stats += "Attack: " + Items[randomItem].Attack + ", ";
						}
						
						text += "<span class='item mastertooltip' title='" + stats + "' name='" + randomItem + "'>" + Items[randomItem].Name + " (" + Items[randomItem].Weight + "kg]" + "</span>";
					}
				Engine.Print(text, "lightgreen","left");
				$('.item').on('click', function() {
					var ele = $(this);
					var id = $(this).attr("name");
					Engine.TakeItem(id, ele);
					return false;
				}).hover(function(){
						// Hover over code
						var title = $(this).attr('title');
						$(this).data('tipText', title).removeAttr('title');
						$('<p class="tooltip"></p>')
						.text(title)
						.appendTo('body')
						.fadeIn('fast');
				}, function() {
						// Hover out code
						$(this).attr('title', $(this).data('tipText'));
						$('.tooltip').remove();
				}).mousemove(function(e) {
						var mousex = e.pageX + 20; //Get X coordinates
						var mousey = e.pageY + 10; //Get Y coordinates
						$('.tooltip')
						.css({ top: mousey, left: mousex })
				});
			} else {
				var text = Math.floor(Math.random() * 3);
				switch(text) {
					case 0:
						Engine.Print("\"I couldn't find anything useful... Did I look everywhere?\"","orange","left");
						break;
					case 1:
						Engine.Print("\"Nope, nothing yet...\"","orange","left");
						break;
					case 2:
						Engine.Print("\"I didn't find anything there, perhaps over there...?\"","orange","left");
						break;
					default:
						break;
				}
			}
			var endExploring = Math.floor(Math.random() * 100);
			if (endExploring < Math.floor(25 / Player.Looting)) {
				Player.Exploring = false;
				$('#fast,#slow').css({
					"background-color":"red",
					"color":"white"
				});
				Engine.Print("\"I've searched everywhere, this place is empty\"","red","center");
			}
		}
	},
	UpdateScreen: function() {
		var areaName = Engine.Camel(Areas[Player.Explored[Player.Explored.length-1]].Name);
		var lootChance = Areas[Player.Explored[Player.Explored.length-1]].LootChance;
		$('#locName').animate({
			"opacity":0.0
		}, 350, function() {
			$('#locName').attr('src','');
			Engine.GetImage(areaName);
			setTimeout(function() {
				$('#locName').animate({
					"opacity":1.0
				}, 350);
			}, 1000);
		});
		$(LOCATION).html(areaName + " (" + lootChance + "% loot chance)");
		var areaDescLength = Math.floor(Math.random() * 3) + 1;
		var areaDescText = "\"";
		var theseDesc = Descriptions;
		for (var a = 0; a < areaDescLength; a++) {
			var areaDesc = Math.floor(Math.random() * theseDesc.length);
			if (a == 1) { 
				areaDescText += ", ";
			}
			if (a == 2) {
				areaDescText += " and ";
			}
			areaDescText += theseDesc[areaDesc];
			theseDesc.splice(areaDesc,1);
		}
		$(DESCRIPTION).html(areaDescText + "\"");
	},
	EventTimer: null,
	RunEventTimer: function() {
		var worldEventChance = Math.floor(Math.random() * 100);
		if (worldEventChance < 5) {
			/** Unfinished world events 
			clearTimeout(Engine.EventTimer);
			Engine.EventTimer = null;
			var whatSkill = Math.floor(Math.random() * 6);
			switch(whatSkill) {
				case 0:
					Engine.Print("\"I read a book on cross training! (+5 Srength XP)\"", "lightgreen", "center");
					Player.Experience.Strength += 5;
					break;
				case 1:
					Engine.Print("\"I read a book on acrobatics! (+5 Dexterity XP)\"", "lightgreen", "center");
					Player.Experience.Dexterity += 5;
					break;
				case 2:
					Engine.Print("\"I read a book on medical proceedures! (+5 Healing XP)\"", "lightgreen", "center");
					Player.Experience.Healing += 5;
					break;
				case 3:
					Engine.Print("\"I read a book on Stealth! (+5 Stealth XP)\"", "lightgreen", "center");
					Player.Experience.Stealth += 5;
					break;
				case 4:
					Engine.Print("\"I read a book on perception! (+5 Search XP)\"", "lightgreen", "center");
					Player.Experience.Search += 5;
					break;
				case 5:
					Engine.Print("\"I read a book on athletics! (+5 Speed XP)\"", "lightgreen", "center");
					Player.Experience.Speed += 5;
					break;
				default:
					break;
			}
			Engine.CheckExperience();
			Engine.RunEventTimer();
			**/
		} else {
			Engine.EventTimer = setTimeout(function() {
				if (Player.Asleep == false) {
					if (Player.Alerted == 4) {
						Engine.Print("\"They are around 500 meters away\"","red","left");
					} else if (Player.Alerted == 3) {
						Engine.Print("\"Come on, they're getting closer!\"","red","left");
					} else if (Player.Alerted == 2) {
						Engine.Print("\"They are around 200 meters away\"","red","left");
					} else if (Player.Alerted == 1) {
						Engine.Print("\"Shit, come on! come on! They are 100 meters away!!\"","red","left");
					}
					if (Player.Alerted <= 0) {
						Engine.Attacked(0);
					}
					Player.Alerted--;
					Engine.UpdateAlertness();
					clearTimeout(Engine.EventTimer);
					Engine.EventTimer = null;
					Engine.RunEventTimer();
				}
			}, 15000);
		}
	}
};

var Player = {
	//stats
	Name: "Bob",
	Gender: "male",
	Clicks: 0,
	Explored: [],
	Exploring: false,
	Searching: false,
	Difficulty: "easy",
	Alerted: 4, //4 default
	Awareness: 4,
	Health: 100,
	Thirst: 50,
	Attacking: false,
	Hunger: 50,
	Sneaking: false,
	Face: { x:0,y:0 },
	Distance: 0.0,
	Encumbered: false,
	Travelling: false,
	ContainerName: "",
	Container: 0,
	Asleep: false,
	//levels
	Experience: {
		Strength: 0,
		Dexterity: 0,
		Healing: 0,
		Stealth: 0,
		Search: 0,
		Speed: 0
	},
	//skills
	Strength: 7.0, //kg
	Dexterity: 1,
	Healing: 1,
	Search: 1,
	Speed: 1,
	Stealth: 1,
	Looting: 1,
	WeaponAttack: 0,
	WeaponName: "Fists",
	Score: 0,
	//carrying
	Inventory: [
		{ Name: "apple", Hunger: 25, Thirst: 25, Health: 0, Weight: 0.2, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" }
	],
	Container: 0,
	ContainerName: ""
};

function resize() {
	$('#left-wrapper,#center-wrapper,#right-wrapper').css({
		'height':$(document).height()
	});
}
window.onload = function() {
	$(TITLE).html(GameName + "<sup>" + GameVersion + "</sup>");
	$('.randomname').click();
	var q = Math.floor(Math.random() * quotes.length);
	$('#quote').html("\"" + quotes[q] + "\"");
	resize();
	
	$('.masterTooltip, .vBar').hover(function(){
			// Hover over code
			var title = $(this).attr('title');
			$(this).data('tipText', title).removeAttr('title');
			$('<p class="tooltip"></p>')
			.text(title)
			.appendTo('body')
			.fadeIn('fast');
	}, function() {
			// Hover out code
			$(this).attr('title', $(this).data('tipText'));
			$('.tooltip').remove();
	}).mousemove(function(e) {
			var mousex = e.pageX + 20; //Get X coordinates
			var mousey = e.pageY + 10; //Get Y coordinates
			$('.tooltip')
			.css({ top: mousey, left: mousex })
	});
};
$(window).resize(function() {
	resize();
});
$(window).scroll(function() {
	resize();
});

