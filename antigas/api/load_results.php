<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("conn.php");

$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 30;
$sql_tipo = "SELECT * FROM status ORDER BY id DESC LIMIT 6 OFFSET $offset";
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
