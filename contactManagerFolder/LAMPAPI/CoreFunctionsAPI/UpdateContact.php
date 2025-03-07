<?php

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Allow CORS (Enable cross-origin requests)

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


// Retrieving JSON data
$inData = getRequestInfo();

// Extracting JSON value
$contactID = $inData["contactID"];
$accountID = $inData["accountID"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];
$phone = $inData["phone"];


// Connection object declaration
//$conn = new mysqli("23.20.217.81", "root", "iSf7VogRMo0/", "lampTest");
$conn = new mysqli("localhost", "poopoo", "peepee", "SMPROJ");

// Connection validation
if ($conn->connect_error)
{
    returnWithError("Database connection failed. Please try again later.");
    exit();
}

// Check if the contact exists before updating
$checkStmt = $conn->prepare("SELECT UniqueID FROM Contacts WHERE UniqueId = ? AND ID = ?");
$checkStmt->bind_param("ii", $contactID, $accountID);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows === 0)
{
    returnWithError("No record found matching criteria.");
    exit();
}
$checkStmt->close();

// Prepare update statement
$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Email = ?, PhoneNumber = ? WHERE UniqueID = ? AND ID = ?");
$stmt->bind_param("ssssii", $firstName, $lastName, $email, $phone, $contactID, $accountID);

// Execute query
if ($stmt->execute())
{
    if ($stmt->affected_rows > 0)
    {
        returnWithSuccess($firstName,$lastName, $email, $phone);
    }
    else
    {
        returnWithError("No changes made (same values provided).");
    }
}

else
{
    returnWithError("Query execution failed: " . $stmt->error);
}

// Closing connections
$stmt->close();
$conn->close();

// Helper functions
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    sendResultInfoAsJson(json_encode(["error" => $err]));
}

function returnWithSuccess($firstName, $lastName, $email, $phone) {
    sendResultInfoAsJson(json_encode([
        "message" => "Contact updated successfully!",
        "FullName" => $firstName,
        "LastName" => $lastName,
        "Email" => $email,
        "Phone" => $phone
    ]));
}

?>