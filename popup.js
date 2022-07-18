//// popup.js ////
// states are on | toggle | off
var state = "toggle";

document.getElementById('submitButton').addEventListener('click', (e) => {
    submit();
})

document.getElementById('add').addEventListener('click', (e) => {
    state = "add";
})

document.getElementById('toggle').addEventListener('click', (e) => {
    state = "toggle";
})

document.getElementById('remove').addEventListener('click', (e) => {
    state = "remove";
})

function submit() {
    var Data = $('#Data').val();
    console.log(Data);

    if (Data != "")
    {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            switch (state) {
                case "add":
                    sendMessage( tabs[0].id, { action: "add", data: Data }, function(response) { Callback(response) });

                    break;

                case "toggle":
                    // sendMessage( null, { action: "toggle", data: Data }, function(response) { Callback(response) });
                    sendMessage( tabs[0].id, { action: "toggle", data: Data }, function(response) { Callback(response) });

                    break;

                case "remove":
                    sendMessage( tabs[0].id, { action: "remove", data: Data }, function(response) { Callback(response) });

                    break;
            }
        });
    }
}

function sendMessage(tabID, message, callback = null) {
    chrome.tabs.sendMessage(
      tabID,
      message,
      callback
    );
  };

function Callback(result) {
    if (result.response != undefined) {
        if (result.response[0] == true) {
            // true
            $('#result')[0].innerText = "Operation: successful.\n Changed: " + result.response[1];
            
        } else {
            // false
            $('#result')[0].innerText = "Operation: failure";
            // alert("Operation: failure");        
        }
    } else {
        if (result.working)
            $('#result')[0].innerText = "Working!";        
    }
}