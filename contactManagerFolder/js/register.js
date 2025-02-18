// TODO: We can probably add this code to a bigger js file if we wanna keep things tidy
// I just don't want to mess with other files in this branch

const urlBase = 'http://contact.afari.online/contactManagerFolder/LAMPAPI/LoginRegisterAPI';
const extension = 'php';

// Adds a user to the database
function addUser()
{
	let firstName = document.getElementById("firstname").value;
    let lastName = document.getElementById("lastname").value;
    let phone = document.getElementById("phn").value;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    // TODO: Having a text line that shows results would be cool. I think I'm more inclined to take the 
    // user back to the login screen tho :<
	// document.getElementById("colorAddResult").innerHTML = "";

    // TODO: I don't know what to do for the login field so I left it blank :(
	let tmp = {
        FirstName : firstName,
        LastName : lastName,
        Email : email,
        PhoneNumber : phone,
        Password : pass
    };
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + 'php';
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				window.alert("User Created");

                // sends user back to the index
                window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		window.alert("uh, yeah we buried and disintegrated your new user. sorry.");
	}
	
}