<?php
    # Retrieve JSON
    $inData = getRequestInfo();
    
    # Set default values
    $id = $inData["id"];
    $firstName = $inData["first_name"];
    $lastName = $inData["last_name"];




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