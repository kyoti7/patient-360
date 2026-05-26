-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: patient360
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `DocID` varchar(10) NOT NULL,
  `DocName` varchar(100) NOT NULL,
  `DeptID` varchar(10) DEFAULT NULL,
  `DocContact_Num` varchar(20) DEFAULT NULL,
  `ConsultationFee` decimal(10,2) DEFAULT NULL,
  `AvailabilityStatus` enum('Available','Unavailable','On Leave') DEFAULT NULL,
  PRIMARY KEY (`DocID`),
  UNIQUE KEY `DocContact_Num` (`DocContact_Num`),
  KEY `DeptID` (`DeptID`),
  CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`DeptID`) REFERENCES `departments` (`DeptID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES ('DOC01','Dr. Smith','DEP001','0912000001',800.00,'Available'),('DOC02','Dr. Johnson','DEP002','0912000002',900.00,'Available'),('DOC03','Dr. Brown','DEP003','0912000003',750.00,'Available'),('DOC031','Keshi','DEP001','0929123519',980.00,'Unavailable'),('DOC04','Dr. Davis','DEP004','0912000004',600.00,'Available'),('DOC05','Dr. Wilson','DEP005','0912000005',1000.00,'Available'),('DOC06','Dr. Moore','DEP006','0912000006',1200.00,'Available'),('DOC07','Dr. Taylor','DEP007','0912000007',500.00,'Available'),('DOC08','Dr. Anderson','DEP008','0912000008',850.00,'Available'),('DOC09','Dr. Thomas','DEP009','0912000009',700.00,'Available'),('DOC10','Dr. Jackson','DEP010','0912000010',550.00,'Available'),('DOC11','Dr. White','DEP001','0912000011',800.00,'Available'),('DOC12','Dr. Harris','DEP002','0912000012',900.00,'On Leave'),('DOC13','Dr. Martin','DEP003','0912000013',750.00,'Available'),('DOC14','Dr. Thompson','DEP004','0912000014',600.00,'Available'),('DOC15','Dr. Garcia','DEP005','0912000015',1000.00,'Unavailable'),('DOC16','Dr. Martinez','DEP006','0912000016',1200.00,'Available'),('DOC17','Dr. Robinson','DEP007','0912000017',500.00,'Available'),('DOC18','Dr. Clark','DEP008','0912000018',850.00,'Available'),('DOC19','Dr. Rodriguez','DEP009','0912000019',700.00,'Available'),('DOC20','Dr. Lewis','DEP010','0912000020',550.00,'Available'),('DOC21','Dr. Lee','DEP001','0912000021',800.00,'On Leave'),('DOC22','Dr. Walker','DEP002','0912000022',900.00,'Available'),('DOC23','Dr. Lim','DEP003','0912000023',750.00,'Available'),('DOC24','Dr. Allen','DEP004','0912000024',600.00,'Available'),('DOC25','Dr. Daryl','DEP005','0912000025',1000.00,'Available'),('DOC26','Dr. King','DEP006','0912000026',1200.00,'Available'),('DOC27','Dr. Wright','DEP007','0912000027',500.00,'Available'),('DOC28','Dr. Scott','DEP008','0912000028',850.00,'Available'),('DOC29','Dr. Green','DEP009','0912000029',700.00,'Available'),('DOC30','Dr. Libosada','DEP010','0912000030',550.00,'Available');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-16 11:44:17
