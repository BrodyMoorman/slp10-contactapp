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
		$statement = $connection->prepare("INSERT INTO contacts (contact_number, contact_firstname, contact_lastname, contact_email, creator_id) VALUES (?, ?, ?, ?, ?)");
		$statement->bind_param("ssssi", $input["phone"], $input["firstName"], $input["lastName"], $input["email"], $input["id"]);
		$statement->execute();
		$result = $statement->get_result();

    sendResultInfoAsJson($result);
  
    $statement->close();
    $connection->close();
  }

?>