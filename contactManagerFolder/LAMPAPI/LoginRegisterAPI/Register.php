<?php
$inData = getRequestInfo();

/*
    let tmp = {
        FirstName : firstName,
        LastName : lastName,
        Email : email,
        PhoneNumber : phone,
};
*/

$firstName = $inData["FirstName"];
$lastName = $inData["LastName"];
$mail = $inData["Email"];
$phone = $inData["PhoneNumber"];
$pass = $inData["Password"];

# create connection (copied from Login.php)
$conn = new mysqli("localhost", "poopoo", "peepee", "SMPROJ");


# if connection fails
if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
} else {
    $uniqEm = $conn->prepare("SELECT * FROM MainUsers WHERE Email = ?");
    $uniqEm->bind_param("s", $mail);
    $uniqEm->execute();
    $result = $uniqEm->get_result();

    if ($result->num_rows > 0) {
        returnWithError("User already exists!");
    } else {
        $stmt = $conn->prepare("INSERT INTO MainUsers (FirstName, LastName, Email, PhoneNumber, Password) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $firstName, $lastName, $mail, $phone, $pass);
        $stmt->execute();

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
        // Success
    }
}


// Function stuff ig
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

;

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>