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
	$login = $inData["Login"];
	$pass = $inData["Password"];

	# create connection (copied from Login.php)
	$conn = new mysqli("localhost", "Cavem", "password", "SMproj");

	# if connection fails
	if ($conn->connect_error) {
		echo("connection FAILED.");
		returnWithError($conn->connect_error);
	} else {
		$stmt = $conn->prepare("INSERT into MainUsers (ID,FirstName,LastName,Email,PhoneNumber,Login,Password) VALUES(?,?,?,?,?,?,?)");
		$stmt->bind_param("issssss", $userId, $firstName, $lastName, $mail, $phone, $login, $pass);
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