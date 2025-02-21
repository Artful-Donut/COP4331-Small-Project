<?php
// Allow CORS (Enable cross-origin requests)

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
{
    http_response_code(200);
    exit();
}


// Retrieving JSON data
$inData = getRequestInfo();

// Extracting JSON value
$ID = $inData["contactID"];
$userId = $inData["accountID"];

// Connection object declaration
//$conn = new mysqli("23.20.217.81", "root", "iSf7VogRMo0/", "lampTest");
$conn = new mysqli("localhost", "poopoo", "peepee", "SMPROJ");

// Connection validation
if($conn->connect_error)
{
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}


else
{
    // Preparing SQL statement
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UniqueID=?");
    $stmt->bind_param("ii", $ID, $userId); // Injecting params to SQL statement

    // Executing statement
    if($stmt->execute())
    {
        // Success case -> return information about entity that was deleted
        // Confirming by rows being affected
        if ($stmt->affected_rows > 0)
        {
            returnWithSuccess($userId, $ID);
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
function returnWithSuccess($userId, $ID)
{
    $retValue = json_encode(array("message" => "Contact deleted successfully with these properties", "User" => $userId, "Email" => $ID));
    sendResultInfoAsJson($retValue);
}


?>