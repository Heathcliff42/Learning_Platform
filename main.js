import promtSync from 'prompt-sync';
const prompt = promtSync();

function getMode(data) {
    console.clear();
    console.log("Welcome to the Learning Platform!");
    console.log("Please select a mode:");

    if (data.length < 10) {
        for (let i = 0; i < data.length; i++) {
            console.log(` ${i + 1}. ${data[i].name}`);
        }
    } else {
        for (let i = 0; i < 9; i++) {
            console.log(` ${i + 1}. ${data[i].name}`);
        }
        for (let i = 9; i < data.length; i++) {
            console.log(`${i + 1}. ${data[i].name}`);
        }
    }
    return parseInt(prompt(" > ")) - 1;
}

function getAvailableTopics(mode){
    /*
     * TODO: Read available Topics to list
    **/
}

function getTopic(data) {
    console.log("Please select a topic:");
    console.log(" 0. Go back");

    if (data.length < 10) {
        for (let i = 0; i < data.length; i++) {
            console.log(` ${i + 1}. ${data[i].name}`);
        }
    } else {
        for (let i = 0; i < 9; i++) {
            console.log(` ${i + 1}. ${data[i].name}`);
        }
        for (let i = 9; i < data.length; i++) {
            console.log(`${i + 1}. ${data[i].name}`);
        }
    }
    return parseInt(prompt(" > ")) - 1;
}

/*
 * TODO: Read Mode-Data to list
**/

let modeData = [];
let topicData = [];
let topicIdx = -1;

while (topicIdx === -1) {
    modeIdx = getMode(modeData);
    topicData = getAvailableTopics(modeData[modeIdx]);
    topicIdx = getTopic(topicData);
}
