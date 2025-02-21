<?php

// Allow CORS (Enable cross-origin requests)
header("Access-Control-Allow-Origin: http://omarihop.xyz"); // Use * if multiple allowed origins
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Allows cookies & authentication
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Retrieving JSON data
$inData = getRequestInfo();

// Extracting JSON value
$contactID = $inData["contactID"];
$accountID = $inData["accountID"];
$fullName = $inData["fullName"];
$email = $inData["email"];
$phone = $inData["phone"];


// Connection object declaration
$conn = new mysqli("localhost", "root", "iSf7VogRMo0/", "lampTest");

// Connection validation
if ($conn->connect_error)
{
    returnWithError("Database connection failed. Please try again later.");
    exit();
}

// Check if the contact exists before updating
$checkStmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID = ? AND UserID = ?");
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
$stmt = $conn->prepare("UPDATE Contacts SET FullName = ?, Email = ?, Phone = ? WHERE ID = ? AND UserID = ?");
$stmt->bind_param("sssii", $fullName, $email, $phone, $contactID, $accountID);

// Execute query
if ($stmt->execute())
{
    if ($stmt->affected_rows > 0)
    {
        returnWithSuccess($fullName, $email, $phone);
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

function returnWithSuccess($fullName, $email, $phone) {
    sendResultInfoAsJson(json_encode([
        "message" => "Contact updated successfully!",
        "FullName" => $fullName,
        "Email" => $email,
        "Phone" => $phone
    ]));
}

?>