//Version 1.00
//Initial Script for basic starship attributes

on("chat:message",function(msg){
	if(msg.type=="api" && msg.content.indexOf("!importStarship")==0)
	{
	//Must have a token selected
		var selected = msg.selected;
		if (selected===undefined)
		{
			sendChat("API","Please select a token.");
			return;
		};
		
	   //selected token 
		var token = getObj("graphic",selected[0]._id);
		var character = getObj("character",token.get("represents"));
		
		
		var initial = getAttrByName(character.id, 'starship_data')
		var starshipData = JSON.parse(initial)
		
    		
		//Row IDs needed for all the repeating rows in the sheet, use as neccessary per row
            var generateUUID = (function() {
                "use strict";
            
                var a = 0, b = [];
                return function() {
                    var c = (new Date()).getTime() + 0, d = c === a;
                    a = c;
                    for (var e = new Array(8), f = 7; 0 <= f; f--) {
                        e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
                        c = Math.floor(c / 64);
                    }
                    c = e.join("");
                    if (d) {
                        for (f = 11; 0 <= f && 63 === b[f]; f--) {
                            b[f] = 0;
                        }
                        b[f]++;
                    } else {
                        for (f = 0; 12 > f; f++) {
                            b[f] = Math.floor(64 * Math.random());
                        }
                    }
                    for (f = 0; 12 > f; f++){
                        c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
                    }
                    return c;
                };
            }()),
            
            generateRowID = function () {
                "use strict";
                return generateUUID().replace(/_/g, "Z");
            };		
		//End Row ID function
		
		//Proper Case if needed	
    		function toProperCase(s) {
                //split the string by space
    			let parts = s.split(" ");
    			let sb = [];
    				
    			for(i=0;i<parts.length;i++) {
    			    if (parts[i] != 'of') {           
                        sb.push(parts[i].substring(0,1).toUpperCase() + parts[i].substring(1).toLowerCase() + ' ');
    			    } else {
    			        sb.push(parts[i] + ' ');
    			    };
                };
    			return sb.join(' ').toString().trim();
    		};
		//End Proper Case function
		
		//Object creation function
		const createAttribute = (name, current) => {
		  if (current == undefined) {
			log(`Starship Import: no value found for ${name}, skipping create.`);
			return;
		  }
		  createObj('attribute', {
			  name : name,
			  current: current,
			  characterid: character.id
		  });
		};
		//End function
		
		
			
		//Begin Character Infomation
				//Import Tier
        	var shipTier = findObjs({type: 'attribute', characterid: character.id, name: 'ship_tier'})[0];
        	if (!shipTier) {
        		createAttribute("ship_tier", starshipData.tier);
        	};    	
              
                //Import Make and Model
        	var makeModel = findObjs({type: 'attribute', characterid: character.id, name: 'make_model'})[0];
			var make = starshipData.manufacturer
			var model = starshipData.model
        	if (!makeModel) {
				createAttribute("make_model", `${make} ${model}`);
        	};
			
				//Import Size
        	var shipSize = findObjs({type: 'attribute', characterid: character.id, name: 'size'})[0];
        	if (!shipSize) {
        		createAttribute("size", starshipData.baseFrame.size);
        	}; 
			
				//Import Frame
        	var shipFrame = findObjs({type: 'attribute', characterid: character.id, name: 'frame'})[0];
        	if (!shipFrame) {
        		createAttribute("frame", starshipData.baseFrame.name);
        	};
			
			    //Import Maneuverability
        	var maneuverability = findObjs({type: 'attribute', characterid: character.id, name: 'maneuverability'})[0];
        	if (!maneuverability) {
				createAttribute("maneuverability", starshipData.baseFrame.maneuverability.toLowerCase());
        	};
			
			    //Import Drift Rating
        	var driftRating = findObjs({type: 'attribute', characterid: character.id, name: 'drift_rating'})[0];
        	if (!driftRating) {
				createAttribute("drift_rating", starshipData.interstellarDrive.engineRating);
        	};
			
			    //Import Hull Points
        	var hullPoints = findObjs({type: 'attribute', characterid: character.id, name: 'hp'})[0];
        	if (!hullPoints) {
				createObj('attribute', {
				  name : "hp",
				  current: starshipData.baseFrame.hullPoints,
				  max: starshipData.baseFrame.hullPoints,
				  characterid: character.id
				});
        	};
			
			    //Import Thresholds
        	var critThreshold = findObjs({type: 'attribute', characterid: character.id, name: 'critical_threshold'})[0];
			var damageThreshold = findObjs({type: 'attribute', characterid: character.id, name: 'damage_threshold'})[0];
        	if (!critThreshold) {
				createAttribute("critical_threshold", starshipData.baseFrame.criticalThreshold);
        	};
			if (!damageThreshold) {
				createAttribute("damage_threshold", starshipData.baseFrame.damageThreshold);
        	};
        	
			    //Import Power Core
        	for (i=0; i<starshipData.powerCores.length; i++) {
            	var powerRowID = generateRowID();
    					//Name
    				createAttribute("repeating_system_" + powerRowID + "_name", starshipData.powerCores[i].name + " Power Core");
    					//Purpose
    				createAttribute("repeating_system_" + powerRowID + "_purpose",'power-core');
    					//PCU
    				createAttribute("repeating_system_" + powerRowID + "_pcu", starshipData.powerCores[i].pcu);
    					//Build Points
    				createAttribute("repeating_system_" + powerRowID + "_bp", starshipData.powerCores[i].cost);
					    //Speed
			    	createAttribute("speed", starshipData.thruster.speed);
        	};
        	
			//Import Thrusters
        	var thrusterRowID = generateRowID();
					//Name
				createAttribute("repeating_system_" + thrusterRowID + "_name", starshipData.thruster.name);
					//Purpose
				createAttribute("repeating_system_" + thrusterRowID + "_purpose","thrusters");
					//PCU
				createAttribute("repeating_system_" + thrusterRowID + "_pcu", starshipData.thruster.pcu);
					//Build Points
				createAttribute("repeating_system_" + thrusterRowID + "_bp", starshipData.thruster.cost);
				
			    //Import Armor
        	var armorRowID = generateRowID();
					//Name
				createAttribute("repeating_system_" + armorRowID + "_name", starshipData.armor.name);
					//Purpose
				createAttribute("repeating_system_" + armorRowID + "_purpose",'armor');
					//Build Points
				createAttribute("repeating_system_" + armorRowID + "_bp", starshipData.armor.cost);
					//AC
				createAttribute("repeating_system_" + armorRowID + "_armor", starshipData.armor.acBonus);
					//TL
				createAttribute("repeating_system_" + armorRowID + "_countermeasure", starshipData.armor.tlPenalty);
        	
				//Import Shields
        	var shieldsRowID = generateRowID();
					//Name
				createAttribute("repeating_system_" + shieldsRowID + "_name", starshipData.shield.name);
					//Purpose
				createAttribute("repeating_system_" + shieldsRowID + "_purpose",'shields');
					//Build Points
				createAttribute("repeating_system_" + shieldsRowID + "_bp", starshipData.shield.cost);
					//PCU
				createAttribute("repeating_system_" + shieldsRowID + "_pcu", starshipData.shield.pcu);
					//Shield Points
				createAttribute("repeating_system_" + shieldsRowID + "_shields", starshipData.shield.totalSp);
				
				//Import Computer
        	var computerRowID = generateRowID();
					//Name
				createAttribute("repeating_system_" + computerRowID + "_name", starshipData.computer.name);
					//Purpose
				createAttribute("repeating_system_" + computerRowID + "_purpose",'computer');
					//Build Points
				createAttribute("repeating_system_" + computerRowID + "_bp", starshipData.computer.cost);
					//PCU
				createAttribute("repeating_system_" + computerRowID + "_pcu", starshipData.computer.pcu);
					//Bonus
				createAttribute("repeating_system_" + computerRowID + "_comp_bonus", "+" + starshipData.computer.bonus.toString());
			
				//Import Countermeasures
        	var counterRowID = generateRowID();
					//Name
				createAttribute("repeating_system_" + counterRowID + "_name", starshipData.defensiveCountermeasure.name);
					//Purpose
				createAttribute("repeating_system_" + counterRowID + "_purpose",'countermeasures');
					//Build Points
				createAttribute("repeating_system_" + counterRowID + "_bp", starshipData.defensiveCountermeasure.cost);
					//PCU
				createAttribute("repeating_system_" + counterRowID + "_pcu", starshipData.defensiveCountermeasure.pcu);
					//Bonus
				createAttribute("repeating_system_" + counterRowID + "_countermeasure", starshipData.defensiveCountermeasure.tlBonus);
				
				//Import Drift Engine
        	var driftRowID = generateRowID();
					//Name
				createAttribute("repeating_system_" + driftRowID + "_name", starshipData.interstellarDrive.name);
					//Purpose
				createAttribute("repeating_system_" + driftRowID + "_purpose",'drift-engines');
					//Build Points
				createAttribute("repeating_system_" + driftRowID + "_bp", starshipData.interstellarDrive.cost);
				
				//Import Sensors
        	var sensorsRowID = generateRowID();
					//Name
				createAttribute("repeating_system_" + sensorsRowID + "_name", starshipData.sensor.name + " Sensors");
					//Purpose
				createAttribute("repeating_system_" + sensorsRowID + "_purpose",'sensors');
					//Build Points
				createAttribute("repeating_system_" + sensorsRowID + "_bp", starshipData.sensor.cost);
					//Bonus
				createAttribute("repeating_system_" + sensorsRowID + "_sensor_bonus", "+" + starshipData.sensor.modifier);	
					//Range
				createAttribute("repeating_system_" + sensorsRowID + "_description", starshipData.sensor.range);

				//Import Weapons
			for (i=0; i<starshipData.weapons.length; i++) {
            	var weaponRowID = generateRowID();
				let range = starshipData.weapons[i].range.split(" ")
				switch (range[0]) {
					case "Short": rangeNumber = 5;
											break;
					case "Medium": rangeNumber = 10;
											break;
					default: rangeNumber = 20;
											break;											
				};
    					//Name
    				createAttribute("repeating_attack_" + weaponRowID + "_name", starshipData.weapons[i].name);
						//Type
    				createAttribute("repeating_attack_" + weaponRowID + "_type", starshipData.weapons[i].type.replace(" ","-").toLowerCase());
    					//Class
    				createAttribute("repeating_attack_" + weaponRowID + "_class",starshipData.weapons[i].class);
						//Range
    				createAttribute("repeating_attack_" + weaponRowID + "_range", rangeNumber);
						//DamageRoll
					createAttribute("repeating_attack_" + weaponRowID + "_damage_dice",starshipData.weapons[i].damage.dice.count + "d" + starshipData.weapons[i].damage.dice.sides);
						//Arc
					createAttribute("repeating_attack_" + weaponRowID + "_arc",starshipData.weapons[i].installedArc.toLowerCase());
						//PCU
    				createAttribute("repeating_attack_" + weaponRowID + "_pcu", starshipData.weapons[i].pcu);
    					//Build Points
    				createAttribute("repeating_attack_" + weaponRowID + "_bp", starshipData.weapons[i].cost);
						//speed
    				createAttribute("repeating_attack_" + weaponRowID + "_description", starshipData.weapons[i].speed);
						//Special
					var specialAbil = ""
					if (starshipData.weapons[i].special !== null) {
						for (j=0; j<starshipData.weapons[i].special.length; j++) {
							specialAbil = specialAbil + starshipData.weapons[i].special[j].name + " " + starshipData.weapons[i].special[j].additionalInfo + ", "
						}
					createAttribute("repeating_attack_" + weaponRowID + "_special", specialAbil);	
					};
				};	
				//Import Expansion Bays
			if (starshipData.expansionBays !== null) {
				for (i=0; i<starshipData.expansionBays.length;i++){
					var bayRowID = generateRowID();
							//Name
						createAttribute("repeating_system_" + bayRowID + "_name", starshipData.expansionBays[i].name);
							//Purpose
						createAttribute("repeating_system_" + bayRowID + "_purpose","expansion-bay");
							//PCU
						createAttribute("repeating_system_" + bayRowID + "_pcu", starshipData.expansionBays[i].pcu);
							//Build Points
						createAttribute("repeating_system_" + bayRowID + "_bp", starshipData.expansionBays[i].cost);
							//description
						createAttribute("repeating_system_" + bayRowID + "_description", starshipData.expansionBays[i].description);
				};
			};
			
				//Import Security
			if (starshipData.security !== null) {
				for (i=0; i<starshipData.security.length;i++){
					var bayRowID = generateRowID();
							//Name
						createAttribute("repeating_system_" + bayRowID + "_name", starshipData.security[i].name);
							//Purpose
						createAttribute("repeating_system_" + bayRowID + "_purpose","security");
							//PCU
						createAttribute("repeating_system_" + bayRowID + "_pcu", starshipData.security[i].pcu);
							//Build Points
						createAttribute("repeating_system_" + bayRowID + "_bp", starshipData.security[i].cost);
							//description
						createAttribute("repeating_system_" + bayRowID + "_description", starshipData.security[i].description);
				};
			};
		
            sendChat("Starship Import", `Script Complete, check for import errors.`);

	};
});