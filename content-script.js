//// content-script.js ////
let OptionsElement;
var OptionsElementOpen = false;
var elementChangeCount = 0;

function GetOptionsElement() {
    var element = document.getElementsByClassName("app-view-tools")[0].children[2];
    return element;
}

function SetOptionsEventOpenToCurrentState() {
    var count = document.getElementsByClassName("app-layout-table-options").length;
    var optionsListElement = document.getElementsByClassName("app-layout-table-options")[count-1];
    if (optionsListElement != undefined) {
        if (optionsListElement.style.display == "block") {
            OptionsElementOpen = true;
        }
    
        if (optionsListElement.style.display == "none") {
            OptionsElementOpen = false;
        }
    } else {
        OptionsElementOpen = false;
    }
    // console.log(OptionsElementOpen);
}

function click(element) {
    element.click();
}

function parseFields(fields) {
    var parsedFields = fields.split('\n');
    return parsedFields;
}

function parseNames(element) {
    var elementName;
    var elementNameCache = element.children[0].children[1].innerText;
    elementName = elementNameCache;

    return elementName;
}

function mainLoopAdd(rawFields) {
    var allFieldsCount = document.getElementsByClassName("app-settings-dropdown-list").length;
    var allFields = document.getElementsByClassName("app-settings-dropdown-list")[allFieldsCount-1].children;
    var loopLength = allFields.length;

    for (let i = 0; i < loopLength; i++) {
        allFields = document.getElementsByClassName("app-settings-dropdown-list")[allFieldsCount-1].children;
        var element = allFields[i];
        var elementName = parseNames(element);
        if (rawFields.includes(elementName))
        {
            if (!element.classList.contains("current")) {
                // console.log(elementName);
                elementChangeCount++;
                click(element);      
            }
        }
    }

    if (elementChangeCount == 0) {
        return false;
    }

    return true;
}

function mainLoopRemove(rawFields) {
    var allFieldsCount = document.getElementsByClassName("app-settings-dropdown-list").length;
    var allFields = document.getElementsByClassName("app-settings-dropdown-list")[allFieldsCount-1].children;
    var loopLength = allFields.length;

    for (let i = 0; i < loopLength; i++) {
        allFields = document.getElementsByClassName("app-settings-dropdown-list")[allFieldsCount-1].children;
        var element = allFields[i];
        var elementName = parseNames(element);
        if (rawFields.includes(elementName))
        {
            if (element.classList.contains("current")) {
                // console.log(elementName);
                elementChangeCount++;
                click(element);            
            }
        }
    }

    if (elementChangeCount == 0) {
        return false;
    }

    return true;
}

function mainLoopToggle(rawFields) {
    var allFieldsCount = document.getElementsByClassName("app-settings-dropdown-list").length;
    var allFields = document.getElementsByClassName("app-settings-dropdown-list")[allFieldsCount-1].children;
    var loopLength = allFields.length;

    for (let i = 0; i < loopLength; i++) {
        allFields = document.getElementsByClassName("app-settings-dropdown-list")[allFieldsCount-1].children;
        var element = allFields[i];
        var elementName = parseNames(element);
        if (rawFields.includes(elementName))
        {
            // console.log(elementName);
            elementChangeCount++;
            click(element);            
        }
    }

    if (elementChangeCount == 0) {
        return false;
    }

    return true;
}


// document.body.style.backgroundColor = 'grey';
console.log("Content Script Alive!");

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log("Message Recieved: " + message.action);
        // console.log(sender.tab);
        elementChangeCount = 0;

        const fieldsDataArray = parseFields(message.data);

        OptionsElement = GetOptionsElement();
        SetOptionsEventOpenToCurrentState();
        if (!OptionsElementOpen)
            click(OptionsElement);

        // figure out way to send a working message to popup.js as thats the only script that can modify the popup html
        // either find out how to send multiple callbacks per message or send a new message back to the popup
        // sendResponse({working: true});
        switch (message.action) {
            case "add":
                var result = mainLoopAdd(fieldsDataArray);
                sendResponse({response: [result, elementChangeCount]});
                break;

            case "toggle":
                var result = mainLoopToggle(fieldsDataArray);
                sendResponse({response: [result, elementChangeCount]});
                break;
        
            case "remove":
                var result = mainLoopRemove(fieldsDataArray);
                sendResponse({response: [result, elementChangeCount]});
                break;

            default:
                console.log('error in message action check!');
                sendResponse({response: [false, 9999999]});
                break;
        }

        return true;
    }
);