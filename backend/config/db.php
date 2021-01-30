<?php

class DataBase {
	protected static $conex;

	protected static function connect() {
		try{
		
			self::$conex = new PDO('mysql:host=localhost;dbname=intelcost_bienes', 'root', '');
		
		}catch(PDOException $e){

			printf($e->getMessage());
			die();
		
		}
		
		self::$conex->query("SET NAMES 'utf8'");
		
		return self::$conex;
	}

	protected static function die(){
		self::$conex = null;
	}
}