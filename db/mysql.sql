-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: mtsk_version1
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accesorio`
--

DROP TABLE IF EXISTS `accesorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accesorio` (
  `etiquetaAccesorio` varchar(10) NOT NULL,
  `nombreProducto` varchar(45) NOT NULL,
  `stock` int NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `qr_code_token` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`etiquetaAccesorio`),
  UNIQUE KEY `qr_code_token_UNIQUE` (`qr_code_token`),
  KEY `fk_Accesorio_Producto1_idx` (`etiquetaAccesorio`),
  CONSTRAINT `fk_Accesorio_Producto1` FOREIGN KEY (`etiquetaAccesorio`) REFERENCES `producto` (`etiqueta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accesorio`
--

LOCK TABLES `accesorio` WRITE;
/*!40000 ALTER TABLE `accesorio` DISABLE KEYS */;
INSERT INTO `accesorio` VALUES ('ACA01','USB C --> USB',5,'USB C --> USB','7520e9c5f6f8748e'),('ACA02','USB HUB',5,'USB HUB','a0c8e951aa125a3c'),('ACA03','HDMI --> VGA',5,'HDMI --> VGA','45b3eca1d4d45bd4'),('ACA04','WIFI USB',10,'WIFI USB','aa2b3ad022babba9'),('ACA05','DP-->HDMI',10,'DP-->HDMI','621633c339230fc6'),('ACA06','USB-->RJ45',6,'USB-->RJ45','5efba6ed221c110c'),('ACA07','DP-->DVI',10,'DP-->DVI','05e81059052ae767'),('ACA08','RJ45 Hembra --> Hembra',5,'Para juntar 2 entre si','10448d8db3a7164c'),('ACC01','VGA',3,'VGA','5f858ee7dfef49d4'),('ACC02','DVI',10,'DVI','ce2beadbf8dd6887'),('ACC03','HDMI',10,'HDMI','e25e00f42f40e708'),('ACC04','DISPLAY PORT',10,'DISPLAY PORT','479d5c51d84a2efc'),('ACC05','DP-->HDMI',10,'DP-->HDMI','8f97469e6e7017b4'),('ACC06','HDMI-->DVI',10,'HDMI-->DVI','28d9b854cb504673'),('ACC07','POWER CORD',5,'POWER CORD','a8dfa790d9ce79fd'),('ACC08','IMPRESORA USB',10,'IMPRESORA USB','140a8c269735b237'),('ACC09','CABLE RED 0.5M',5,'CABLE RED 0.5M','673f98d873c78a43'),('ACC10','CABLE RED 1M',10,'CABLE RED 1M','132e4db2926be6b9'),('ACC11','CABLE RED 1.5M',7,'CABLE RED 1.5M','8d979cff1abc19cc'),('ACC12','CABLE RED 2M',10,'CABLE RED 2M','8dae271f59709c54'),('ACC13','CABLE RED 3M',10,'CABLE RED 3M','f5c5784aadb62a09'),('ACC14','CABLE RED 5M',10,'CABLE RED 5M','1306f902790e9e51'),('ACC15','CABLE RED 5M+',10,'CABLE RED 5M+','05df2d290bb6bc56'),('ACC16','CABLE AUDIO JACK',4,'CABLE AUDIO JACK','06e8dcf82b87b912'),('ACP01','Teclados',10,'Teclados','58dcd6c68fdeb458'),('ACP02','Ratones',10,'Ratones','6261a977a1779e52');
/*!40000 ALTER TABLE `accesorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alerta`
--

DROP TABLE IF EXISTS `alerta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alerta` (
  `ID_Alerta` int NOT NULL AUTO_INCREMENT,
  `etiquetaProducto` char(8) NOT NULL,
  `Fecha` datetime NOT NULL,
  `Mensaje` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`ID_Alerta`),
  KEY `fk_Alerta_Producto1_idx` (`etiquetaProducto`),
  CONSTRAINT `fk_Alerta_Producto1` FOREIGN KEY (`etiquetaProducto`) REFERENCES `producto` (`etiqueta`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alerta`
--

LOCK TABLES `alerta` WRITE;
/*!40000 ALTER TABLE `alerta` DISABLE KEYS */;
INSERT INTO `alerta` VALUES (54,'ACC01','2025-06-02 12:38:29','Atención: Quedan menos de 5 unidades de VGA (stock: 4).'),(55,'ACC01','2025-06-02 12:38:44','Atención: Quedan menos de 5 unidades de VGA (stock: 3).');
/*!40000 ALTER TABLE `alerta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipo`
--

DROP TABLE IF EXISTS `equipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipo` (
  `etiquetaEquipo` varchar(10) NOT NULL,
  `tipo` varchar(45) NOT NULL,
  `procesador` varchar(45) NOT NULL,
  `discoDuro` varchar(45) NOT NULL,
  `memoriaRAM` varchar(45) NOT NULL,
  `sistemaOperativo` varchar(45) NOT NULL,
  `numeroSerie` varchar(45) DEFAULT NULL,
  `numeroPedido` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`etiquetaEquipo`),
  KEY `fk_Equipo_Producto1_idx` (`etiquetaEquipo`),
  CONSTRAINT `fk_Equipo_Producto1` FOREIGN KEY (`etiquetaEquipo`) REFERENCES `producto` (`etiqueta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipo`
--

LOCK TABLES `equipo` WRITE;
/*!40000 ALTER TABLE `equipo` DISABLE KEYS */;
INSERT INTO `equipo` VALUES ('BH1447','SOBREMESA','Intel Core i5','SSD 1TB','24Gb','Windows 10','5CG8010VTN','ORD1400'),('BH1458','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','GK5NPG3','ORD1266'),('PAG001','PORTATIL','fewfewf','ewffew','16GB','Windows 11','58439435','weffewfwe'),('PAG002','PORTATIL','AXI','512Gb','16GB','Windows 10','65348432','egrgerger'),('PAG003','PORTATIL','Intel Core I7','512Gb','16GB','Windows 11','74632845','17384214'),('PAG004','PORTATIL','Intel Core i5','SSD 1TB','16GB','Windows 11','SER004SA','ORD1400'),('PAG019','PORTATIL','Intel Core i7','512GB SSD','16GB','Windows 11','SN123456789','NP987654321'),('PAG032','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','FYSGYD3','ORD1238'),('PAG036','PORTATIL','Intel Core i5','SSD 235Gb','8Gb','Windows 10','GK5NPG3','ORD1261'),('PAG037','PORTATIL','Intel Core i5','SSD 235Gb','8Gb','Windows 11','HRHPKS3','ORD1249'),('PAG047','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','CNU251D1BP','ORD1243'),('PAG049','PORTATIL','Intel Core i7','SSD 256 Gb','8Gb','Windows 11','GQFFFS3','ORD1245'),('PAG050','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','327Y203','ORD1236'),('PAG054','PORTATIL','Intel Pentium','SSD 256Gb','4Gb','Windows 10','GL98QG3','ORD1248'),('PAG059','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','5CG8020B87','ORD1250'),('PAG300','WORKSTATION','Intel Core i5','256gb','16GB','Windows 11','fewfwefwe','fwefwefwe'),('PBAG009','BACKUP','AMD Ryzen 5','SSD 512Gb','8Gb','Windows 11','SER006PA','ORD1267'),('PBHT005','BACKUP','Intel Core i3','HDD 2Tb','4Gb','Windows 10','SER005PB','ORD1266'),('PHT024','WORKSTATION','Intel Core i5','SSD 180Gb','4Gb','Windows 11','HS6BTT3','ORD1244'),('PHT027','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','5CG703253N','ORD1237'),('PHT029','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','DHLY3J3','ORD1254'),('PHT039','PORTATIL','Intel Core i5','SSD 256Gb','16Gb','Windows 11','HY7QZ94','ORD1236'),('PHT056','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','3N4RBL3','ORD1255'),('PHT059','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','20FMB63','ORD1256'),('PHT073','BACKUP','Intel Core i5','SSD 256Gb','8Gb','Windows 11','DPKMJS3','ORD1258'),('PHT081','PORTATIL','Intel Core i5','SSD 256Gb','16Gb','Windows 10','G49H0B4','ORD1253'),('PHT244','WORKSTATION','Intel Core i5','SSD 256Gb','16GB','Windows 11','5CG8010VTN','ORD1234'),('PROZ002','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','NXEFCER00164220B027620','ORD1247'),('PROZ003','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','CND8023RN','ORD1241'),('PVNPI004','PORTATIL','Intel Core i5','SSD 256Gb','8GB','Windows 10','H1MNGS3','ORD1257'),('PVNPI005','PORTATIL','Intel Core i5','SSD 256Gb','8Gb','Windows 10','FM0SK63','ORD1251'),('SAG012','SOBREMESA','Intel Core i5','SSD 512Gb','8Gb','Windows 11','SER002SA','ORD1263'),('SAG056','SOBREMESA','Intel Core i9','SSD 1Tb','32Gb','Windows 11','SER004SA','ORD1265'),('SHT001','SOBREMESA','Intel Core i7','HDD 1Tb','16Gb','Windows 10','SER001SH','ORD1262'),('SHT034','SOBREMESA','AMD Ryzen 7','SSD 256Gb','16Gb','Windows 10','SER003SH','ORD1264'),('WAG021','PORTATIL','Intel Core i5','SSD 256Gb','16Gb','Windows 11','62WNRV3','ORD1252'),('WAG022','WORKSTATION','AMD Threadripper','SSD 1Tb','64Gb','Windows 10','SER010WA','ORD1271'),('WAG032','PORTATIL','Intel Core i7','SSD 512Gb','16Gb','Windows 10','PB0H9G4','ORD1246'),('WAG034','PORTATIL','Intel Core i7','SSD 512Gb','16Gb','Windows 11','5CG831316T','ORD1259'),('WAG045','WORKSTATION','Intel Xeon','SSD 2Tb','64Gb','Windows 11','SER012WA','ORD1273'),('WBAG015','BACKUP','Intel Core i5','HDD 1Tb','8Gb','Windows 10','SER007WB','ORD1268'),('WBHT020','BACKUP','Intel Core i3','SSD 256Gb','4Gb','Windows 10','SER008WB','ORD1269'),('WHT008','PORTATIL','Intel Core i7','SSD 512Gb','16Gb','Windows 10','CZC0407V98','ORD1239'),('WHT009','WORKSTATION','Intel Messi','SSD 2Tb','32Gb','Windows 11','SER009WH','ORD1270'),('WHT010','PORTATIL','Intel Core i7','SSD 1Tb','8Gb','Windows 11','2WYNXL3','ORD1242'),('WHT030','WORKSTATION','Intel Core i9','HDD 4Tb','32Gb','Windows 10','SER011WH','ORD1272');
/*!40000 ALTER TABLE `equipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipo_has_usuario`
--

DROP TABLE IF EXISTS `equipo_has_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipo_has_usuario` (
  `etiquetaEquipo` char(8) NOT NULL,
  `Usuario` varchar(20) NOT NULL,
  PRIMARY KEY (`etiquetaEquipo`,`Usuario`),
  KEY `fk_Equipo_has_Usuario_Usuario1_idx` (`Usuario`),
  KEY `fk_Equipo_has_Usuario_Equipo1_idx` (`etiquetaEquipo`),
  CONSTRAINT `fk_Equipo_has_Usuario_Equipo1` FOREIGN KEY (`etiquetaEquipo`) REFERENCES `equipo` (`etiquetaEquipo`),
  CONSTRAINT `fk_Equipo_has_Usuario_Usuario1` FOREIGN KEY (`Usuario`) REFERENCES `usuario` (`Usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipo_has_usuario`
--

LOCK TABLES `equipo_has_usuario` WRITE;
/*!40000 ALTER TABLE `equipo_has_usuario` DISABLE KEYS */;
INSERT INTO `equipo_has_usuario` VALUES ('BH1458','cal05'),('PAG001','inf24'),('PAG002','cal01'),('PAG003','ROZ16'),('PAG047','per08'),('PAG049','Calibre'),('PAG050','cal06'),('PAG054','cal12'),('PAG059','cal01'),('PAG300','CAL14'),('PBAG009','SCANCAL'),('PBHT005','cal13'),('PHT024','CAL08'),('PHT027','ROZ16'),('PHT029','cal01'),('PHT039','Ander Gomez'),('PHT056','CAL16'),('PHT059','CAL15'),('PHT073','cal01'),('PHT081','CAL16'),('PHT244','INF55'),('PROZ002','cal05'),('PROZ003','cal11'),('PVNPI004','per08'),('PVNPI005','cal01'),('SAG012','cal06'),('SAG056','cal12'),('SHT001','CAL20'),('SHT034','SCANCAL'),('WAG021','cal13'),('WAG022','CAL08'),('WAG032','ROZ16'),('WAG034','cal05'),('WAG045','cal09'),('WBAG015','CAL16'),('WBHT020','CAL15'),('WHT008','CAL18'),('WHT009','cal01'),('WHT010','cal05'),('WHT030','cal11');
/*!40000 ALTER TABLE `equipo_has_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `impresora`
--

DROP TABLE IF EXISTS `impresora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `impresora` (
  `etiquetaImpresora` varchar(10) NOT NULL,
  `modelo` varchar(45) NOT NULL,
  `numeroSerie` varchar(45) DEFAULT NULL,
  `IP (o local)` varchar(45) DEFAULT NULL,
  `MAC` varchar(45) DEFAULT NULL,
  `tipologiaEquipo` varchar(45) NOT NULL,
  `Empresa` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`etiquetaImpresora`),
  KEY `fk_Impresora_Producto1_idx` (`etiquetaImpresora`),
  CONSTRAINT `fk_Impresora_Producto1` FOREIGN KEY (`etiquetaImpresora`) REFERENCES `producto` (`etiqueta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `impresora`
--

LOCK TABLES `impresora` WRITE;
/*!40000 ALTER TABLE `impresora` DISABLE KEYS */;
/*!40000 ALTER TABLE `impresora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licencia`
--

DROP TABLE IF EXISTS `licencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licencia` (
  `etiquetaLicencia` varchar(10) NOT NULL,
  `nombreLicencia` varchar(45) DEFAULT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `numeroUsos` int DEFAULT NULL,
  PRIMARY KEY (`etiquetaLicencia`),
  KEY `fk_Licencia_Producto1_idx` (`etiquetaLicencia`),
  CONSTRAINT `fk_Licencia_Producto1` FOREIGN KEY (`etiquetaLicencia`) REFERENCES `producto` (`etiqueta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licencia`
--

LOCK TABLES `licencia` WRITE;
/*!40000 ALTER TABLE `licencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `licencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monitor`
--

DROP TABLE IF EXISTS `monitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitor` (
  `etiquetaMonitor` varchar(10) NOT NULL,
  `Usuario` varchar(20) NOT NULL,
  `tamaño` varchar(45) NOT NULL,
  `numeroSerie` varchar(45) NOT NULL,
  `numeroPedido` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`etiquetaMonitor`),
  KEY `fk_Monitor_Producto1_idx` (`etiquetaMonitor`),
  KEY `fk_Monitor_Usuario1_idx` (`Usuario`),
  CONSTRAINT `fk_Monitor_Producto1` FOREIGN KEY (`etiquetaMonitor`) REFERENCES `producto` (`etiqueta`),
  CONSTRAINT `fk_Monitor_Usuario1` FOREIGN KEY (`Usuario`) REFERENCES `usuario` (`Usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitor`
--

LOCK TABLES `monitor` WRITE;
/*!40000 ALTER TABLE `monitor` DISABLE KEYS */;
/*!40000 ALTER TABLE `monitor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimiento`
--

DROP TABLE IF EXISTS `movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimiento` (
  `ID_Movimiento` int NOT NULL AUTO_INCREMENT,
  `etiquetaProducto` char(8) DEFAULT NULL,
  `Usuario` varchar(20) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `tipoMovimiento` varchar(45) NOT NULL,
  `Comentario` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`ID_Movimiento`),
  KEY `fk_Movimiento_Producto1_idx` (`etiquetaProducto`),
  KEY `fk_Movimiento_Usuario1_idx` (`Usuario`),
  CONSTRAINT `fk_Movimiento_Producto1` FOREIGN KEY (`etiquetaProducto`) REFERENCES `producto` (`etiqueta`),
  CONSTRAINT `fk_Movimiento_Usuario1` FOREIGN KEY (`Usuario`) REFERENCES `usuario` (`Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimiento`
--

LOCK TABLES `movimiento` WRITE;
/*!40000 ALTER TABLE `movimiento` DISABLE KEYS */;
INSERT INTO `movimiento` VALUES (22,NULL,NULL,'2025-05-21 11:46:33','Eliminar equipo','Se ha eliminado el equipo WBAG001'),(23,'PHT244','cal05','2025-05-21 11:53:14','Editar equipo','Se ha editado el equipo PHT244 (usuario asignado: cal05). Cambios: Procesador: \"Intel Core i7\" → \"Intel Core i5\"'),(24,NULL,'cal06','2025-05-21 15:57:03','Eliminar equipo','Se ha eliminado el equipo PHT001 (usuario asignado: cal06)'),(25,'PAG001',NULL,'2025-05-22 15:49:14','Alta equipo','Se ha agregado el equipo PAG001 (dewfewfew fewfewfew al inventario)'),(26,'PAG002',NULL,'2025-05-22 15:49:54','Alta equipo','Se ha agregado el equipo PAG002 (meowfmewofmewo fwemofmewome al inventario)'),(27,'PAG002',NULL,'2025-05-22 15:51:05','Editar equipo','Se ha editado el equipo PAG002. Cambios: Procesador: \"regreggre\" → \"AXI\"; Disco Duro: \"reggrerge\" → \"PUTO\"; N° Serie: \"gererggre\" → \"LOKO\"'),(28,'PAG002','CAL08','2025-05-22 15:51:14','Asignar usuario','Se ha asignado el equipo PAG002 a Iker Ugarte'),(29,'PAG002','CAL08','2025-05-22 15:55:50','Editar equipo','Se ha editado el equipo PAG002 (usuario asignado: CAL08). Cambios: Sin cambios relevantes'),(30,'PAG001',NULL,'2025-05-22 15:56:04','Editar equipo','Se ha editado el equipo PAG001. Cambios: Sin cambios relevantes'),(31,'PAG001',NULL,'2025-05-23 09:37:33','Editar equipo','Se ha editado el equipo PAG001. Cambios: N° Serie: \"fewfewew\" → \"58439435\"'),(32,'PAG002','CAL08','2025-05-23 09:54:45','Editar equipo','Se ha editado el equipo PAG002 (usuario asignado: CAL08). Cambios: SO: \"Windows 11\" → \"Windows 10\"'),(35,'PAG002','CAL08','2025-05-23 10:17:20','Editar equipo','Se ha editado el equipo PAG002 (usuario asignado: CAL08). Cambios: Sin cambios relevantes'),(36,'BH1458','cal05','2025-05-26 08:37:26','Asignar usuario','Se ha asignado el equipo BH1458 a Unai Aguirre'),(37,'PHT024','CAL08','2025-05-26 08:37:54','Editar equipo','Se ha editado el equipo PHT024 (usuario asignado: CAL08). Cambios: Tipo: \"PORTATIL\" → \"WORKSTATION\"'),(38,NULL,'cal09','2025-05-26 08:56:49','Eliminar equipo','Se ha eliminado el equipo PAG003 (usuario asignado: cal09)'),(39,'PAG001','inf24','2025-05-26 10:11:50','Asignar usuario','Se ha asignado el equipo PAG001 a Axier Probanza'),(40,'PHT039','Ander Gomez','2025-05-26 10:44:04','Asignar usuario','Se ha asignado el equipo PHT039 a INF33'),(43,NULL,'fewfewfew','2025-05-26 11:03:55','Alta usuario','Se ha agregado el usuario fewfewfew (fwefewewffwe) al inventario'),(44,NULL,'COM56','2025-05-26 12:52:41','Alta usuario','Se ha agregado el usuario COM56 (PLOROPLOPLO) al inventario'),(45,'PAG002','CAL08','2025-05-26 13:05:05','Editar equipo','Se ha editado el equipo PAG002 (usuario asignado: CAL08). Cambios: Disco Duro: \"PUTO\" → \"512Gb\"; N° Serie: \"LOKO\" → \"65348432\"'),(46,NULL,'INF67','2025-05-26 13:10:26','Alta usuario','Se ha agregado el usuario INF67 (Paco Pepe) al inventario'),(47,NULL,'inf674','2025-05-26 14:51:07','Alta usuario','Se ha agregado el usuario inf674 (Caisen XU) al inventario'),(48,'PHT244','INF55','2025-05-26 14:51:18','Asignar usuario','Se ha asignado el equipo PHT244 a Caisen XU'),(49,NULL,'inf99','2025-05-26 15:02:41','Alta usuario','Se ha agregado el usuario inf99 (Miguel Barinaga) al inventario'),(50,'PAG002','cal01','2025-05-28 09:22:31','Asignar usuario','Se ha asignado el equipo PAG002 a Larraitz Aizpurua'),(51,'PAG003',NULL,'2025-05-28 09:23:52','Alta equipo','Se ha agregado el equipo PAG003 (Dell Precision 990 al inventario)'),(52,'PAG003',NULL,'2025-05-28 11:52:40','Editar equipo','Se ha editado el equipo PAG003. Cambios: Procesador: \"Intel Core I5\" → \"Intel Core I7\"'),(53,NULL,'HTA43','2025-05-28 15:52:33','Alta usuario','Se ha agregado el usuario HTA43 (Beñat Gomez) al inventario'),(54,'PAG003','cal06','2025-05-29 09:36:34','Asignar usuario','Se ha asignado el equipo PAG003 a Calidad HT'),(55,NULL,'com045','2025-05-29 12:36:45','Alta usuario','Se ha agregado el usuario com045 (Beñat Gomez) al inventario'),(56,'PAG004',NULL,'2025-05-29 12:39:03','Alta equipo','Se ha agregado el equipo PAG004 (Dell Latitude 4450 al inventario)'),(57,'PAG003','ROZ16','2025-05-29 12:49:10','Asignar usuario','Se ha asignado el equipo PAG003 a Javier Ponce');
/*!40000 ALTER TABLE `movimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `etiqueta` varchar(10) NOT NULL,
  `fechaCompra` date DEFAULT NULL,
  `garantia` varchar(45) DEFAULT NULL,
  `empresa` varchar(45) DEFAULT NULL,
  `marca` varchar(45) DEFAULT NULL,
  `modelo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`etiqueta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES ('ACA01',NULL,NULL,NULL,NULL,NULL),('ACA02',NULL,NULL,NULL,NULL,NULL),('ACA03',NULL,NULL,NULL,NULL,NULL),('ACA04',NULL,NULL,NULL,NULL,NULL),('ACA05',NULL,NULL,NULL,NULL,NULL),('ACA06',NULL,NULL,NULL,NULL,NULL),('ACA07',NULL,NULL,NULL,NULL,NULL),('ACA08',NULL,NULL,NULL,NULL,NULL),('ACC01',NULL,NULL,NULL,NULL,NULL),('ACC02',NULL,NULL,NULL,NULL,NULL),('ACC03',NULL,NULL,NULL,NULL,NULL),('ACC04',NULL,NULL,NULL,NULL,NULL),('ACC05',NULL,NULL,NULL,NULL,NULL),('ACC06',NULL,NULL,NULL,NULL,NULL),('ACC07',NULL,NULL,NULL,NULL,NULL),('ACC08',NULL,NULL,NULL,NULL,NULL),('ACC09',NULL,NULL,NULL,NULL,NULL),('ACC10',NULL,NULL,NULL,NULL,NULL),('ACC11',NULL,NULL,NULL,NULL,NULL),('ACC12',NULL,NULL,NULL,NULL,NULL),('ACC13',NULL,NULL,NULL,NULL,NULL),('ACC14',NULL,NULL,NULL,NULL,NULL),('ACC15',NULL,NULL,NULL,NULL,NULL),('ACC16',NULL,NULL,NULL,NULL,NULL),('ACP01',NULL,NULL,NULL,NULL,NULL),('ACP02',NULL,NULL,NULL,NULL,NULL),('BH1447','2021-06-26','3 años','HT Legazpi','HP','EliteBook 840 G4'),('BH1458','2018-09-04','3 años','HT Legazpi','HP','Elitebook 830 G5'),('PAG001','2025-05-21','3','AG Legazpi','dell','latitude 4450'),('PAG002','2025-05-19','3','AG Legazpi','Dell','Latitude 5540'),('PAG003','2025-06-10','3','AG Legazpi','Dell','Precision 990'),('PAG004','2025-05-29','3','AG Legazpi','Dell','Latitude 4450'),('PAG019','2022-10-14','NA','AG Legazpi','HP','EliteBook 2540p'),('PAG032','2020-10-10','NA','AG Legazpi','HP','Elitebook 820 G3'),('PAG036','2022-01-17','3 años','AG Legazpi','DELL','LATITUDE 5520'),('PAG037','2021-03-18','3 años','AG Legazpi','DELL','LATITUDE 5520'),('PAG047','2023-02-02','3 años','AG Legazpi','DELL','Latitude 5530'),('PAG049','2023-03-28','3 años','AG Legazpi','DELL','Latitude 5430'),('PAG050','2021-10-14','3 años','AG Legazpi','DELL','Latitude 5520'),('PAG054',NULL,'NA','AG Rusia','Acer','EX2520G-P49C'),('PAG059','2023-09-11','3 años','AG Legazpi','DELL','Latitude 5540'),('PAG300','2025-02-20','3','HT Legazpi','Dell','Latitude 4450'),('PBAG009','2022-03-14','3','Agrisolutions','Dell','PowerEdge T40'),('PBHT005','2021-12-01','2','Agrisolutions','Asus','ExpertCenter D5'),('PHT024',NULL,'NA','HT Comercial','HP','Folio 9470m'),('PHT027','2020-12-22','3 años','HT Legazpi','DELL','LATITUDE 3410'),('PHT029','2021-05-19','3 años','HT Legazpi','DELL','LATITUDE 3410'),('PHT039','2024-06-12','3 años','HT Legazpi','DELL','LATITUDE 3510'),('PHT056','2022-03-14','3 años','HT Legazpi','DELL','LATITUDE 5420'),('PHT059','2022-06-07','3 años','HT Legazpi','DELL','LATITUDE 3320'),('PHT073','2023-06-26','3 años','HT Legazpi','DELL','Latitude 3520'),('PHT081','2023-10-18','3 años','HT Legazpi','DELL','Latitude 5440'),('PHT100','2025-02-06','3',NULL,'DELL','Latitude 8850'),('PHT101','2025-02-12','3','9','DELL','Latitude 5660'),('PHT102','2025-02-06','3','HT Legazpi','DELL','EliteBook 840 G4'),('PHT103','2025-02-12','3','HT Legazpi','EWEFEW','FWEFWEFWE'),('PHT110','2025-02-06','3','9','DELL','Latitude 8850'),('PHT244','2025-02-24','4','AG Legazpi','DELL','Veriton M'),('PROZ002','2020-10-15','2 años','AG Legazpi','Lenovo','ThinkPad T430'),('PROZ003','2023-04-24','3 años','AG Rozalma','DELL','Latitude 5530'),('PVNPI004','2021-02-23','3 años','VNPI','DELL','LATITUDE 3410'),('PVNPI005',NULL,'NA','VNPI','HP','EliteBook 840 G4'),('SAG012','2022-06-20','2','Herramientas','HP','EliteDesk 800 G6'),('SAG056','2020-11-13','5','Herramientas','Acer','Veriton M'),('SHT001','2023-01-15','3','Herramientas','Dell','Optiplex 7090'),('SHT034','2021-09-05','4','Herramientas','Lenovo','ThinkCentre M90a'),('WAG021','2020-11-25','3 años','AG Legazpi','DELL','Precision 3550'),('WAG022','2022-04-30','4','Herramientas','Dell','Precision 5820 Tower'),('WAG032','2023-05-31','3 años','AG Legazpi','DELL','Precision 3580'),('WAG034','2023-09-13','3 años','AG Legazpi','DELL','Precision 3580'),('WAG045','2020-09-27','6','Herramientas','Acer','ConceptD 500'),('WBAG015','2020-05-22','4','Agrisolutions','Synology','DiskStation DS920+'),('WBHT020','2023-07-09','1','Agrisolutions','QNAP','TS-453D'),('WHT008','2021-07-28','3 años','HT Legazpi','DELL','Precision 3551'),('WHT009','2023-08-19','5','Herramientas','HP','Z4 G4 Workstation'),('WHT010','2018-03-07','3 años','HT Legazpi','HP','Zbook 15 G4'),('WHT030','2021-02-18','3','Herramientas','Lenovo','ThinkStation P340');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_has_proveedor`
--

DROP TABLE IF EXISTS `producto_has_proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_has_proveedor` (
  `Producto_Etiqueta` char(8) NOT NULL,
  `Proveedor_ID_Proveedor` int NOT NULL,
  PRIMARY KEY (`Producto_Etiqueta`,`Proveedor_ID_Proveedor`),
  KEY `fk_Producto_has_Proveedor_Proveedor1_idx` (`Proveedor_ID_Proveedor`),
  KEY `fk_Producto_has_Proveedor_Producto1_idx` (`Producto_Etiqueta`),
  CONSTRAINT `fk_Producto_has_Proveedor_Producto1` FOREIGN KEY (`Producto_Etiqueta`) REFERENCES `producto` (`etiqueta`),
  CONSTRAINT `fk_Producto_has_Proveedor_Proveedor1` FOREIGN KEY (`Proveedor_ID_Proveedor`) REFERENCES `proveedor` (`ID_Proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_has_proveedor`
--

LOCK TABLES `producto_has_proveedor` WRITE;
/*!40000 ALTER TABLE `producto_has_proveedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `producto_has_proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedor` (
  `ID_Proveedor` int NOT NULL AUTO_INCREMENT,
  `nombreEmpresa` varchar(45) NOT NULL,
  `NIF` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID_Proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proyector`
--

DROP TABLE IF EXISTS `proyector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proyector` (
  `etiquetaProyector` varchar(10) NOT NULL,
  `modelo` varchar(45) NOT NULL,
  `numeroSerie` varchar(45) DEFAULT NULL,
  `adaptador` varchar(45) DEFAULT NULL,
  `ubicación` varchar(45) NOT NULL,
  PRIMARY KEY (`etiquetaProyector`),
  KEY `fk_Proyector_Producto1_idx` (`etiquetaProyector`),
  CONSTRAINT `fk_Proyector_Producto1` FOREIGN KEY (`etiquetaProyector`) REFERENCES `producto` (`etiqueta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proyector`
--

LOCK TABLES `proyector` WRITE;
/*!40000 ALTER TABLE `proyector` DISABLE KEYS */;
/*!40000 ALTER TABLE `proyector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `Usuario` varchar(20) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`Usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('Ander Gomez','INF33'),('cal01','Larraitz Aizpurua'),('cal05','Unai Aguirre'),('cal06','Calidad HT'),('CAL08','Iker Ugarte'),('cal09','Lidia Pinadero'),('cal11','Xabier Antxia'),('cal12','Calidad Portátil'),('cal13','Espectometro'),('CAL14','Montse Cartaña'),('CAL15','Microscopio'),('CAL16','Maquina ensayos UTM'),('CAL18','Mikel Ariztimuño'),('CAL20','Durometro Portatil durometro'),('Calibre','Calibre'),('com045','Beñat Gomez'),('COM56','PLOROPLOPLO'),('dasdsa','dsadsa'),('few','few'),('fewf','few'),('fewfewfew','fwefewewffwe'),('FWEFEW','EWFEWFEW'),('HTA43','Beñat Gomez'),('inf10','Jorge Aizpun'),('inf11','Anoni'),('inf24','Axier Probanza'),('INF34','Jon Gonzalez'),('INF45','DSADAS'),('INF55','Caisen XU'),('INF67','Paco Pepe'),('inf674','Caisen XU'),('inf99','Miguel Barinaga'),('per08','Aitor Patiño'),('ROZ16','Javier Ponce'),('SCANCAL','Escaner Calidad'),('wefgrwewe','wegweew');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-16 10:18:19
