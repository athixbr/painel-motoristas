<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("conn.php");

$sql_tipo = "SELECT * FROM status ORDER BY id DESC LIMIT 30";
$resulta = $conn->query($sql_tipo);

$data = [];
if ($resulta->num_rows > 0) {
    while ($row = $resulta->fetch_assoc()) {
        $data[] = [
            'placa' => $row['placa'],
            'nome_moto' => $row['nome_moto'],
            'status' => $row['status']
        ];
    }
}
echo json_encode($data);
?>
