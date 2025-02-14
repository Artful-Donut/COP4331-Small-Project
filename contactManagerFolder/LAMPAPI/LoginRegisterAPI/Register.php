<?php
$inData = getRequestInfo();

// Extract and sanitize input
$firstName = trim($inData["FirstName"]);
$lastName = trim($inData["LastName"]);
$email = strtolower(trim($inData["Email"]));
$phone = trim($inData["PhoneNumber"]);
$pass = trim($inData["Password"]);

// Hash the password
$hashedPassword = password_hash($pass, PASSWORD_BCRYPT);

// Create database connection
$conn = new mysqli("localhost", "poopoo", "peepee", "SMPROJ");

// If connection fails
if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
    exit();
}

// Check if user already exists
$stmt = $conn->prepare("SELECT ID FROM MainUsers WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    returnWithError("User already exists!");
    exit();
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO MainUsers (FirstName, LastName, Email, PhoneNumber, Password) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $firstName, $lastName, $email, $phone, $hashedPassword);
$stmt->execute();

// Get inserted user ID
$userId = $conn->insert_id;
returnWithInfo($firstName, $lastName, $userId);

// Close statements and connection
$stmt->close();
$conn->close();

// Function definitions
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
    exit();
}

function returnWithInfo($firstName, $lastName, $id) {
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson($retValue);
}
?>
