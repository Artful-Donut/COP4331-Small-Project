<?php
// Allow CORS (Enable cross-origin requests)

error_reporting(E_ALL);
ini_set('display_errors', 1);

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

//sqli connection
$conn = new mysqli("localhost", "poopoo", "peepee", "SMPROJ");

//validate connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}
else{
    $stmt = $conn->prepare("Select UniqueID, FirstName, LastName, Email, PhoneNumber FROM Contacts WHERE ID = ?");
    $stmt->bind_param("i", $inData["ID"]);
    $stmt->execute();
    $result = $stmt->get_result();

    //store results into array because of chance of multiple results from search
    $contacts = [];
    while ($row = $result->fetch_assoc()) {
        $contacts[] = [
            "id" => $row["UniqueID"],
            "FirstName" => $row["FirstName"],
            "LastName" => $row["LastName"],
            "email" => $row["Email"],
            "phone" => $row["PhoneNumber"]
        ];
    }
    if(empty($contacts)){
        returnWithError("No contacts found");
    }
    else
    {
        returnWithInfo($contacts);
    }

    // close connections
    $stmt->close();
    $conn->close();
}

//Gerber Helper Functions//
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

// Helper Function to Return JSON Response
function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);
}

// Function to Return Error Response
function returnWithError($err)
{
    sendResultInfoAsJson(["error" => $err]);
}

// Function to Return Success Response with Contact Information
function returnWithInfo($contacts)
{
    sendResultInfoAsJson(["results" => $contacts, "error" => ""]);
}

?>