const saveBtn = document.getElementById('save-btn');
const successMsg = document.getElementById("success-msg");

/*Add the event listener to handle the click on "Save" and "Show All Notes" buttons */
saveBtn.addEventListener('click', saveNote);
document.getElementById('show-btn').addEventListener('click', saveNote);

/*Declaring the title and text as empty strings before taking the data from user */
let title = "";
let text = "";

/*function to save the input data to chrome storage using chrome.storage API */
function saveNote() {
  title = document.getElementById('note-title').value; //grabbing the value of title input by user
  text = document.getElementById('note-text').value;  //grabbing the value of textarea input by user

  /*checking whether the user actually entered entered the value of not */
  if(title == "" && text == "") {
    return;
  }

  /*calling the chrome.storage API to check whether there is any previous data or not */
  chrome.storage.local.get(['notes-keeper'], function(result) {
    let noteArr = [];

    if(Object.entries(result).length == 0) { //checking whether there is any previous data or not
      noteArr = [];
    }
    else {
      noteArr = JSON.parse(result['notes-keeper']);
    }

    noteArr.push([title, text]);
    let jstr = JSON.stringify(noteArr); //creating JSON string to put the data to chrome storage

    /*setting the data to chrome local storage as JSON string */
    chrome.storage.local.set({"notes-keeper": jstr}, function() {
      console.log('writing value to storage');
    });

    /*displaying the success message */
    successMsg.style.display = "block";
    setTimeout(() => {successMsg.style.display = "none";}, 2000);

    /*clearing data from input area and textarea */
    document.getElementById('note-title').value = "";
    document.getElementById('note-text').value = "";
  });
}