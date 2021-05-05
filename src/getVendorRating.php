<?php
$vendorAddy = $_GET['vendorAddy'];
$servername = "localhost";
$username = "root";
$password = "";
$dataBase = "CapMarket";

// Create connection
$conn = new mysqli($servername, $username, $password,$dataBase);
$dataArray = array();
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
else{
  $sql = "SELECT * FROM Users WHERE userAddy = ";
  $sql = $sql."'".$vendorAddy."'";

  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
      //echo  $row["userAddy"];
      $dataArray[0] = $row['ratingScore'];
      $dataArray[1] = $row['ratingScoreNegative'];
      $dataArray[2] = $row['pictureURL'];
      echo json_encode($dataArray);
      
    }
  } else {
    //echo "0 results";
  }


}

?>