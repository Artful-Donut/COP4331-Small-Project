<?php
// Allow CORS (Enable cross-origin requests)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Requesting incoming JSON object
$inData = getRequestInfo();

// Extracting values from JSON
$fullName = $inData["fullName"];
$email = $inData["email"];
$userId = $inData["userId"];
$phone = $inData["phone"];
// Connection object that allows us to connect to our db
$conn = new mysqli("localhost", "root", "iSf7VogRMo0/", "lampTest");

if ($conn->connect_error)
{
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
//    returnWithError($conn->connect_error);
} 
else
{
    // Preparing sql statement to be executed on our DB
    $stmt = $conn->prepare("INSERT INTO Contacts (FullName, Email, UserID, Phone) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $fullName, $email, $userId, $phone); // Binding our parameters to the ? arguments in the SQL statement

    // Executing statement
    if ($stmt->execute()) 
    {
        // Success case - Get generated id on the most recently created user to send to the front end
        $newId = $conn->insert_id; 
        returnWithSuccess($newId);
    } 
    
    // Fail case - return an error response object to the front end
    else
    {
        returnWithError($stmt->error);
    }

    // Closing DB
    $stmt->close();
    $conn->close();
}

// Functions
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = json_encode(array("error" => $err));
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess($newId) {
    $retValue = json_encode(array("message" => "Contact created successfully", "contactId" => $newId));
    sendResultInfoAsJson($retValue);
}
?>