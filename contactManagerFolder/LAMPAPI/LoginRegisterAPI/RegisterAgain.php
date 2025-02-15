<?php


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




// create Register.php logic


?>
