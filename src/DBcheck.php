<?php
$userAddy = $_GET['userAddy'];
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
  $sql = "SELECT encKey FROM Users WHERE userAddy = ";
  $sql = $sql."'".$userAddy."'";

  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
      //echo  $row["userAddy"];
      if($row['encKey'] == ""){
        $dataArray[0] = 0;
      }
      else{
        $dataArray[0] = 1;
        $dataArray[1] = $row['encKey'];

        //echo 1;
      }

    }
  } else {
    //echo "0 results";
    $dataArray[0] = 2;
  }
  echo json_encode($dataArray);


}

?>