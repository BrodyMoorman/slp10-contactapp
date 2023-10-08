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
  function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

  $input = getRequestInfo();
  $serverName = "localhost";
  $dbUsername = "remotedbuser";
  $dbPassword = "vhzXN7ddr5NW9zU3eUJ4.";
  $dbName = "ContantManager";
  $searchResults = "";
  $searchCount = 0;
  $list = array();
  

  
  // Establish connection
  $connection = new mysqli($serverName, $dbUsername, $dbPassword, $dbName); 
  

  // Check connection
  if ($connection->connect_error)
  {
  echo "error";
    returnWithError($connection->connect_error);
  }
  else
  {

			$statement = $connection->prepare("SELECT * FROM contacts WHERE creator_id=?");
			$statement->bind_param("i", $input["id"]);
  	
		$statement->execute();
		$result = $statement->get_result();

    while($row = $result->fetch_assoc())
    {
      $data = new stdClass();
      $data->contactId=$row["contact_id"];
      $data->firstName=$row["contact_firstname"];
      $data->lastName=$row["contact_lastName"];
      $data->phone=$row["contact_number"];
      $data->email=$row["contact_email"];
      
      array_push($list, $data);
    }
    
    $statement->close();
    $connection->close();
    echo json_encode($list);
  }

?>
