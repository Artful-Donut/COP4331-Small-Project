<?php
$inData = getRequestInfo();



/*$firstName = $inData["FirstName"];
$lastName = $inData["LastName"];
$mail = $inData["Email"];
$phone = $inData["PhoneNumber"];
$pass = $inData["Password"];*/

// error handling
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: application/json');


# create connection (copied from Login.php)
$conn = new mysqli("localhost", "poopoo", "peepee", "SMPROJ");


# if connection fails
if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT ID FROM MainUsers WHERE Email = ?");
    $stmt->bind_param("s", $inData["email"]);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        returnWithError("User already exists!");
    } else {
        $stmt = $conn->prepare("INSERT INTO MainUsers (FirstName, LastName, Email, PhoneNumber, Password) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $inData['firstName'], $inData['lastName'], $inData['email'], $inData['phoneNumber'], $inData['password']);
        $stmt->execute();

        if($row = $result->fetch_assoc())
        {
            returnWithInfo($row['FirstName'], $row['LastName'], $row['ID']);
        }
        else
        {
            returnWithError("No results found");
        }
        $stmt->close();
        $conn->close();
        // Success
    }
}


// Function stuff ig
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

;

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>