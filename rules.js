// by Christian Sigua

let keyCollected = false;
let food = "";

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData["Title"]); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData["InitialLocation"]); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData["Locations"][key];
        let itemData = this.engine.storyData["Items"];
        // console.log(locationData);
        this.engine.show(locationData["Body"]);

        if (locationData["Choices"]) {
            for(let choice of locationData["Choices"]) {
                this.engine.addChoice(choice["Text"], choice);
            }
        }
        // else if (this.engine.storyData["Mechanism"]["Name"][key]["Choices"]) {
        //     locationData = this.engine.storyData["Mechanism"]["Name"][key];
        //     for(let choice of locationData["Choices"]) {
        //         this.engine.addChoice(choice["Text"], choice);
        //     }
        // }
        else {
            this.engine.addChoice("The end.");
        }
        if (itemData["Locations"][key]) {
            for(let choice of itemData["Locations"][key]["Choices"]) {
                this.engine.addChoice(choice["Text"], choice);
            }
        }
        if (locationData["Key Choice"] && keyCollected === true) { // lock and key mechanism
            this.engine.addChoice(locationData["Key Choice"]["Text"], locationData["Key Choice"]);
        }
    }

    handleChoice(choice) {
        let mechData = this.engine.storyData["Mechanism"]
        let mechLocation = mechData["Location"]; // should be "TV"
        let mechName = mechData["Name"]; // should be "TV set"
        let mechPath = this.engine.storyData["Locations"][mechLocation][mechName]

        let itemLocations = this.engine.storyData["Items"]["Locations"];

        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            if (choice.Target === this.engine.storyData["Key"]["Location"]) {
                keyCollected = true;
            }
            if (mechLocation === choice.Target || mechPath[choice.Target]) {
                this.engine.gotoScene(Television, choice.Target);
            }
            // if (itemLocations[choice.Target]) {
            //     this.engine.gotoScene(GameWorldItem, choice.Target);
            // }
            else {
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class Television extends Location { // interactive mechanism class (the TV)
    create(key) {
        let mechData = this.engine.storyData["Mechanism"]
        let mechLocation = mechData["Location"]; // should be "TV"
        let mechName = mechData["Name"]; // should be "TV set"
        let mechInit = mechData["InitialState"]; // should be "TV off"
        let mechPath = this.engine.storyData["Locations"][mechLocation][mechName]
        let locationName = key;

        if (locationName === mechLocation) {
            this.engine.show(mechPath[mechInit]["Body"]);
            for(let choice of mechPath[mechInit]["Choices"]) {
                this.engine.addChoice(choice["Text"], choice);
            }
        }
        else if (mechPath[locationName]) {
            this.engine.show(mechPath[locationName]["Body"]);

            for(let choice of mechPath[locationName]["Choices"]) {
                this.engine.addChoice(choice["Text"], choice);
            }
        }
        else {
            this.engine.gotoScene(End);
        }
    }
}

class GameWorldItem extends Location {
    create(key) {
        let itemData = this.engine.storyData["Items"];
        let itemLocations = itemData["Locations"];
        let locationName = key;

        if (itemLocations[locationName]) {
            food = key;
            this.gotoScene(itemLocations);
        };
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
