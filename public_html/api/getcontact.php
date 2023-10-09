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

	function returnWithInfo($firstName, $lastName, $phone, $email, $id, $color)
	{
		$value = '{"firstName": "' . $firstName . '", "lastName": "' . $lastName . '", "phone": "' . $phone . '", "email": "' . $email . '", "id": "' . $id . '", "color": "' . $color . '"}';
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
		$statement = $connection->prepare("SELECT * FROM contacts WHERE contact_id = ?");
		$statement->bind_param("i", $input["id"]);
		$statement->execute();
		$result = $statement->get_result();

		if($row = $result->fetch_assoc())
		{
			returnWithInfo($row['contact_firstname'], $row['contact_lastname'], $row['contact_number'], $row['contact_email'], $row['contact_id'], $row['contact_color']);
		}
		else
		{
			returnWithError("No Records Found");
		}

		$statement->close();
		$connection->close();
	}

?>