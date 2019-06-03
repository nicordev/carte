<?php

class KeyManager {
	public $keys;

	// Fonctions statiques
	/**
	 * Ouvre un dossier et rempli un tableau associatif avec le contenu de chaque fichier
	 * @param $path chemin du dossier
	 * @return un tableau associatif contenant le contenu de chaque fichier du dossier ou false si le dossier est introuvable
	 */
	public static function readTheDir($path) {
		if ($dir = opendir($path)) {
			while (($file = readdir($dir)) !== false) {
				if ($file != '.' AND $file != '..') {
					$keys[$file] = self::readTheFile($path . '/' . $file);
				}
			}
        	closedir($dir);
			return $keys;
		} else {
			return false;
		}
	}

	/**
	 * Ouvre un fichier et rempli un tableau numéroté avec le contenu du fichier
	 * @param $path le chemin du fichier
	 * @return un tableau contenant le contenu du fichier ou false si il y a un problème
	 */
	public static function readTheFile($path) {
		$lines;
		$i = 0;
		if ($file = fopen($path, 'r')) {
			while (!feof($file)) {
		        $lines[$i] = fgets($file);
		        $i++;
		    }
		    fclose($file);
		    return $lines;
		} else {
			return false;
		}
	}

	// Constructeur
	public function __construct() {
		$this->keys = self::readTheDir('keys');
	}

	// Getter
	public function getKey($key) {
		if (isset($this->keys[$key])) {
			return $this->keys[$key];
		}
	}

	// Setter
	public function setKey($key, $value) {
		$this->keys[$key] = $value;
	}
}