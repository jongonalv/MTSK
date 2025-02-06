-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema MTSK_Version1
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema MTSK_Version1
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `MTSK_Version1` DEFAULT CHARACTER SET utf8 ;
USE `MTSK_Version1` ;

-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Producto` (
  `etiqueta` VARCHAR(10) NOT NULL,
  `fechaCompra` DATE NULL,
  `garantia` VARCHAR(45) NOT NULL,
  `empresa` VARCHAR(45) NULL,
  `marca` VARCHAR(45) NOT NULL,
  `modelo` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`etiqueta`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Proveedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Proveedor` (
  `ID_Proveedor` INT NOT NULL AUTO_INCREMENT,
  `nombreEmpresa` VARCHAR(45) NOT NULL,
  `NIF` VARCHAR(45) NULL,
  `telefono` VARCHAR(45) NULL,
  PRIMARY KEY (`ID_Proveedor`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Accesorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Accesorio` (
  `etiquetaAccesorio` VARCHAR(10) NOT NULL,
  `nombreProducto` VARCHAR(45) NOT NULL,
  `Stock` INT NOT NULL,
  `tipoConector` VARCHAR(45) NOT NULL,
  `longitud` VARCHAR(45) NULL,
  INDEX `fk_Accesorio_Producto1_idx` (`etiquetaAccesorio` ASC) VISIBLE,
  PRIMARY KEY (`etiquetaAccesorio`),
  CONSTRAINT `fk_Accesorio_Producto1`
    FOREIGN KEY (`etiquetaAccesorio`)
    REFERENCES `MTSK_Version1`.`Producto` (`etiqueta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Equipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Equipo` (
  `etiquetaEquipo` VARCHAR(10) NOT NULL,
  `tipo` VARCHAR(45) NOT NULL,
  `procesador` VARCHAR(45) NOT NULL,
  `discoDuro` VARCHAR(45) NOT NULL,
  `memoriaRAM` VARCHAR(45) NOT NULL,
  `sistemaOperativo` VARCHAR(45) NOT NULL,
  `numeroSerie` VARCHAR(45) NULL,
  `numeroPedido` VARCHAR(45) NULL,
  `backup` TINYINT NOT NULL,
  INDEX `fk_Equipo_Producto1_idx` (`etiquetaEquipo` ASC) VISIBLE,
  PRIMARY KEY (`etiquetaEquipo`),
  CONSTRAINT `fk_Equipo_Producto1`
    FOREIGN KEY (`etiquetaEquipo`)
    REFERENCES `MTSK_Version1`.`Producto` (`etiqueta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Usuario` (
  `Usuario` VARCHAR(20) NOT NULL,
  `Nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Usuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Monitor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Monitor` (
  `etiquetaMonitor` VARCHAR(10) NOT NULL,
  `Usuario` VARCHAR(20) NOT NULL,
  `tamaño` VARCHAR(45) NOT NULL,
  `numeroSerie` VARCHAR(45) NOT NULL,
  `numeroPedido` VARCHAR(45) NULL,
  INDEX `fk_Monitor_Producto1_idx` (`etiquetaMonitor` ASC) VISIBLE,
  PRIMARY KEY (`etiquetaMonitor`),
  INDEX `fk_Monitor_Usuario1_idx` (`Usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Monitor_Producto1`
    FOREIGN KEY (`etiquetaMonitor`)
    REFERENCES `MTSK_Version1`.`Producto` (`etiqueta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Monitor_Usuario1`
    FOREIGN KEY (`Usuario`)
    REFERENCES `MTSK_Version1`.`Usuario` (`Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Licencia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Licencia` (
  `etiquetaLicencia` VARCHAR(10) NOT NULL,
  `nombreLicencia` VARCHAR(45) NULL,
  `fechaInicio` DATE NOT NULL,
  `fechaFin` DATE NOT NULL,
  `numeroUsos` INT NULL,
  INDEX `fk_Licencia_Producto1_idx` (`etiquetaLicencia` ASC) VISIBLE,
  PRIMARY KEY (`etiquetaLicencia`),
  CONSTRAINT `fk_Licencia_Producto1`
    FOREIGN KEY (`etiquetaLicencia`)
    REFERENCES `MTSK_Version1`.`Producto` (`etiqueta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Impresora`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Impresora` (
  `etiquetaImpresora` VARCHAR(10) NOT NULL,
  `modelo` VARCHAR(45) NOT NULL,
  `numeroSerie` VARCHAR(45) NULL,
  `IP (o local)` VARCHAR(45) NULL,
  `MAC` VARCHAR(45) NULL,
  `tipologiaEquipo` VARCHAR(45) NOT NULL,
  `Empresa` VARCHAR(45) NULL,
  INDEX `fk_Impresora_Producto1_idx` (`etiquetaImpresora` ASC) VISIBLE,
  PRIMARY KEY (`etiquetaImpresora`),
  CONSTRAINT `fk_Impresora_Producto1`
    FOREIGN KEY (`etiquetaImpresora`)
    REFERENCES `MTSK_Version1`.`Producto` (`etiqueta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Proyector`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Proyector` (
  `etiquetaProyector` VARCHAR(10) NOT NULL,
  `modelo` VARCHAR(45) NOT NULL,
  `numeroSerie` VARCHAR(45) NULL,
  `adaptador` VARCHAR(45) NULL,
  `ubicación` VARCHAR(45) NOT NULL,
  INDEX `fk_Proyector_Producto1_idx` (`etiquetaProyector` ASC) VISIBLE,
  PRIMARY KEY (`etiquetaProyector`),
  CONSTRAINT `fk_Proyector_Producto1`
    FOREIGN KEY (`etiquetaProyector`)
    REFERENCES `MTSK_Version1`.`Producto` (`etiqueta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Movimiento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Movimiento` (
  `ID_Movimiento` INT NOT NULL AUTO_INCREMENT,
  `etiquetaProducto` CHAR(8) NOT NULL,
  `Usuario` VARCHAR(20) NOT NULL,
  `fecha` DATE NOT NULL,
  `tipoMovimiento` VARCHAR(45) NOT NULL,
  `Comentario` VARCHAR(300) NULL,
  PRIMARY KEY (`ID_Movimiento`),
  INDEX `fk_Movimiento_Producto1_idx` (`etiquetaProducto` ASC) VISIBLE,
  INDEX `fk_Movimiento_Usuario1_idx` (`Usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Movimiento_Producto1`
    FOREIGN KEY (`etiquetaProducto`)
    REFERENCES `MTSK_Version1`.`Producto` (`etiqueta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Movimiento_Usuario1`
    FOREIGN KEY (`Usuario`)
    REFERENCES `MTSK_Version1`.`Usuario` (`Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Alerta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Alerta` (
  `ID_Alerta` INT NOT NULL AUTO_INCREMENT,
  `etiquetaProducto` CHAR(8) NOT NULL,
  `Fecha` DATETIME NOT NULL,
  `Mensaje` VARCHAR(300) NULL,
  PRIMARY KEY (`ID_Alerta`),
  INDEX `fk_Alerta_Producto1_idx` (`etiquetaProducto` ASC) VISIBLE,
  CONSTRAINT `fk_Alerta_Producto1`
    FOREIGN KEY (`etiquetaProducto`)
    REFERENCES `MTSK_Version1`.`Producto` (`etiqueta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Producto_has_Proveedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Producto_has_Proveedor` (
  `Producto_Etiqueta` CHAR(8) NOT NULL,
  `Proveedor_ID_Proveedor` INT NOT NULL,
  PRIMARY KEY (`Producto_Etiqueta`, `Proveedor_ID_Proveedor`),
  INDEX `fk_Producto_has_Proveedor_Proveedor1_idx` (`Proveedor_ID_Proveedor` ASC) VISIBLE,
  INDEX `fk_Producto_has_Proveedor_Producto1_idx` (`Producto_Etiqueta` ASC) VISIBLE,
  CONSTRAINT `fk_Producto_has_Proveedor_Producto1`
    FOREIGN KEY (`Producto_Etiqueta`)
    REFERENCES `MTSK_Version1`.`Producto` (`etiqueta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Producto_has_Proveedor_Proveedor1`
    FOREIGN KEY (`Proveedor_ID_Proveedor`)
    REFERENCES `MTSK_Version1`.`Proveedor` (`ID_Proveedor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Historial_equipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Historial_equipo` (
  `ID_Historial` INT NOT NULL,
  `Desde` DATE NOT NULL,
  `Hasta` DATE NOT NULL,
  `Historial_equipocol` VARCHAR(45) NULL,
  `Equipo_Producto_Etiqueta` CHAR(8) NOT NULL,
  `Usuario_Usuario` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`ID_Historial`),
  INDEX `fk_Historial_equipo_Equipo1_idx` (`Equipo_Producto_Etiqueta` ASC) VISIBLE,
  INDEX `fk_Historial_equipo_Usuario1_idx` (`Usuario_Usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Historial_equipo_Equipo1`
    FOREIGN KEY (`Equipo_Producto_Etiqueta`)
    REFERENCES `MTSK_Version1`.`Equipo` (`etiquetaEquipo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Historial_equipo_Usuario1`
    FOREIGN KEY (`Usuario_Usuario`)
    REFERENCES `MTSK_Version1`.`Usuario` (`Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MTSK_Version1`.`Equipo_has_Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MTSK_Version1`.`Equipo_has_Usuario` (
  `etiquetaEquipo` CHAR(8) NOT NULL,
  `Usuario` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`etiquetaEquipo`, `Usuario`),
  INDEX `fk_Equipo_has_Usuario_Usuario1_idx` (`Usuario` ASC) VISIBLE,
  INDEX `fk_Equipo_has_Usuario_Equipo1_idx` (`etiquetaEquipo` ASC) VISIBLE,
  CONSTRAINT `fk_Equipo_has_Usuario_Equipo1`
    FOREIGN KEY (`etiquetaEquipo`)
    REFERENCES `MTSK_Version1`.`Equipo` (`etiquetaEquipo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Equipo_has_Usuario_Usuario1`
    FOREIGN KEY (`Usuario`)
    REFERENCES `MTSK_Version1`.`Usuario` (`Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
