window.addEventListener("keydown", function(e) {
	switch(e.keyCode) {
		case 83: //(s)low
			$('#slow').click();
			break;
		case 70: //(f)ast
			$('#fast').click();
			break;
		case 73: //(i)nventory
			$('#inventory').click();
			break;
		case 82: //(r)est
			$('#rest').click();
			break;
		case 84: //(t)ravel
			$('#travel').click();
			break;
		case 80: //(p)ause
			$('#pause').click();
			break;
		case 13: //enter = save
			$('#save').click();
			break;
		default:
			break;
	}
});

$('.difficulty').on('click', function () {
	$('.difficulty').removeClass('selected');
	$(this).addClass('selected');
	return false;
});
var paused = false;
$("#unpause").on("click", function() {
	$('#pause').click();
	return false;
});
$("#pause").on("click", function() {		
	if (paused == false) {
		paused = true;
		clearTimeout(Engine.EventTimer);
		clearInterval(Engine.HungerThirstTimer);
		Engine.HungerThirstTimer = null;
		Engine.EventTimer = null;
		$('#fade,.pause').fadeIn(500);
	} else {
		paused = false;
		$('#fade,.pause').fadeOut(500);
		Engine.RunEventTimer();
		Engine.HungerThirstTimer = setInterval(function() {
			Player.Hunger--;
			Player.Thirst--;
			Engine.Save();
			Engine.CheckHungerThirst();
		}, 6000);
	}
	return false;
});
$("#slow").on("click", function() {
	if (Player.Asleep == false) {
		$('.inventoryitem').remove();
		Engine.Search("slow");
	}
	return false;
});
$("#fast").on("click", function() {
	if (Player.Asleep == false) {
		$('.inventoryitem,.discard').remove();
		Engine.Search("fast");
	}
	return false;
});
$("#rest").on("click", function() {
	if (Player.Asleep == false) {
		Engine.Rest();
	}
	return false;
});
$('#randomFace').on('click', function() {
	var x = 81 * Math.floor(Math.random() * 14);
	var y = 103 * Math.floor(Math.random() * 12);
	Player.Face.x = x;
	Player.Face.y = y;
	$('#randomFace').css({
		"background-position": x + "px " + y + "px"
	});
	return false;
});
$('#playme').on('click', function() {
	Player.Difficulty = $('.difficulty.selected').attr('name');
	if (window.localStorage.getItem("Scavenger_Save")) {
		if ($('#name').val().length < 2) {
			alert("Name not long enough...");
		} else {
			var confirmed = confirm("This will overwrite your save file!");
			if (confirmed == true) {
				Player.Name = $('#name').val();
				$('#playername').html(Player.Name);
				$('p,#playme,#load,#name,.difficulty,.remove,#randomFace,#justplay,hr,.randomname,#delete').animate({
					"opacity":0.0
				}, 500, function() {
					$(this).remove();
					$('#play,#xp,#xptitle,.abar,#clicks').fadeIn(500);
					$('#left-wrapper,#right-wrapper').animate({
						"opacity":1.0
					}, 500);
				});
				setTimeout(function() {
					Engine.Init("new");
				}, 1000);
			}
		}
	} else {
		Player.Name = $('#name').val();
		$('#playername').html(Player.Name);
		$('p,#playme,#load,#name,#randomFace,.remove,.difficulty,#justplay,hr,.randomname,#delete').animate({
			"opacity":0.0
		}, 500, function() {
			$(this).remove();
			$('#play,#xp,#xptitle,.abar,#clicks').fadeIn(500);
			$('#left-wrapper,#right-wrapper').animate({
				"opacity":1.0
			}, 500);
		});
		setTimeout(function() {
			Engine.Init("new");
		}, 1000);
	}
	return false;
});
$('#sneak').on('click', function() {
	if (Player.Sneaking == false) {
		Player.Sneaking = true;
		$(this).css({
			"background-color":"lightblue",
			"color":"#111"
		});
	} else {
		Player.Sneaking = false;
		$(this).css({
			"background-color":"white",
			"color":"black"
		});
	}
	return false;
});
$('#load').on('click', function() {
	if (window.localStorage.getItem("Scavenger_Save")) {
		Engine.Load();
		$('p,#load,#playme,#randomFace,.remove,#justplay,hr,.difficulty,#name,.randomname,#delete').animate({
			"opacity":0.0
		}, 500, function() {
			$(this).remove();
			$('#playername').html(Player.Name);
			$('#play,#xp,#xptitle,.abar,#clicks').fadeIn(500);
			$('#left-wrapper,#right-wrapper').animate({
				"opacity":1.0
			}, 500);
		});
		setTimeout(function() {
			Engine.Init("load");
		}, 1000);
	} else {
		alert("No game saved!");
	}
	return false;
});
$('#save').on('click', function() {
	Engine.Save();
	Engine.Print("\I saved my progress in my journal.\"","orange","left");
	return false;
});
$('#delete').on('click', function() {
	var areYouSure = confirm("Sure...?");
	if (areYouSure == true) {
		window.localStorage.removeItem("Scavenger_Save");
		window.localStorage.removeItem("Scavenger_Seed");
	}
	return false;
});
$(".randomname").on("click", function() {	
	Player.Gender = $(this).attr('name');
	var male_fnames = ["Noah","Liam","Mason","Jacob","William","Ethan","Michael","Alexander","James","Daniel","Elijah","Benjamin","Logan","Aiden","Jayden","Matthew","Jackson","David","Lucas","Joseph","Anthony","Andrew","Samuel","Gabriel","Joshua","John","Carter","Luke","Dylan","Christopher","Isaac","Oliver","Henry","Sebastian","Caleb","Owen","Ryan","Nathan","Wyatt","Hunter","Jack","Christian","Landon","Jonathan","Levi","Jaxon","Julian","Isaiah","Eli","Aaron","Charles","Connor","Cameron","Thomas","Jordan","Jeremiah","Nicholas","Evan","Adrian","Gavin","Robert","Brayden","Grayson","Josiah","Colton","Austin","Angel","Jace","Dominic","Kevin","Brandon","Tyler","Parker","Ayden","Jason","Jose","Ian","Chase","Adam","Hudson","Nolan","Zachary","Easton","Blake","Jaxson","Cooper","Lincoln","Xavier","Bentley","Kayden","Carson","Brody","Asher","Nathaniel","Ryder","Justin","Leo","Juan","Luis","Camden"];
	var female_fnames = ["Emma","Olivia","Sophia","Isabella","Ava","Mia","Emily","Abigail","Madison","Charlotte","Harper","Sofia","Avery","Elizabeth","Amelia","Evelyn","Ella","Chloe","Victoria","Aubrey","Grace","Zoey","Natalie","Addison","Lillian","Brooklyn","Lily","Hannah","Layla","Scarlett","Aria","Zoe","Samantha","Anna","Leah","Audrey","Ariana","Allison","Savannah","Arianna","Camila","Penelope","Gabriella","Claire","Aaliyah","Sadie","Riley","Skylar","Nora","Sarah","Hailey","Kaylee","Paisley","Kennedy","Ellie","Peyton","Annabelle","Caroline","Madelyn","Serenity","Aubree","Lucy","Alexa","Alexis","Nevaeh","Stella","Violet","Genesis","Mackenzie","Bella","Autumn","Mila","Kylie","Maya","Piper","Alyssa","Taylor","Eleanor","Melanie","Naomi","Faith","Eva","Katherine","Lydia","Brianna","Julia","Ashley","Khloe","Madeline","Ruby","Sophie","Alexandra","London","Lauren","Gianna","Isabelle","Alice","Vivian","Hadley","Jasmine"];
	
	var lnames = ["Smith","Johnson","Williams","Jones","Brown","Davis","Miller","Wilson","Moore","Taylor","Anderson","Thomas","Reader","Renwick","Jackson","White","Harris","Martin","Thompson","Garcia","Martinez","Robinson","Clark","Rodriguez","Lewis","Lee","Walker","Hall","Allen","Young","Hernandez","King","Wright","Lopez","Hill","Scott","Green","Adams","Baker","Gonzalez","Nelson","Carter","Mitchell","Perez","Roberts","Turner","Phillips","Campbell","Parker","Evans","Edwards","Collin"]
	
	var fname = "";
	var lname = "";
	if (Player.Gender == "male") {
		fname = Math.floor(Math.random() * male_fnames.length);
		lname = Math.floor(Math.random() * lnames.length);
		$('#name').val(male_fnames[fname] + " " + lnames[lname]);
	} else {
		fname = Math.floor(Math.random() * male_fnames.length);
		lname = Math.floor(Math.random() * lnames.length);
		$('#name').val(female_fnames[fname] + " " + lnames[lname]);
	}
	return false;
});