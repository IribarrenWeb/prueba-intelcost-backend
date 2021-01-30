<?php

require_once '../config/db.php';

/**
 * Modelo Bien que extiende de la clase DataBase,
 * que almacena toda la logica que interactua directamente con la base de datos.
 */
class Bien extends DataBase
{
    // Inicializacion de los atributos del modelo
    private $id;
    private $ciudad_id;
    private $tipo_id;
    private $direccion;
    private $telefono;
    private $codigo_postal;
    private $precio;

    

    /**
     * Get the value of id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of ciudad_id
     */ 
    public function getCiudad_id()
    {
        return is_array($this->ciudad_id) ? trim($this->ciudad_id['id']) : trim($this->ciudad_id);
    }

    /**
     * Set the value of ciudad_id
     *
     * @return  self
     */ 
    public function setCiudad_id($ciudadIdName, $search = false)
    {
        // Verificar si la variable search se encuentra en true
        // lo que significa que lo que se esta recibiendo en un id 
        // directamente por lo cual no se necesita ejecutar el metodo setterIds,
        // que se ejecuta cuando lo que se recibe es un nombre.
        if (!$search) {
            $this->ciudad_id = $this->setterIds($ciudadIdName, 'ciudades');;
        }else{
            $this->ciudad_id = $ciudadIdName;
        }

        return $this;
    }

    /**
     * Get the value of tipo_id
     */ 
    public function getTipo_id()
    {
        return is_array($this->tipo_id) ? trim($this->tipo_id['id']) : trim($this->tipo_id);
    }

    /**
     * Set the value of tipo_id
     *
     * @return  self
     */ 
    public function setTipo_id($tipoIdName, $search = false)
    {
        // Verificar si la variable search se encuentra en true
        // lo que significa que lo que se esta recibiendo en un id 
        // directamente por lo cual no se necesita ejecutar el metodo setterIds,
        // que se ejecuta cuando lo que se recibe es un nombre.
        if(!$search){
            $this->tipo_id = $this->setterIds($tipoIdName, 'tipos_casa');
        }else{
            $this->tipo_id = $tipoIdName;
        }

        return $this;
    }

    /**
     * Get the value of direccion
     */ 
    public function getDireccion()
    {
        return $this->direccion;
    }

    /**
     * Set the value of direccion
     *
     * @return  self
     */ 
    public function setDireccion($direccion)
    {
        $this->direccion = $direccion;

        return $this;
    }

    /**
     * Get the value of telefono
     */ 
    public function getTelefono()
    {
        return $this->telefono;
    }

    /**
     * Set the value of telefono
     *
     * @return  self
     */ 
    public function setTelefono($telefono)
    {
        $this->telefono = $telefono;

        return $this;
    }

    /**
     * Get the value of codigo_postal
     */ 
    public function getCodigo_postal()
    {
        return $this->codigo_postal;
    }

    /**
     * Set the value of codigo_postal
     *
     * @return  self
     */ 
    public function setCodigo_postal($codigo_postal)
    {
        $this->codigo_postal = $codigo_postal;

        return $this;
    }

    /**
     * Get the value of precio
     */ 
    public function getPrecio()
    {
        return $this->precio;
    }

    /**
     * Set the value of precio
     *
     * @return  self
     */ 
    public function setPrecio($precio)
    {
        $this->precio = $precio;

        return $this;
    }


    /**
     * Funcion encargada de almacenar el la base de datos
     * el bien seleccionado.
     *
     * @return void
     */
    public function save(){

        // Sentencia sql con parametros protegidos
        $sql = 'INSERT INTO bienes (`id`, `ciudad_id`, `tipo_id`, `direccion`, `telefono`, `codigo_postal`, `precio`) 
                VALUES (:id, :ciudadId, :tipoId, :direccion, :telefono, :codigoPostal, :precio)';
        
        // conexion a la base de datos con PDO
        $db = self::connect();
        
        // Array utilizado para remplazar los parametros
        $data = [
            'id'           => $this->getId(),
            'ciudadId'     => $this->getCiudad_id(),
            'tipoId'       => $this->getTipo_id(),
            'direccion'    => $this->getDireccion(),
            'telefono'     => $this->getTelefono(),
            'codigoPostal' => $this->getCodigo_postal(),
            'precio'       => $this->getPrecio()
        ];

        // Preparacion y ejecucion de la sentencia
        $result = $db->prepare($sql)->execute($data);

        return $result;

    }


    /**
     * Funcion utilizada para settear los ids cuando el parametro que se tiene
     * es el nombre.
     *
     * @param string $tipoName
     * @param string $tableName
     * @return string
     */
    private function setterIds($tipoName, $tableName){

        $sql = "SELECT id FROM $tableName WHERE nombre = '$tipoName'";

        $db = self::connect();
        
        $query = $db->query($sql);

        $id = $query->fetch();

        return $id;
    
    }

    /**
     * Funcion utilizada para validar si el registro
     * ya existe en la base de datos
     *
     * @return boolean
     */
    public function exist(){

        $id = $this->getId();
        
        $sql = "SELECT id FROM bienes WHERE id = $id";

        $db = self::connect();
        
        $validate = $db->query($sql)->fetch();
        
        return $validate || $validate != null ? true : false;
    }


    /**
     * Funcion para obtener de la base de datos
     * todos los registros que se han guardado con sus respectivas relaciones
     *
     * @return object
     */
    public function saved(){

        $sql = 'SELECT b.id, b.direccion, c.nombre as ciudad, b.codigo_postal as codigo, b.telefono, t.nombre as tipo, '. 
            ' b.precio FROM bienes as b, ciudades as c, tipos_casa as t '.   
            'WHERE b.ciudad_id = c.id and b.tipo_id = t.id';

        $db = self::connect();

        $query = $db->query($sql);

        $bienes = $query->fetchAll();

        return $bienes;

    }


    /**
     * Funcion utilizada para eliminar un registro de la base de datos
     *
     * @return boolean
     */
    public function deleted(){

        $sql = "DELETE FROM bienes WHERE id = :id";
        
        $db = self::connect();

        $data = [
            'id' => $this->getId(),
        ];

        $result = $db->prepare($sql)->execute($data);

        return $result;

    }


    /**
     * Funcion utilizada para filtrar, validar y devolver todos los registros
     * de bienes que coincidan con los datos de busqueda.
     *
     * @return array
     */
    public function filterReport(){

        $tipoId   = $this->getTipo_id();
        $ciudadId = $this->getCiudad_id();

        $sql = "SELECT b.*, c.nombre as ciudad, t.nombre as tipo FROM bienes as b, ciudades as c, tipos_casa as t WHERE ";
        $sql .= "b.tipo_id = t.id AND b.ciudad_id = c.id";

        if(!empty($tipoId) || !empty($ciudadId)){
            
            $sql .= ' AND ';
            
            if($tipoId && $ciudadId){
    
                $sql .= "t.id = $tipoId AND c.id = $ciudadId";
            
            }elseif($tipoId){
            
                $sql .= "t.id = $tipoId";
            
            }else{
            
                $sql .= "c.id = $ciudadId";
            
            }
        }


        $db = self::connect();

        $query = $db->prepare($sql);

        $query->execute();

        $arrayBienes = $query->fetchAll();

        return COUNT($arrayBienes) >= 1 ? $arrayBienes : false;

    }

    /**
     * Funcion utilizada para emitir los reportes
     *
     * @param [type] $bienes
     * @return void
     */
    public function emitReport($bienes){

        $filename = 'reporte-bienes-intelcost.csv';

        require_once '../views/excel.php'; 

    }
}