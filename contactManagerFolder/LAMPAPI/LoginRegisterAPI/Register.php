<?php
	$inData = getRequestInfo();
	
	/*
		let tmp = {
			FirstName : firstName,
			LastName : lastName,
			Email : email,
			PhoneNumber : phone,
    };
	*/

	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$mail = $inData["Email"];
	$phone = $inData["PhoneNumber"];
	$pass = $inData["Password"];

	# create connection (copied from Login.php)
	$conn = new mysqli("localhost", "poopoo", "peepee", "SMPROJ");

	# if connection fails
	if ($conn->connect_error) {
		echo("connection FAILED.");
		returnWithError($conn->connect_error);
	} else {
		$uniqEm = $conn->prepare("SELECT * FROM MainUser WHERE Email = ''");

		if (!$uniq)
		{
			returnWithError('User already exists!');
		}

		$stmt = $conn->prepare("INSERT into MainUsers (FirstName,LastName,Email,PhoneNumber, Password) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $firstName, $lastName, $mail, $phone, $pass);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}



// Function stuff ig
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	};

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}


?>