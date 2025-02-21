// Adds a user to the database
function addUser(event) {
	// Preventing form reload
	event.preventDefault();

	let firstName = document.getElementById("first_name").value;
	let lastName = document.getElementById("last_name").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;
	let pass = document.getElementById("password").value;
	let errorMessage = document.getElementById("errorMessage");

	// Email validation (Must follow format like user@gmail.com)
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        errorMessage.innerHTML = "Please enter a valid email (e.g., user@gmail.com).";
        errorMessage.style.color = "red";
        return;
    }

    // Phone number validation (Must be exactly 10 digits)
    let phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
        errorMessage.innerHTML = "Phone number must be exactly 10 digits.";
        errorMessage.style.color = "red";
        return;
    }

    // Password validation (Minimum 6 characters)
    if (pass.length < 6) {
        errorMessage.innerHTML = "Password must be at least 6 characters long.";
        errorMessage.style.color = "red";
        return;
    }

	// Create payload
	let tmp = {
		FirstName: firstName,
		LastName: lastName,
		Email: email,
		PhoneNumber: phone,
		Password: pass
	};
	let jsonPayload = JSON.stringify(tmp);

	// API URL
	//let url = "http://localhost/contactManagerFolder/LAMPAPI/LoginRegisterAPI/Register.php";
	let url = "http://contact.afari.online/contactManagerFolder/LAMPAPI/LoginRegisterAPI/Register.php";

	// Initialize XHR
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status === 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error) {
					alert("Error: " + jsonObject.error);
				} else {
					alert("User registered successfully!");
					handleRegisterSuccess(jsonObject.id);
				}
			} else {
				alert("Registration failed: Server error.");
			}
		}
	};

	xhr.onerror = function () {
		alert("Network error. Please try again later.");
	};

	// Send request immediately
	xhr.send(jsonPayload);
}

// Function called on success
function handleRegisterSuccess(userId) {
	clearCookie('accountID');
	setCookie('accountID', userId, 7); // Store user ID for 7 days
	console.log("Registration successful, User ID stored:", userId);
	window.location.href = "dashboard.html"; // Redirect to dashboard
}