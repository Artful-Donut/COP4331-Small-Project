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
//$hashedPassword = password_hash($pass, PASSWORD_BCRYPT);

// Create database connection
$conn = new mysqli("23.20.217.81", "root", "iSf7VogRMo0/", "lampTest");

// If connection fails
if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
    exit();
}

// Check if user already exists
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    returnWithError("User already exists!");
    exit();
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Email, Phone, Password) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $firstName, $lastName, $email, $phone, $pass);
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
