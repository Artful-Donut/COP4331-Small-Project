<?php
// Allow CORS and set JSON response headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


$userId = isset($_GET['userID']) ? intval($_GET['userID']) : 0;
$searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : ''; 

$conn = new mysqli('localhost', 'poopoo', 'peepee','SMPROJ');

if ($conn -> connect_error)
{
    die(json_encode(["Error" => "Database connection failed: ". $conn->connecterror]));
}

$likeTerm = "%" . $conn->real_escape_string($searchTerm) . "%";

$sqlEntry = "SELECT * FROM Contacts
    WHERE ID = ?
    AND (
    CONCAT_WS(' ',FirstName,LastName) LIKE ?
    OR FirstName LIKE ? 
    OR LastName LIKE ?
    OR EMAIL LIKE ? 
    OR Phonenumber LIKE ?
    )";
$stmt = $conn->prepare($sqlEntry);

if (!$stmt)
{
    echo json_encode (["error" => $conn->error]);
    exit;
}

$stmt->bind_param("isssss", $userId, $likeTerm, $likeTerm, $likeTerm, $likeTerm, $likeTerm);

$stmt->execute();

$result = $stmt->get_result();

$contacts = [];


//THE FOUND CONTACTS ARE IN CONTACTS;
while ($row = $result->fetch_assoc())
{
    $contacts[] = $row;
}



echo json_encode($contacts);

$stmt->close();
$conn->close();
?>
