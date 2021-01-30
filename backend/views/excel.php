<?php

header("Content-Type: text/csv; charset-latin1");

header("Content-Disposition: attachment; filename=" . $filename);


$output = fopen('php://output', 'w');

fputcsv($output, array_values(['ID', 'DIRECCION', 'CODIGO', 'CIUDAD', 'TELEFONO', 'TIPO', 'PRECIO']),';', ' ');

foreach ($bienes as $bien) {
    fputcsv($output,array_values([
        $bien['id'],
        $bien['direccion'],
        $bien['codigo_postal'],
        $bien['ciudad'],
        $bien['telefono'],
        $bien['tipo'],
        $bien['precio']
    ]), ';', ' ');
}

?>

