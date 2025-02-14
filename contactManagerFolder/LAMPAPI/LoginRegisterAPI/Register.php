<?php
/*
$inData = getRequestInfo();


error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: application/json');

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
}*/
function getRequestInfo() {
    return json_decode(file_get_contents("php://input"), true);
}
function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo json_encode($obj);
    exit();
}

function returnWithError($err) {
    sendResultInfoAsJson(["success" => false, "message" => $err]);
}

// if create user button sends user to contacts.html, set success to false
function returnWithInfo($message) {
    sendResultInfoAsJson(["success" => true, "message" => $message]);
}

// inData
$inData = getRequestInfo();

// define values from inData
$firstName = isset($inData["firstName"]) ? $inData["firstName"] : null;
$lastName = isset($inData["lastName"]) ? $inData["lastName"] : null;
$email = isset($inData["email"]) ? $inData["email"] : null;
$password = isset($inData["password"]) ? $inData["password"] : null;
$phoneNumber = isset($inData["phoneNumber"]) ? $inData["phoneNumber"] : null;



?>
