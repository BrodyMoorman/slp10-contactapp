
<?php

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($object)
	{
		header('Content-type: application/json');
		echo $object;
	}

	function returnWithError($error)
	{
		$value = '{"id": 0, "firstName": "", "lastName": "", "error": "' . $error . '"}';
		sendResultInfoAsJson($value);
	}

	function returnWithInfo($firstName, $lastName, $id)
	{
		$value = '{"id": ' . $id . ', "firstName": "' . $firstName . '", "lastName": "' . $lastName . '", "error": ""}';
		sendResultInfoAsJson($value);
	}

	$input = getRequestInfo();
  $serverName = "localhost";
  $dbUsername = "remotedbuser";
  $dbPassword = "vhzXN7ddr5NW9zU3eUJ4.";
  $dbName = "ContantManager";

	// Establish connection
	$connection = new mysqli($serverName, $dbUsername, $dbPassword, $dbName); 

	// Check connection
	if ($connection->connect_error)
	{
		returnWithError($connection->connect_error);
	}
	else
	{
		// Prepare statement and execute query
		$statement = $connection->prepare("SELECT user_id, first, last FROM users WHERE email=? AND password =?");
		$statement->bind_param("ss", $input["login"], $input["password"]);
		$statement->execute();
		$result = $statement->get_result();

		if($row = $result->fetch_assoc())
		{
			returnWithInfo($row['first'], $row['last'], $row['user_id']);
		}
		else
		{
			returnWithError("No Records Found");
		}

		$statement->close();
		$connection->close();
	}

?>
