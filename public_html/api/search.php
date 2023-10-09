<?php

	function getRequestInfo()
  {
    return json_decode(file_get_contents('php://input'), true);
  }

  function sendResultInfoAsJson($object)
  {
    
    echo json_encode($object);
  }

  $input = getRequestInfo();
  $serverName = "localhost";
  $dbUsername = "remotedbuser";
  $dbPassword = "vhzXN7ddr5NW9zU3eUJ4.";
  $dbName = "ContantManager";
  $list = array();
  
  // Establish connection
  $connection = new mysqli($serverName, $dbUsername, $dbPassword, $dbName); 
  
  // Check connection
  if ($connection->connect_error)
  {
    returnWithError($connection->connect_error);
  }
  else
  {
  	if ($input["query"] === "") // causes error
  	{
			// Prepare statement and execute query
			$statement = $connection->prepare("SELECT * FROM contacts WHERE creator_id=? ORDER BY contact_firstname");
			$statement->bind_param("i", $input["id"]);
  	}
  	else
  	{
			$statement = $connection->prepare("SELECT * FROM contacts WHERE creator_id=? AND (contact_firstname like ? OR contact_lastname like ? OR contact_number like ? OR contact_email like ?) ORDER BY contact_firstname");
      $query = "%" . $input["query"] . "%";
			$statement->bind_param("issss", $input["id"], $query, $query, $query, $query);
  	}
		$statement->execute();
		$result = $statement->get_result();

    while($row = $result->fetch_assoc())
    {
      $data = new stdClass();
      $data->contactId=$row["contact_id"];
      $data->firstName=$row["contact_firstname"];
      $data->lastName=$row["contact_lastname"];
      $data->date=$row["contact_date"];
      $data->phone=$row["contact_number"];
      $data->email=$row["contact_email"];
      $data->color=$row["contact_color"];
      
      array_push($list, $data);
    }

    sendResultInfoAsJson($list);
  
    $statement->close();
    $connection->close();
  }

?>
