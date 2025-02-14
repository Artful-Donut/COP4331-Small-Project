// Controller level for calling API endpoints in LAMP API

// Url for endpoints
const urlBase = "http://contact.afari.online/LAMPAPI";
const extension = "";

// User attributes

let ID = 0;
let fullName = "";
let email = "";
let UserID = 1; // The ID of the account that is creating the contact


// Handling crud operations

// Contact Creation
function createContact()
{
    // When we test it, these values needs to be hard coded
    let newContactName = "Lebron James";
    let newEmailName = "LeGloriousKing@gmail.com";

    // Creating json Payload to be sent to our PHP defined api endpoint
    let tmpPayload = {fullName: newContactName, userId: UserId, email: email};
    let jsonPayload = JSON.stringify( tmpPayload );

    // Url where our endpoint is defined
    let url = urlBase + '/CreateContact.' + extension;


    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let response = JSON.parse(this.responseText)
                alert("Contact submitted successfully with ID: " + response.contactId)
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        alert("Error: " + err.message)
    }
}

function readContact()
{
    

}


function updateContact()
{

}

function deleteContact()
{

}