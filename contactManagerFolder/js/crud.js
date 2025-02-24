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
                // alert("Error fetching contacts: " + data.error);
            } else {
                contactArray = data.results;
                displayContacts(contactArray); // Display contacts from API call
            }
        })
        .catch(error => {
            // console.error("Error fetching contacts:", error);
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
        div.textContent = (contact.FirstName + " " + contact.LastName) || "No Name";
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
        <h2>${contact.FirstName + " " + contact.LastName}</h2>
        <p><span class="icon">📧</span> ${contact.email}</p>
        <p><span class="icon">📞</span> ${contact.phone}</p>`;
}

// Show the "Add Contact" form in the right panel
function showAddContactForm() {
    document.getElementById("addContactForm").style.display = "block";
    document.getElementById("emptyState").style.display = "none";
    document.getElementById("contactInfo").style.display = "none";

    // Clear input fields when opening the form
    document.getElementById("newContact_FirstName").value = "";
    document.getElementById("newContact_LastName").value = "";
    document.getElementById("newContactEmail").value = "";
    document.getElementById("newContactPhone").value = "";
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
    let userId = getCookie('accountID');

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

    // Create payload
	let tmp = {
		FirstName: firstName,
		LastName: lastName,
		Email: email,
		PhoneNumber: phone,
        ID: userId
	};
	let jsonPayload = JSON.stringify(tmp);

    fetch("http://contact.afari.online/contactManagerFolder/LAMPAPI/CoreFunctionsAPI/CreateContact.php", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonPayload
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Error creating contacts: " + data.error);
        } else {
            // alert("Contact with contact id: " + data.contactid + " has been created successfully");
            cancelAddContact();
            fetchContacts();
        }
    })
    .catch(error => console.error("Error creating contacts:", error));
}

// Function for updating a contact
function updateContact(event) {
    event.preventDefault;

    if (selectedContact !== null) {
        // Gathering data for new contact details
        // const newFirstName = prompt("Enter new first name", contactArray[selectedContact].FirstName);
        // const newLastName = prompt("Enter new last name", contactArray[selectedContact].LastName);
        // const newEmail = prompt("Enter new email:", contactArray[selectedContact].email);
        // const newPhone = prompt("Enter new phone:", contactArray[selectedContact].phone);

        let contact = contactArray[selectedContact];
        // Populate modal fields with existing contact info
        document.getElementById("updateFirstName").value = contact.FirstName;
        document.getElementById("updateLastName").value = contact.LastName;
        document.getElementById("updateEmail").value = contact.email;
        document.getElementById("updatePhone").value = contact.phone;

        // Store contact ID for update reference
        document.getElementById("updateContactForm").setAttribute("data-contact-id", contact.id);

        // Show modal
        document.getElementById("updateContactModal").style.display = "flex";

        let contactID = document.getElementById("updateContactForm").getAttribute("data-contact-id");
        let userId = getCookie('accountID');
        
        let updatedContact = {
            contactID: contactID,
            accountID: userId,
            newFirstName: document.getElementById("updateFirstName").value.trim(),
            newLastName: document.getElementById("updateLastName").value.trim(),
            newEmail: document.getElementById("updateEmail").value.trim(),
            newPhone: document.getElementById("updatePhone").value.trim(),
        };
        

        // if (newFirstName && newLastName && newEmail && newPhone) {

            // Defining user id of the current user we are logged into
            // let userId = getCookie('accountID');

            // Define the id of the user we have currently *selected*
            // let ID = contactArray[selectedContact].id;
            // let contactID = contactArray[selectedContact].id;

            // Creating JSON Payload
            let jsonPayload = JSON.stringify(updatedContact);

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
                        alert("Contact with id of " + contactArray[selectedContact].id + " has been updated with these values "  + newEmail + " " + newFullName + " " +  newPhone);
                        fetchContacts();

                        // Update right panel with new contact info
                        contactArray[selectedContact].FirstName = newFirstName;
                        contactArray[selectedContact].LastName = newLastName;
                        contactArray[selectedContact].email = newEmail;
                        contactArray[selectedContact].phone = newPhone;
                        displayContactDetails(contactArray[selectedContact], selectedContact);

                        closeUpdateModal();
                    }
                })
                .catch(error => {
                    console.error("Error updating contact:", error);
                });
        }
    // } else {
    //     alert("Please select a contact first!");
    // }
}

// Close modal function
function closeUpdateModal() {
    document.getElementById("updateContactModal").style.display = "none";
}


// Function for deleting a contact
// Function for deleting a contact
function deleteContact() {
    if (selectedContact !== null) {
        const confirmDelete = confirm(`Are you sure you want to delete ${contactArray[selectedContact].FirstName + " " + contactArray[selectedContact].LastName}?`);
        if (confirmDelete) {
            // Defining user id of the current user we are logged into
            let userId = getCookie('accountID');

            // Define the id of the user we have currently *selected*
            // let ID = contactArray[selectedContact].id;
            let contactID = contactArray[selectedContact].id;

            // Creating JSON Payload
            let jsonPayload = JSON.stringify({ contactID: contactID, accountID: userId });

            // Fetch Request -> Need to pass through the ID, UserID, new name, new email, and new phone number
            fetch("http://contact.afari.online/contactManagerFolder/LAMPAPI/CoreFunctionsAPI/DeleteContact.php", {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: jsonPayload
            })
                // Handling the data we get sent back
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert("Error carrying out Delete request: " + data.error);
                    }
                    else {
                        // Update local data after receiving a successful response from the server via fetch
                        fetchContacts();
                        // alert("Contact with id of " + contactArray[selectedContact].id + " has been deleted.");

                        // reset right panel to empty state (sleeping cat)
                        contactDetails.innerHTML = `
                            <div id="emptyState" class="empty-state">
                                <img src="contactManagerFolder/images/sleeping-cat.jpg" alt="Sleeping Cat" class="cat-img">
                                <p>Select a contact or add a new one</p>
                            </div>
                        `;

                        // Clearing contact details
                        // contactDetails.innerHTML = `<h2>Select a Contact</h2>
                        // <p><span class="icon">📧</span> Email</p>
                        // <p><span class="icon">📞</span> Phone</p>`;
                        // contactDetails.innerHTML = `
                        //     <div id="addContactForm" class="form-container" style="display: none;"> ... </div>
                        //     <div class="action-buttons" id="contactActions" style="display: none;"> ... </div>
                        //     <div id="emptyState" class="empty-state">
                        //         <img src="contactManagerFolder/images/delete-cat.png" ... />
                        //         <p>Select a contact or add a new one</p>
                        //     </div>
                        //     <div id="contactInfo" style="display: none;"> ... </div>
                        // `;

                        /*
                        <div id="emptyState" class="empty-state">
                            <img src="contactManagerFolder/images/sleeping-cat.jpg" alt="Sleeping Cat" class="cat-img">
                            <p>Select a contact or add a new one</p>
                        </div>

                        contactDetails.innerHTML = `
                            <div class="action-buttons">
                                <button onclick="updateContact()">✏️ Edit</button>
                                <button onclick="deleteContact()">🗑️ Delete</button>
                            </div>
                            <h2>${contact.FirstName + " " + contact.LastName}</h2>
                            <p><span class="icon">📧</span> ${contact.email}</p>
                            <p><span class="icon">📞</span> ${contact.phone}</p>`;
                        */

                    }
                })
                .catch(error => {
                    console.error("Error deleting contact:", error);
                });
        }
    }
    else {
        alert("Please select a contact first!");
    }
}

// Initial rendering
fetchContacts();