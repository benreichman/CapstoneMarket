<?php

$userAddy = $_GET['userAddy'];

$servername = "localhost";
$username = "root";
$password = "";
$dataBase = "CapMarket";
$messageText = "";
// Create connection
$conn = new mysqli($servername, $username, $password,$dataBase);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
else{
  $sql = "SELECT * FROM MessagesReal WHERE Rec = '";
  $sql = $sql."$userAddy'";

  $result = $conn->query($sql);


  if ($result->num_rows > 0) {
    
    //There are results
    while($row = $result->fetch_assoc()) {
      //echo  $row["userAddy"];
      
        
        $messageText = $messageText.$row['Rec']. '|||||'.$row['Sender'].'|||||'.$row['Msg'].'|||||'.$row['dateAndTime'].'|||||'.$row['msgID'].'?!END??';


      

    }


    echo $messageText;
  } else {
    //0 results;
  }
  
//echo "PGPINSERTRAN";

}







?>