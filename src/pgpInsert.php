<?php
$userAddy = $_GET['userAddy'];
$tempKey = $_GET['tempKey'];
$servername = "localhost";
$username = "root";
$password = "";
$dataBase = "CapMarket";

// Create connection
$conn = new mysqli($servername, $username, $password,$dataBase);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
else{
  $sql = "INSERT INTO Users VALUES (";
  $sql = $sql."'$userAddy";
  $sql = $sql."',";
  $sql = $sql."'HTTP://";
  $sql = $sql."',";
  $sql = $sql."'$tempKey";
  $sql = $sql."' ," . "'0','0'" . ")";


  //$sql = $sql."'".$userAddy."'";

  $result = $conn->query($sql);
  
echo "PGPINSERTRAN";

}

?>