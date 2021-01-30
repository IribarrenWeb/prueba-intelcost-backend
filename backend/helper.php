<?php


class Helper extends Database
{
    public static function exist(string $tableName, $id){
        $validate = false; 
        
        if($id != null){
            $sql = "SELECT id FROM $tableName WHERE id = $id";
    
            $db = self::connect();
            
            $validate = $db->query($sql)->fetch();
        }

        
        return $validate || $validate != null ? true : false;
    }
}