
<p>Your email is <?php echo $_POST['email']; ?>
<br>



<?php
  function testFunction() {
   $data = array("fname"=>$_POST['fname'], "lname"=>$_POST['lname'],"victim"=>$_POST['victim'],"email"=>$_POST['email']);
   header("Content-Type: application/json");
   echo json_encode($data);
   return json_encode($data);
  }
	testFunction();
 echo "\nYour name is " . $_POST['fname'] . " " . $_POST['lname'] . ". You are a victim: " . $_POST['victim'] . ". And your email is " . $_POST['email'];
?>