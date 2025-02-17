// Controller level for calling API endpoints in LAMP API

// Url for endpoints
const urlBase = "http://contact.afari.online/LAMPAPI";
const extension = "";

// User attributes

let ID = 0;
let fullName = "";
let email = "";
let UserID = 1; // The ID of the account that is creating the contact

// TODO -> Remove this as we have an actual database
const contacts = [
    { name: "Group26", email: "group26@ucf.edu", phone: "123-456-7890" },
    { name: "Gabriel", email: "gabriel@ucf.edu", phone: "987-654-3210" },
    { name: "COP4331", email: "COP4331@ucf.edu", phone: "111-111-1111" }
];

// DOM element initialization
const contactList = document.getElementById("contactList");
const contactDetails = document.getElementById("contactDetails");
let selectedContact = null; // Track selected contact index

// Function for displaying contacts
function displayContacts() {
    contactList.innerHTML = ""; // Clear existing list
    contacts.forEach((contact, index) => {
        const div = document.createElement("div");
        div.classList.add("contact-item");
        div.textContent = contact.name;
        div.onclick = () => displayContactDetails(contact, index);
        contactList.appendChild(div);
    });
}

// Funxtion for displaying details about a contact within a window
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
    const name = prompt("Enter contact name:");
    const email = prompt("Enter contact email:");
    const phone = prompt("Enter contact phone:");
    if (name && email && phone) 
    {
        contacts.push({ name, email, phone });
        displayContacts();
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
displayContacts();