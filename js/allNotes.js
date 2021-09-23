const deleteMsg = document.getElementById('delete-msg');

/*getting the data from chrome local storage and sending the result to loadNotes function to display it on screen */
function getNotes() {
    chrome.storage.local.get(['notes-keeper'], function(result) {
        loadNotes(result); //calling loadNotes(result) to display the data on screen
    });
}

const tableBody = document.getElementById('notes-list');

/*function to display the data on screen */
function loadNotes(result) {
    let notesArr = JSON.parse(result['notes-keeper']); //parsing the JSON string
    let str = '';

    /*for each element in the notes we are creating a string of HTML to render on screen */
    notesArr.forEach((element, index) => {
        str += `
            <tr class="note-row">
                <th class="note-title" scope="row">${element[0]}</th>
                <td class="note-desc">${element[1].slice(0, 20) + "..."}<button class="expand-btn" id="expand-${index}">read</button></td>
                <td class="note-act"><button class="delete" id="delete-${index}">Delete</button></td>
            </tr>
            <tr class="hidden-note" id="note-${index}">
                <td colspan="3" class="full-width">
                    <h6 class="full-note-title">${element[0]}</h6>
                    <div class="full-note">
                        ${element[1]}
                    </div>
                </td>
            </tr>`;
    });

    /*setting innerHTML of tableBody to the HTML string which we created earlier  */
    tableBody.innerHTML = str;
    setEventListenerOnDelete(); //to add event listener on all the delete buttons
    setEventListenerOnRead(); //to add event listener on all the read buttons
}

getNotes(); //calling the getNotes() function to render the data on screen as soon as the page loads

/*setting evenet listener on all the delete buttons */
function setEventListenerOnDelete() {
    let elements = document.getElementsByClassName('delete'); //grabbing all the delete buttons
    let eleArr = Array.prototype.slice.call(elements); //converting all delete buttons to an array

    /*for each delete button, adding the event listener */
    eleArr.forEach((button, index) => {
        button.addEventListener('click', () =>{
            if(confirm("Do you really want to delete?")) { //confirming from user to delete
                deleteNote(index);
            }
            else {
                return;
            }
        });
    });
}

/*deleting the element on given index */
function deleteNote(index) {

    /*getting data from chrome.storage */
    chrome.storage.local.get(['notes-keeper'], function(result) {
        let notesArr = [];

        if(Object.entries(result).length == 0) {
            notesArr = [];
        }
        else {
            notesArr = JSON.parse(result['notes-keeper']);
        }

        notesArr.splice(index, 1); //deleting the element at the given index
        let jstr = JSON.stringify(notesArr); //converting the data into JSON string

        /*putting back the data on chrome.storage */
        chrome.storage.local.set({"notes-keeper": jstr}, function() {
            deleteMsg.style.display = 'block';
            setTimeout(() => {deleteMsg.style.display = "none"}, 2000);
        });

        /*calling getNotes() function to render the data after deletion */
        getNotes();
    });
}

/*setting the event listener on all the read buttons */
function setEventListenerOnRead() {
    let elements = document.getElementsByClassName('hidden-note');
    let eleArr = Array.prototype.slice.call(elements);

    /*for each read button, adding event listener and calling toggleDisplayNote(index) to toggle hide/unhide */
    eleArr.forEach((row, index) => {
        document.getElementById(`expand-${index}`).addEventListener('click', () => {
            toggleDisplayNote(index);
        });
    });
    
}

/*function to toggle the display of notes (hide/unhide) */
function toggleDisplayNote(index) {
    let noteEx = document.getElementById(`note-${index}`);
    if(noteEx.style.display == "table-row") {
        noteEx.style.display = "none";
    }
    else {
        noteEx.style.display = "table-row";
    }
}