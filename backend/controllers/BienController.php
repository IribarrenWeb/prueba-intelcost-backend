<?php

require_once '../config/db.php';
require_once '../models/bien.php';
require_once '../models/ciudad.php';
require_once '../models/tipo.php';
require_once '../helper.php';


class BienController
{
    public static function getFilterData(){
        $tipos = Tipo::all();
        $ciudades = Ciudad::all();

        $return = [
            'status'   => true,
            'tipos'    => $tipos,
            'ciudades' => $ciudades   
        ];

        echo json_encode($return);
        return;
    }

    public static function save(){
        if (isset($_POST['data'])) {

            $data = $_POST['data'];
            $bien = new Bien;
            $bien->setId($data['Id']);

            if(Helper::exist('bienes', $bien->getId())){
                $response = [
                    'status' => false,
                    'msg' => 'El Bien ya esta guardado!',
                    'title' => 'Ya lo guardaste!!',
                    'color' => 'warning'
                ];
            }else{

                $bien->setDireccion($data['Direccion']);
                $bien->setTelefono($data['Telefono']);
                $bien->setPrecio($data['Precio']);
                $bien->setCodigo_postal($data['Codigo_Postal']);
                $bien->setCiudad_id($data['Ciudad']);
                $bien->setTipo_id($data['Tipo']);
    
                if($bien->save())
                {
                    $response = [
                        'status' => true,
                        'msg' => 'El Bien se ha guardado con exito.',
                        'title' => 'Guardado!!',
                        'color' => 'success'
                    ];
                }else{
                    $response = [
                        'status' => false,
                        'msg' => 'Ha ocurrido un error al guardar el Bien.',
                        'title' => 'Ups, algo salio mal :(',
                        'color' => 'error'
                    ];
                }
            
            }

        }else{

            $response = [
                'status' => false,
                'msg' => 'No se han recibido los datos correctamente.',
                'title' => 'Ups! Hay un problema con los datos.',
                'color' => 'error'
            ];

        }


        echo json_encode($response);
        return;
    }

    public static function mySavedData(){

        $bienes = new Bien;
        $bienes = $bienes->saved();
        
        $response = [ 
            'status' => true,
            'bienes' => $bienes
        ];

        echo json_encode($response);
        return;
    }

    public static function delete(){

        if(isset($_POST['id']) && !empty($_POST['id'])){

            $bien = new Bien;

            $bien->setId($_POST['id']);

            if($bien->exist()){

                $bien->deleted();
                $response = [
                    'status' => true,
                    'msg'   => 'El bien ha sido eliminado correctamente',
                    'title' => 'Eliminado',
                    'color' => 'success'
                ];
            
            }else{
                
                $response = [
                    'status' => false,
                    'msg'   => 'El bien que intentas eliminar no esta registrado en la base de datos.',
                    'title' => 'Ups!',
                    'color' => 'warning'
                ];

            }

        }else{

            $response = [
                'status' => false,
                'msg' => 'No se han recibido los datos correctamente.',
                'title' => 'Ups! Hay un problema con los datos.',
                'color' => 'error'
            ];

        }

        echo json_encode($response);
        return;

    }

    public static function filterReport(){
        
        $bien = new Bien;
        
        if(@!empty($_REQUEST['tipo_id']) || @!empty($_REQUEST['ciudad_id'])){

            $tipo_id   = !empty($_REQUEST['tipo_id']) ? trim($_REQUEST['tipo_id']) : null;
            $ciudad_id = !empty($_REQUEST['ciudad_id']) ? trim($_REQUEST['ciudad_id']) : null;

            if(Helper::exist('tipos_casa', $tipo_id) || 
                Helper::exist('ciudades', $ciudad_id)){
                
               
                $bien->setTipo_id($tipo_id, true);
                $bien->setCiudad_id($ciudad_id, true);
                
            }else{

                $responseText = 'Algunos de los valores enviados son incorrectos.';

            }


        }

        if($bienes = $bien->filterReport()){

            $bien->emitReport($bienes);

        }else{

            $responseText = 'No se encontraron bienes que coincidan o no ha guardado ningun bien'; 

        }

        echo isset($responseText) ? $responseText : '';
        return;

    }

}

if (isset($_REQUEST['option']) &&  method_exists(new BienController, $_REQUEST['option'])) {

    $method = $_REQUEST['option'];

    BienController::$method();

}else{
    echo 'El metodo no existe';
}