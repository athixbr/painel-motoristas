<?php
	

	

		$servidor = "187.33.241.19:3306";
	$usuario = "coopergraos_pmcvmotoristas";
	$senha = "DgulKQ{;]19K";
	$dbname = "coopergraos_motoristas";

// Create connection
$conn = new mysqli($servidor, $usuario, $senha, $dbname);
// Check connection
if ($conn->connect_error) {
die("Connection failed: " . $conn->connect_error);
} 
?>




