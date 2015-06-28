var Enemies = [
	{ Name: "slow rotting zombie", Attack: 7, Defence: 1, Health: 25 }, //level 0
	{ Name: "slow fresh zombie", Attack: 10, Defence: 2, Health: 30 }, //level 1
	{ Name: "walking zombie", Attack: 20, Defence: 3, Health: 40 }, //level 2
	{ Name: "sprinting zombie", Attack: 30, Defence: 4, Health: 50 } //level 3
];

var Craftables = [
	{ Name: "nailed baseball bat", ingredients: ["nails","baseball bat"] },
	{ Name: "hairspray bomb", ingredients: ["lighter","hairspray"] }
];

var Areas = [
	//rarity: 
	//0 = common, 1 = shops and common sites, 2 = uncommon sites, 3 = rare places, military and isolated areas, 4 = ultra rare.
	//LootChance = the percentage chance you will find something in a single search.
	{ Name: "red brick house", LootChance: 50, LootType: "house", rarity: 0 },
	{ Name: "stone house", LootChance: 50, LootType: "house", rarity: 0 },
	{ Name: "small shed", LootChance: 50, LootType: "farm", rarity: 0 },
	{ Name: "large shed", LootChance: 75, LootType: "farm", rarity: 0 },
	{ Name: "log cabin", LootChance: 25, LootType: "house", rarity: 3 },
	{ Name: "large house", LootChance: 50, LootType: "house", rarity: 1 },
	{ Name: "modern house", LootChance: 50, LootType: "house", rarity: 1 },
	{ Name: "old house", LootChance: 50, LootType: "house", rarity: 0 },
	{ Name: "wooden house", LootChance: 75, LootType: "house", rarity: 0 },
	
	{ Name: "shoe shop", LootChance: 75, LootType: "shop", rarity: 1 },
	{ Name: "corner shop", LootChance: 75, LootType: "shop", rarity: 1 },
	{ Name: "coffee shop", LootChance: 75, LootType: "shop", rarity: 1 },
	{ Name: "charity shop", LootChance: 50, LootType: "shop", rarity: 1 },
	
	{ Name: "old barn", LootChance: 25, LootType: "farm", rarity: 1 },
	{ Name: "field", LootChance: 10, LootType: "farm", rarity: 1 },
	{ Name: "forest", LootChance: 10, LootType: "farm", rarity: 1 },
	
	{ Name: "construction site", LootChance: 50, LootType: "building", rarity: 1 },
	{ Name: "steel factory", LootChance: 25, LootType: "building", rarity: 2 },
	
	{ Name: "police station", LootChance: 25, LootType: "police", rarity: 2 },
	{ Name: "crashed police car", LootChance: 15, LootType: "police", rarity: 3 },
	
	{ Name: "crashed car", LootChance: 15, LootType: "other", rarity: 0 },
	{ Name: "carpark", LootChance: 15, LootType: "other", rarity: 0 },
	{ Name: "playground", LootChance: 5, LootType: "other", rarity: 0 },
	{ Name: "empty street", LootChance: 10, LootType: "other", rarity: 0 },
	{ Name: "bank", LootChance: 10, LootType: "other", rarity: 2 },
	{ Name: "alleyway", LootChance: 5, LootType: "other", rarity: 0 },
	{ Name: "museum", LootChance: 10, LootType: "other", rarity: 3 },
	{ Name: "airport", LootChance: 75, LootType: "other", rarity: 3 },
	{ Name: "cabin in the woods", LootChance: 90, LootType: "other", rarity: 4 },
	{ Name: "lighthouse", LootChance: 80, LootType: "other", rarity: 4 },
	
	{ Name: "health clinic", LootChance: 25, LootType: "medical", rarity: 2 },
	{ Name: "doctors surgery", LootChance: 50, LootType: "medical", rarity: 1 },
	{ Name: "drop-in center", LootChance: 50, LootType: "medical", rarity: 1 },
	{ Name: "hospital", LootChance: 50, LootType: "medical", rarity: 3 },
	
	{ Name: "military bunker", LootChance: 50, LootType: "military", rarity: 3 },
	{ Name: "military blockade", LootChance: 15, LootType: "military", rarity: 3 },
	
	{ Name: "petrol station", LootChance: 15, LootType: "petrol", rarity: 0 },
	{ Name: "service station", LootChance: 25, LootType: "petrol", rarity: 0 }
];

var Descriptions = [
	"it looks abandoned",
	"no one has been here for a while",
	"it is devoid of life",
	"i've seen nicer",
	"in its hayday, this would of looked nice",
	"there are bodies everywhere",
	"it has looked better",
	"it smells awful",
	"it needs a lick of paint",
	"the paint is peeling",
	"the windows are smashed",
	"the door is broken",
	"the smell is foul",
	"the smell of charred bodies fills the air",
	"there's blood all over",
	"smalls like someone shit in here",
	"there are rats everywhere",
	"it is in surprisingly good shape considering",
	"it feels sad in here",
	"it would of looked nice before all this shit",
	"it wouldn't last much longer",
	"i don't like the look of it",
	"it doesn't look fun",
	"it's dark",
	"it's light",
	"it's overgrown",
	"it's decimated",
	"it smells",
	"its painted green",
	"its painted yellow",
	"its painted white",
	"its painted blue",
	"its painted red",
	"its painted brown",
	"its from the 70s",
	"its from the 80s",
	"its from the 90s",
	"this used to be famous i think"
];

var Items = [
	{ Name: "tin can", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.2, Attack: 0, Exp: 0, Areas: "house,farm,medical,other" },
	{ Name: "newspaper", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.2, Attack: 0, Exp: 0, Areas: "house,farm,medical,other" },
	{ Name: "magazine", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.2, Attack: 0, Exp: 0, Areas: "house,farm,medical,other" },
	{ Name: "lighter", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.1, Attack: 0, Exp: 0, Areas: "house,farm,medical,other" },
	{ Name: "hairspray", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.4, Attack: 0, Exp: 0, Areas: "house,farm,other" },
	{ Name: "nails", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.01, Attack: 0, Exp: 0, Areas: "house,farm,medical,other" },
	{ Name: "coins", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.2, Attack: 0, Exp: 0, Areas: "all" },
	{ Name: "tissue", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.1, Attack: 0, Exp: 0, Areas: "other" },
	{ Name: "thimble", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.1, Attack: 0, Exp: 0, Areas: "house,farm,medical,other" },
	{ Name: "roll of tape", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.1, Attack: 0, Exp: 0, Areas: "house,other" },
	{ Name: "saftey pin", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.1, Attack: 0, Exp: 0, Areas: "house,medical,other" },
	
	{ Name: "apple", Hunger: 25, Thirst: 25, Health: 0, Weight: 0.2, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "dry noodles", Hunger: 35, Thirst: 1, Health: 0, Weight: 0.2, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "cheetos", Hunger: 15, Thirst: 1, Health: 0, Weight: 0.2, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "snickers", Hunger: 15, Thirst: 1, Health: 0, Weight: 0.2, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "chocolate", Hunger: 15, Thirst: 1, Health: 0, Weight: 0.2, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "biscuits", Hunger: 25, Thirst: 1, Health: 0, Weight: 0.2, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "some cake", Hunger: 50, Thirst: 1, Health: 0, Weight: 0.2, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "banana", Hunger: 15, Thirst: 5, Health: 0, Weight: 0.2, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "pear", Hunger: 25, Thirst: 15, Health: 0, Weight: 0.2, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "pineapple", Hunger: 30, Thirst: 35, Health: 0, Weight: 1, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "kiwi", Hunger: 5, Thirst: 25, Health: 0, Weight: 0.1, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "canned spaghetti", Hunger: 25, Thirst: 25, Health: 0, Weight: 0.3, Attack: 0, Exp: 3, Areas: "house,farm,medical,other" },
	{ Name: "canned peaches", Hunger: 25, Thirst: 25, Health: 0, Weight: 0.3, Attack: 0, Exp: 3, Areas: "house,farm,medical,other" },
	{ Name: "pepsi", Hunger: 5, Thirst: 65, Health: 0, Weight: 0.3, Attack: 0, Exp: 3, Areas: "house,farm,medical,other" },
	{ Name: "coke", Hunger: 5, Thirst: 65, Health: 0, Weight: 0.3, Attack: 0, Exp: 3, Areas: "house,farm,medical,other" },
	{ Name: "evian water", Hunger: 5, Thirst: 65, Health: 0, Weight: 0.3, Attack: 0, Exp: 3, Areas: "house,farm,medical,other" },
	{ Name: "ribena", Hunger: 5, Thirst: 65, Health: 0, Weight: 0.3, Attack: 0, Exp: 3, Areas: "house,farm,medical,other" },
	{ Name: "full water bottle", Hunger: 0, Thirst: 75, Health: 0, Weight: 0.3, Attack: 0, Exp: 3, Areas: "house,farm,medical,other" },
	{ Name: "half full water bottle", Hunger: 0, Thirst: 35, Health: 0, Weight: 0.3, Attack: 0, Exp: 3, Areas: "house,farm,medical,other" },
	{ Name: "iced tea", Hunger: 5, Thirst: 65, Health: 0, Weight: 0.3, Attack: 0, Exp: 3, Areas: "house,farm,medical,other" },
	{ Name: "pumpkin", Hunger: 45, Thirst: 15, Health: 0, Weight: 1.0, Attack: 0, Exp: 3, Areas: "house,farm,medical,other" },
	
	{ Name: "plasters", Hunger: 0, Thirst: 0, Health: 5, Weight: 0.1, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "bandages", Hunger: 0, Thirst: 0, Health: 10, Weight: 0.2, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "small firstaid kit", Hunger: 0, Thirst: 0, Health: 20, Weight: 0.6, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	{ Name: "large firstaid kit", Hunger: 0, Thirst: 0, Health: 35, Weight: 0.8, Attack: 0, Exp: 1, Areas: "house,farm,medical,other" },
	
	{ Name: "butter knife", Hunger: 0, Thirst: 0, Health: 0, Weight: 0.2, Attack: 1, Exp: 2, Areas: "house,farm,medical,other" },
	{ Name: "broom handle", Hunger: 0, Thirst: 0, Health: 0, Weight: 2, Attack: 1, Exp: 2, Areas: "house,farm,building,medical,other" },
	{ Name: "scissors", Hunger: 0, Thirst: 0, Health: 0, Weight: 1, Attack: 1, Exp: 2, Areas: "house,farm,medical,other" },
	{ Name: "knife", Hunger: 0, Thirst: 0, Health: 0, Weight: 1.0, Attack: 2, Exp: 2, Areas: "house,farm,other" },
	{ Name: "baton", Hunger: 0, Thirst: 0, Health: 0, Weight: 3, Attack: 2, Exp: 3, Areas: "police,military" },
	{ Name: "pitchfork", Hunger: 0, Thirst: 0, Health: 0, Weight: 4, Attack: 3, Exp: 3, Areas: "farm" },
	{ Name: "baseball bat", Hunger: 0, Thirst: 0, Health: 0, Weight: 4, Attack: 2, Exp: 3, Areas: "house,farm,other" },
	{ Name: "hatchet", Hunger: 0, Thirst: 0, Health: 0, Weight: 3.5, Attack: 3, Exp: 4, Areas: "farm" },
	{ Name: "fire axe", Hunger: 0, Thirst: 0, Health: 0, Weight: 4, Attack: 4, Exp: 5, Areas: "farm" },
	{ Name: "bow", Hunger: 0, Thirst: 0, Health: 0, Weight: 2, Attack: 3, Exp: 6, Areas: "farm" },
	{ Name: "crowbar", Hunger: 0, Thirst: 0, Health: 0, Weight: 3, Attack: 2, Exp: 2, Areas: "building" },
	{ Name: "police baton", Hunger: 0, Thirst: 0, Health: 0, Weight: 3, Attack: 3, Exp: 3, Areas: "police" },
	
	{ Name: "plastic bag", Container: 1, Hunger: 0, Thirst: 0, Health: 0, Weight: 0.1, Attack: 0, Exp: 6, Areas: "house,farm,medical,other" },
	{ Name: "small backpack", Container: 3, Hunger: 0, Thirst: 0, Health: 0, Weight: 0.1, Attack: 0, Exp: 6, Areas: "house,farm,medical,other" },
	{ Name: "medium backpack", Container: 5, Hunger: 0, Thirst: 0, Health: 0, Weight: 0.1, Attack: 0, Exp: 6, Areas: "house,farm,medical,other" }
];
var quotes = [
	"When there's no more room in hell, the dead will walk the earth.",
	"You've got red on you.",
	"Yeah, they're dead. They're all messed up.",
	"In those moments where you're not quite sure if the undead are really dead, dead, don't get all stingy with your bullets.",
	"You're all going to die down here.",
	"They're coming to get you, Barbra.",
	"In the brain and not the chest. Head shots are the very best." ,
	"He's got an arm off!"
];