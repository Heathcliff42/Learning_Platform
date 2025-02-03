/*
    * @Author: Lukas Kroczek
    * @Date: 2025-02-03
    * @Description: Learning Platform
    * @Version: 1.0.0
    * @LastUpdate: 2025-02-03
*/

import promtSync from 'prompt-sync';
const PROMPT = promtSync()

function prompt(output){
    let input = PROMPT(output);
    if(input === "EXIT"){
        console.log("Goodbye");
        process.exit();
    }
    return input
}

function getMode(data) {
    console.clear();
    console.log("Welcome to the Learning Platform!");
    console.log("Please select a mode:");

    if (data.length < 9) {
        for (let i = 0; i < data.length; i++) {
            console.log(` ${i + 1}. ${data[i]}`);
        }
    } else {
        for (let i = 0; i < 9; i++) {
            console.log(` ${i + 1}. ${data[i]}`);
        }
        for (let i = 9; i < data.length; i++) {
            console.log(`${i + 1}. ${data[i]}`);
        }
    }
    
    return parseInt(prompt(" > ")) - 1;
}

function getAvailableTopics(mode){
    /*
     * TODO: Read available topics from database to list
     * (join tables to get topics for the selected mode)
     * input: mode
     * return: topicData
    **/
}

function getTopic(data) {
    console.log("Please select a topic:");
    console.log(" 0. Choose another mode");

    if (data.length < 9) {
        for (let i = 0; i < data.length; i++) {
            console.log(` ${i + 1}. ${data[i]}`);
        }
    } else {
        for (let i = 0; i < 9; i++) {
            console.log(` ${i + 1}. ${data[i]}`);
        }
        for (let i = 9; i < data.length; i++) {
            console.log(`${i + 1}. ${data[i]}`);
        }
    }

    return parseInt(prompt(" > ")) - 1;
}

/*
 * TODO: Read mode-data from database to list
 * return: modeData
**/

let modeData = [];
let topicData = [];
let topicIdx = -1;

while (topicIdx === -1) {
    let modeIdx = getMode(modeData);
    topicData = getAvailableTopics(modeData[modeIdx]);
    topicIdx = getTopic(topicData);
}
