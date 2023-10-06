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
  	echo "hello";
    returnWithError($connection->connect_error);
  }
  else
  {
  	echo "hey";
  	if ($input["query"] === "") // causes error
  	{
  		echo "yos";
			// Prepare statement and execute query
			$statement = $connection->prepare("SELECT * FROM contacts WHERE creator_id=?");
			$statement->bind_param("i", $input["id"]);
  	}
  	else
  	{
			$statement = $connection->prepare("SELECT * FROM contacts WHERE creator_id=? AND (contact_firstname like ? OR contact_lastname like ? OR contact_email like ?");
			$statement->bind_param("isss", $input["id"], $input["query"], $input["query"], $input["query"]);
  	}
		$statement->execute();
		$result = $statement->get_result();

    sendResultInfoAsJson($result);
  
    $statement->close();
    $connection->close();
  }

?>
