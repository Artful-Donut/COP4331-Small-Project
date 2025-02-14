<?php

$inData = getRequestInfo();

$searchResults = []; // Use an array instead of a string
$searchCount = 0;

$conn = new mysqli("23.20.217.81", "root", "iSf7VogRMo0/", "lampTest");

if ($conn->connect_error)
{
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}
else
{
    $stmt = $conn->prepare("SELECT FullName FROM Contacts WHERE FullName LIKE ? AND UserID=?");
    $fullName = "%" . $inData["search"] . "%";
    $stmt->bind_param("ss", $fullName, $inData["UserId"]);
    $stmt->execute();

    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc())
    {
        $searchResults[] = $row["FullName"]; // Store each result in an array
        $searchCount++;
    }

    if ($searchCount == 0)
    {
        returnWithError("No Records Found");
    }
    else
    {
        returnWithInfo($searchResults);
    }

    $stmt->close();
    $conn->close();
}

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

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj); // Ensure proper JSON encoding
}

function returnWithError($err)
{
    $retValue = ["error" => $err];
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = ["results" => $searchResults, "error" => ""];
    sendResultInfoAsJson($retValue);
}

?>