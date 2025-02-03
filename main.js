/*
    * @Author: Lukas Kroczek
    * @Date: 2025-02-03
    * @Description: Learning Platform
    * @Version: 1.0
    * @LastUpdate: 2025-02-03
*/

import promtSync from 'prompt-sync';
const Prompt = promtSync()

function prompt(output){
    let input = Prompt(output);
    if(input == "EXIT"){
        console.log("Goodbye");
        process.exit();
    }
    return input
}

function getMode(data) {
    console.clear();
    console.log("Welcome to the Learning Platform!");
    console.log("Please select a mode:");

    for (let i = 0; i < data.length; i++) {
        console.log(` ${i + 1}. ${data[i].name}`);
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

    for (let i = 0; i < data.length; i++) {
        console.log(` ${i + 1}. ${data[i].name}`);
    }

    return parseInt(prompt(" > ")) - 1;
}

/*
 * TODO: Read Mode-Data to list
**/

let modeData = [
    { name:"edit Category" }];
let topicData = [];
let topicIdx = -1;

while (topicIdx === -1) {
    let modeIdx = getMode(modeData);
    topicData = getAvailableTopics(modeData[modeIdx]);
    topicIdx = getTopic(topicData);
}
