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

// Database Connection
$conn = new mysqli("23.20.217.81", "root", "iSf7VogRMo0/", "lampTest");

// Validate Connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

else {
    // Only filter by UserID for the initial fetch
    $stmt = $conn->prepare("SELECT ID, FullName, Email, Phone FROM Contacts WHERE UserID = ?");

    // Bind UserID as an Integer
    $stmt->bind_param("i", $inData["UserId"]);
    $stmt->execute();

    $result = $stmt->get_result();

    // Storing the results from the sql statement into our contacts array to be sent to the front end
    $contacts = [];
    while ($row = $result->fetch_assoc()) {
        $contacts[] = [
            "id" => $row["ID"],
            "name" => $row["FullName"],
            "email" => $row["Email"],
            "phone" => $row["Phone"]
        ];
    }

    // Case where we have do not have any contacts associated with an account
    if (empty($contacts)) {
        returnWithError("No contacts found");
    }
    else
    {
        returnWithInfo($contacts);
    }

    // Closing connections
    $stmt->close();
    $conn->close();
}

// Helper Function to Get JSON Input
function getRequestInfo()
{
    $jsonData = file_get_contents('php://input');
    if (!$jsonData) {
        die(json_encode(["error" => "No JSON input received"]));
    }

    $decodedData = json_decode($jsonData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        die(json_encode(["error" => "Invalid JSON format: " . json_last_error_msg()]));
    }

    return $decodedData;
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