<?php

// Retrieving JSON data
$inData = getRequestInfo();

// Extracting JSON value
$contactID = $inData["contactID"];
$accountID = $inData["accountID"];
$fullName = $inData["fullName"];
$email = $inData["email"];


// Connection object declaration
$conn = new mysqli("23.20.217.81", "root", "iSf7VogRMo0/", "lampTest");

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
$stmt = $conn->prepare("UPDATE Contacts SET FullName = ?, Email = ? WHERE ID = ? AND UserID = ?");
$stmt->bind_param("ssii", $fullName, $email, $contactID, $accountID);

// Execute query
if ($stmt->execute())
{
    if ($stmt->affected_rows > 0)
    {
        returnWithSuccess($fullName, $email);
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

function returnWithSuccess($fullName, $email) {
    sendResultInfoAsJson(json_encode([
        "message" => "Contact updated successfully!",
        "FullName" => $fullName,
        "Email" => $email
    ]));
}

?>