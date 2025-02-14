<?php

// Retrieving JSON data
$inData = getRequestInfo();

// Extracting JSON value
$fullName = $inData["fullName"];
$email = $inData["email"];
$userId = $inData["UserId"];

// Connection object declaration
$conn = new mysqli("23.20.217.81", "root", "iSf7VogRMo0/", "lampTest");

// Connection validation
if($conn->connect_error)
{
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}


else
{
    // Preparing SQL statement
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE FullName=? AND UserId=?");
    $stmt->bind_param("si", $fullName, $userId); // Injecting params to SQL statement

    // Executing statement
    if($stmt->execute())
    {
        // Success case -> return information about entity that was deleted
        // Confirming by rows being affected
        if ($stmt->affected_rows > 0)
        {
            returnWithSuccess($fullName, $email);
        }
        else
        {
            // No record was found
            returnWithError("No record found matching criteria");
        }
    }

    // Execution Error
    else
    {
        returnWithError("Error executing query");
    }

    // Closing connections
    $stmt->close();
    $conn->close();
}


// Helper php functions
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}


// Use this for error case
function returnWithError($err) {
    $retValue = json_encode(array("error" => $err));
    sendResultInfoAsJson($retValue);
}


// Modify this
function returnWithSuccess($fullName, $email)
{
    $retValue = json_encode(array("message" => "Contact deleted successfully with these properties", "FullName" => $fullName, "Email" => $email));
    sendResultInfoAsJson($retValue);
}


?>