// Controller level for calling API endpoints in LAMP API


// User attributes
// let ID = 0;
// let fullName = "";
// let email = "";
// let UserID = 1; // The ID of the account that is creating the contact

// DOM element initialization
const contactList = document.getElementById("contactList");
const contactDetails = document.getElementById("contactDetails");
let selectedContact = null; // Track selected contact index

// Function for fetching the contacts 
let contactArray = [];

function fetchContacts() {

    // Define a user id -> Should not be hard coded -> need a getCookie() function
    let userId = getCookie('accountID');

    // Checks to see if the user id is not equal to null -> if it is, we prompt the user to the login page
    if (!userId) {
        alert("No user logged in. Please log in first.");
        window.location.href = "index.html";
        return;
    }

    // Creating a json object to be sent to our Read API endpoint
    let jsonPayload = JSON.stringify({ ID: userId });
    console.log(jsonPayload);

    // POST request to our db
    fetch("http://contact.afari.online/contactManagerFolder/LAMPAPI/CoreFunctionsAPI/ReadContact.php", {
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
        div.textContent = contact.FirstName || "No Name";
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
            <button onclick="updateContact()">✏️ Edit</button>
            <button onclick="deleteContact()">🗑️ Delete</button>
        </div>
        <h2>${contact.FirstName}</h2>
        <p><span class="icon">📧</span> ${contact.email}</p>
        <p><span class="icon">📞</span> ${contact.phone}</p>`;
}

// Show the "Add Contact" form in the right panel
function showAddContactForm() {
    document.getElementById("addContactForm").style.display = "block";
    document.getElementById("emptyState").style.display = "none";
    document.getElementById("contactInfo").style.display = "none";
}

// Hide the form and return to the default state
function cancelAddContact() {
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("emptyState").style.display = "block";
}


// Handling crud operations


// Function for contact Creation
function createContact(event)
{
    // Preventing form reload
	event.preventDefault();
    
    // We prompt the user to create a new contact and enter relevant information about a contact
    // const fullName = prompt("Enter contact name:");
    // const email = prompt("Enter contact email:");
    // const phone = prompt("Enter contact phone:");

    let firstName = document.getElementById("newContact_FirstName").value;
	let lastName = document.getElementById("newContact_LastName").value;
	let email = document.getElementById("newContactEmail").value;
	let phone = document.getElementById("newContactPhone").value;

    // Checking to see ifn any of the values or null, if they are -> we can alert the user that all fields need to be present
    // if (fullName && email && phone) {

    //     // After we grab the data -> Persist it to the database
    //     let userId = getCookie('accountID'); // -> NEEDS to not be hardcoded (use getCookie() function)

    //     // Creating JSON object of data we retrieved
    //     let jsonPayload = JSON.stringify({ fullName: fullName, email: email, phone: phone, userId: userId });

    //     // Initialize POST request
    //     fetch("http://contact.afari.online/contactManagerFolder/LAMPAPI/CoreFunctionsAPI/CreateContact.php", {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: jsonPayload
    //     })
    //         // Handling the data we get sent back
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.error) {
    //                 alert("Error creating contacts: " + data.error);
    //             } else {
    //                 alert("Contact with contact id: " + data.contactid + " has been created successfully");
    //                 fetchContacts();
    //             }
    //         })
    //         .catch(error => {
    //             console.error("Error creating contacts:", error);
    //         });
    // }

    if (firstName === "" || lastName === "" || email === "" || phone === "") {
        alert("Please fill in all fields.");
        return;
    }

    let userId = getCookie('accountID');

    // Create payload
	let tmp = {
		FirstName: firstName,
		LastName: lastName,
		Email: email,
		PhoneNumber: phone,
        userId: userId,
	};
	let jsonPayload = JSON.stringify(tmp);

    fetch("http://contact.afari.online/contactManagerFolder/LAMPAPI/CoreFunctionsAPI/CreateContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonPayload,
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Error creating contacts: " + data.error);
        } else {
            alert("Contact with contact id: " + data.contactid + " has been created successfully");
            cancelAddContact();
            fetchContacts();
        }
    })
    .catch(error => console.error("Error creating contacts:", error));
}

// Function for updating a contact
function updateContact() {
    if (selectedContact !== null) {
        // Gathering data for new contact details
        const newFullName = prompt("Enter new name", contactArray[selectedContact].name);
        const newEmail = prompt("Enter new email:", contactArray[selectedContact].email);
        const newPhone = prompt("Enter new phone:", contactArray[selectedContact].phone);

        if (newFullName && newEmail && newPhone) {

            // Defining user id of the current user we are logged into
            let userId = getCookie('accountID');

            // Define the id of the user we have currently *selected*
            let ID = contactArray[selectedContact].id;

            // Creating JSON Payload
            let jsonPayload = JSON.stringify({ contactID: ID, accountID: userId, fullName: newFullName, email: newEmail, phone: newPhone });

            // Fetch Request -> Need to pass through the ID, UserID, new name, new email, and new phone number
            fetch("http://contact.afari.online/contactManagerFolder/LAMPAPI/CoreFunctionsAPI/UpdateContact.php", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: jsonPayload
            })
                // Handling the data we get sent back
                .then(response => response.json())
                .then(data => {
                    if (data.error)
                    {
                        alert("Error carrying out put request: " + data.error);
                    }
                    else {
                        // Update local data after receiving a successful response from the server via fetch
                        fetchContacts();
                        alert("Contact with id of " + contactArray[selectedContact].id + " has been updated with these values "  + newEmail + " " + newFullName + " " +  newPhone);

                    }
                })
                .catch(error => {
                    console.error("Error updating contact:", error);
                });
        }
    } else {
        alert("Please select a contact first!");
    }
}


// Function for deleting a contact
// Function for deleting a contact
function deleteContact()
{
    if (selectedContact !== null)
    {
        const confirmDelete = confirm(`Are you sure you want to delete ${contactArray[selectedContact].name}?`);
        if (confirmDelete)
        {
            // Defining user id of the current user we are logged into
            let userId = getCookie('accountID');

            // Define the id of the user we have currently *selected*
            let ID = contactArray[selectedContact].id;

            // Creating JSON Payload
            let jsonPayload = JSON.stringify({ contactID: ID, accountID: userId });

            // Fetch Request -> Need to pass through the ID, UserID, new name, new email, and new phone number
            fetch("http://contact.afari.online/contactManagerFolder/LAMPAPI/CoreFunctionsAPI/DeleteContact.php", {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: jsonPayload
            })
                // Handling the data we get sent back
                .then(response => response.json())
                .then(data =>
                {
                    if (data.error)
                    {
                        alert("Error carrying out Delete request: " + data.error);
                    }
                    else {
                        // Update local data after receiving a successful response from the server via fetch
                        fetchContacts();
                        alert("Contact with id of " + contactArray[selectedContact].id + " has been deleted.");

                        // Clearing contact details
                        contactDetails.innerHTML = `<h2>Select a Contact</h2>
                <p><span class="icon">📧</span> Email</p>
                <p><span class="icon">📞</span> Phone</p>`;

                    }
                })
                .catch(error => {
                    console.error("Error deleting contact:", error);
                });
        }
    }
    else
    {
        alert("Please select a contact first!");
    }
}


// Initial rendering
fetchContacts();