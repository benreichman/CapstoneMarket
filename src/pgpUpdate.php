<?php

    $newPGP = $_GET['newPGP1'];
    $currAccount = $_GET['currAcc'];


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
        $sql = "UPDATE Users SET encKey = ";
        $sql = $sql."'$newPGP";
        $sql = $sql."' WHERE userAddy = '";
        $sql = $sql.$currAccount."'";
        


        //$sql = $sql."'".$userAddy."'";

        $result = $conn->query($sql);
    
    //echo "PGPINSERTRAN";

    }
    




?>