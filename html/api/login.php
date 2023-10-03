<?php declare(strict_types = 1);

$serverName = "localhost:3306";
$dbUsername = "root";
$dbPassword = "dee1967e777233cb6cfdd70201c34be47a29e68cd09505c2";
$dbName = "ContantManager";

// Create connection
$connection = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);

// Check connection
if ($connection->connect_error) {
  exit("Connection failed: " . $connection->connect_error);
}
echo "Connected successfully";

function login() {
	$query = "SELECT user_id, first, last FROM users WHERE email=$_POST['email'], password=$_POST['password']"
	$result = $conn->query($sql);

	if ($result->num_rows === 1) {
	  echo "User exists";
	} else {
	  echo "Error: " . $query . "<br>" . $connection->error;
	}

	$data = array("id"=>$result.id, "fname"=>$result.firstName, "lname"=>$result.lastName, "err"=>"");
	header("Content-Type: application/json");

	echo json_encode($data);

	return json_encode($data);
}
login();

 $connection->close();

?>