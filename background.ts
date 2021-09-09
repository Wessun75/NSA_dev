//Use to tell to get chrome if it 
/// <reference types="chrome"/>
import ImageCropper from "./components/ImageCropper";
import {DataMessage} from "./models/DataMessage";
import {Selection} from "./models/Selection";
import API from "./components/api";

console.log("Run tests")
export * from "./tests/check-result"

console.log("Init TZone")

//Default config
let options: {
    preview: boolean,
    retrivePolice: boolean,
    retriveFormat: boolean,
    translate: string | null
} = {
    preview: false,
    retrivePolice: false,
    retriveFormat: false,
    translate: null
}

//Load config
const savedConf = localStorage.getItem("options")
if (savedConf) options = JSON.parse(savedConf);

//Listen command keys
chrome.commands.onCommand.addListener(async (command: string) => {
    //Get active tab
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        //TODO Verify if it's possible to have multiple active tabs
        let tab = tabs[0];
        if (tab && tab.id) {
            if (command == "take-screenshot") {
                //Tell the page script ta make a screenshot
                chrome.tabs.sendMessage(tab.id, {msg: "screenshot-selection", tabId: tab.id});
            } else if (command == "screenshot-selection-with-options") {
                //TODO
                console.log("take screenshot with options")

            }
        } else {
            throw Error("Can't find active tab !")
        }
    })
});

//Responce of selection call
chrome.runtime.onMessage.addListener((msg: DataMessage<Selection | NotificationOptions>, sender, response) => {
    //if it's the result of a selection then
    if (msg.msg == "screenshot-selection-result") {

        //make a screenshoot
        chrome.tabs.captureVisibleTab({format: "png"}, async (responce) => {
            //Crop the image according to the selection
            const croppedImageData = await ImageCropper.cropImage(responce, msg.data as Selection);
            if (croppedImageData) {
                console.log(croppedImageData)
                //TODO api url and stuff with result
                const apiResult = await API.getTextFromImage(croppedImageData);
            }

        });

    }
    if (msg.msg === 'notification') {
        chrome.notifications.create('', msg.data as NotificationOptions);
        response(true)
    }
})

