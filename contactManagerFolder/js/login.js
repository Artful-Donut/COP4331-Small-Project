// login.js

function handleLoginSuccess(userId)
{
	clearCookie('accountID');
	setCookie('accountID', userId, 7); // Store user ID for 7 days
	console.log("Login successful, User ID stored:", userId);
	window.location.href = "dashboard.html"; // Redirect to dashboard
}

function doLogin(e) {
	if (e) {
		e.preventDefault(); // Prevent page reload from form submission
	}

	let email = document.getElementById("email").value;
	let password = document.getElementById("password").value;
	let loginResult = document.getElementById("loginResult");

	// check if email or password is empty
	if (email === "" || password === "") {
		loginResult.innerHTML = "Please enter both email and password";
		loginResult.style.color = "red";
		return;
	}

	let tmp = { email: email, password: password };
	let jsonPayload = JSON.stringify(tmp);
	//let url = "http://localhost/LAMPAPI/LoginRegisterAPI/Login.php";
	let url = "http://contact.afari.online/contactManagerFolder/LAMPAPI/LoginRegisterAPI/Login.php";

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			let jsonObject = JSON.parse(xhr.responseText);
			let userId = jsonObject.id;

			if (userId < 1) {
				loginResult.innerHTML = "Email and/or password are not correct";
				loginResult.style.color = "red";
				return;
			}

			handleLoginSuccess(userId);
		}
	};

	xhr.onerror = function () {
		alert("Network error. Please try again later.");
	};

	try {
		xhr.send(jsonPayload);
	} catch (err) {
		alert("Request failed: " + err.message);
	}
}