// Controller level for calling API endpoints in LAMP API

// Url for database
const url = "http://contact.afari.online/LAMPAPI";
const extension = "";

// User attributes
let userId = 0;
let fullName = "";

let email = "";


// Handling crud operations

// Contact Creation
function createContact()
{
    // When we test it, these values needs to be hard coded
    let newContactName = document.getElementById("full-name").value;
    let newEmailName = document.getElementById("email").value;

    // Creating json Payload to be sent to our PHP defined api endpoint
    let tmpPayload = {FullName:newContactnAME,userId,userId};
    let jsonPayload = JSON.stringify( tmp );

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
                alert("Contact submitted successfully")
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("colorAddResult").innerHTML = err.message;
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