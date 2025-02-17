// Controller level for calling API endpoints in LAMP API


// User attributes
let ID = 0;
let fullName = "";
let email = "";
let UserID = 1; // The ID of the account that is creating the contact

// DOM element initialization
const contactList = document.getElementById("contactList");
const contactDetails = document.getElementById("contactDetails");
let selectedContact = null; // Track selected contact index

// Function for fetching the contacts 
let contactArray = [];



function fetchContacts() {

    // Define a user id -> Should not be hard coded -> need a getCookie() function
    let userId = 1;

    // Checks to see if the user id is not equal to null -> if it is, we prompt the user to the login page
    if (!userId) {
        alert("No user logged in. Please log in first.");
        window.location.href = "index.html";
        return;
    }

    // Creating a json object to be sent to our Read API endpoint
    let jsonPayload = JSON.stringify({ UserId: userId });

    // POST request to our db
    fetch("http://localhost/LAMPAPI/CoreFunctionsAPI/ReadContact.php", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonPayload
    })
        // Handling the data we get sent back
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error fetching contacts: " + data.error);
            } else {
                contactArray = data.results;
                displayContacts(contactArray); // Display contacts from API call
            }
        })
        .catch(error => {
            console.error("Error fetching contacts:", error);
        });
}




// Function for displaying contacts from API request
function displayContacts(contactArrayResponse) {
    // Check if input is an array
    if (!Array.isArray(contactArrayResponse)) {
        console.error("displayContacts error: contactArray is not an array", contactArray);
        return;
    }

    // Clear existing contacts
    contactList.innerHTML = "";

    // Display contacts
    contactArrayResponse.forEach((contact, index) => {
        const div = document.createElement("div");
        div.classList.add("contact-item");
        div.textContent = contact.name || "No Name";
        div.onclick = () => displayContactDetails(contact, index);
        contactList.appendChild(div);
    });

    console.log("Displayed contacts:", contactArray);
}

// Function for displaying details about a contact within a window
function displayContactDetails(contact, index) {
    selectedContact = index;
    contactDetails.innerHTML = `
        <div class="action-buttons">
            <button onclick="editContact()">✏️ Edit</button>
            <button onclick="removeContact()">🗑️ Delete</button>
        </div>
        <h2>${contact.name}</h2>
        <p><span class="icon">📧</span> ${contact.email}</p>
        <p><span class="icon">📞</span> ${contact.phone}</p>`;
}


// Handling crud operations

// Old implementation -> contact creation
function createContactProxy()
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



// Function for contact Creation
function createContact()
{
    // We prompt the user to create a new contact and enter relevant information about a contact
    const fullName = prompt("Enter contact name:");
    const email = prompt("Enter contact email:");
    const phone = prompt("Enter contact phone:");

    // Checking to see ifn any of the values or null, if they are -> we can alert the user that all fields need to be present
    if (fullName && email && phone)
    {

        // After we grab the data -> Persist it to the database
        let userId = 1; // -> NEEDS to not be hardcoded (use getCookie() function)

        // Creating JSON object of data we retrieved
        let jsonPayload = JSON.stringify({fullName: fullName, email: email, phone: phone, userId: userId});

        // Initialize POST request
        fetch("http://localhost/LAMPAPI/CoreFunctionsAPI/CreateContact.php", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonPayload
        })
        // Handling the data we get sent back
    .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error creating contacts: " + data.error);
            } else {
                alert("Contact with contact id: " + data.contactid + " has been created successfully");
                fetchContacts();
            }
        })
        .catch(error => {
            console.error("Error creating contacts:", error);
        });
        }

}

// Function for updating a contact
function updateContact() 
{
    if (selectedContact !== null) 
    {
        const newEmail = prompt("Enter new email:", contacts[selectedContact].email);
        const newPhone = prompt("Enter new phone:", contacts[selectedContact].phone);
        if (newEmail && newPhone) 
        {
            contacts[selectedContact].email = newEmail;
            contacts[selectedContact].phone = newPhone;
            displayContactDetails(contacts[selectedContact], selectedContact);
        }
    } 
    else 
    {
        alert("Please select a contact first!");
    }
}

// Function for deleting a contact
function deleteContact() 
{
    if (selectedContact !== null) 
    {
        const confirmDelete = confirm(`Are you sure you want to delete ${contacts[selectedContact].name}?`);
        if (confirmDelete)
        {
            contacts.splice(selectedContact, 1); // Remove from array
            selectedContact = null; // Clear selection
            displayContacts();
            // Clear contact details
            contactDetails.innerHTML = `<h2>Select a Contact</h2>
                <p><span class="icon">📧</span> Email</p>
                <p><span class="icon">📞</span> Phone</p>`;
        }
    } 
    else 
    {
        alert("No contact selected.");
    }
}


// Initial rendering
fetchContacts();