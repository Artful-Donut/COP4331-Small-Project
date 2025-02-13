// TODO: We can probably add this code to a bigger js file if we wanna keep things tidy
// I just don't want to mess with other files in this branch

const urlBase = 'http://contact.afari.online/LAMPAPI';
const extension = 'php';

// Adds a user to the database
function addUser()
{
	let firstName = document.getElementById("first_name").value;
    let lastName = document.getElementById("last_name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    // TODO: Having a text line that shows results would be cool. I think I'm more inclined to take the 
    // user back to the login screen tho :<
	// document.getElementById("colorAddResult").innerHTML = "";

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
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		window.alert("uh, yeah we buried and disintegrated your new user. sorry.");
	}
	
}