
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
  $value = '{"err": ""}';
  
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
    $statement = $connection->prepare("SELECT email, password FROM users WHERE email=? AND password =?");
    $statement->bind_param("ss", $input["login"], $input["password"]);
    $statement->execute();
    $result = $statement->get_result();

    if($row = $result->fetch_assoc())
    {
      $value = '{"error": "User Already Exists"}';
      sendResultInfoAsJson($value);
    }
    else
    {
      $statement = $connection->prepare("INSERT INTO users (email, password, first, last) VALUES (?, ?, ?, ?)");
      $statement->bind_param("ssss", $input["login"], $input["password"], $input["firstName"], $input["lastName"]);
      $statement->execute();

      sendResultInfoAsJson($value);
    }
    
    $statement->close();
    $connection->close();
  }

?>
