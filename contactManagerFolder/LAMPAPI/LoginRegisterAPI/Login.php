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

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
{
    http_response_code(200);
    exit();
}

$inData = getRequestInfo();

$id = 0;
$firstName = "";
$lastName = "";

$conn = new mysqli("localhost", "root", "iSf7VogRMo0/", "lampTest");

if ($conn->connect_error)
{
    returnWithError($conn->connect_error);
}
else
{
   $stmt = $conn->prepare("SELECT ID, FirstName, LastName FROM Users WHERE Email = ? AND Password = ?");
   $stmt->bind_param("ss", $inData['email'], $inData['password']);
   $stmt->execute();
   $result = $stmt->get_result();

   if($row = $result->fetch_assoc())
   {
       returnWithInfo($row['FirstName'], $row['LastName'], $row['ID']);
   }
   else
   {
       returnWithError("No results found");
   }
   $stmt->close();
   $conn->close();

}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>