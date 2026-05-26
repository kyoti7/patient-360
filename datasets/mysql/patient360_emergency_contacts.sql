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
-- Table structure for table `emergency_contacts`
--

DROP TABLE IF EXISTS `emergency_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_contacts` (
  `ContactID` int NOT NULL AUTO_INCREMENT,
  `PatientID` varchar(10) DEFAULT NULL,
  `ContactName` varchar(100) DEFAULT NULL,
  `Relationship` varchar(50) DEFAULT NULL,
  `EContactNum` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ContactID`),
  UNIQUE KEY `EContactNum` (`EContactNum`),
  KEY `PatientID` (`PatientID`),
  CONSTRAINT `emergency_contacts_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patients` (`PatientID`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_contacts`
--

LOCK TABLES `emergency_contacts` WRITE;
/*!40000 ALTER TABLE `emergency_contacts` DISABLE KEYS */;
INSERT INTO `emergency_contacts` VALUES (1,'P001','John Johnson','Father','0917000001'),(2,'P002','Mary Williams','Mother','0917000002'),(3,'P003','Paul Davis','Brother','0917000003'),(4,'P004','Anna Miller','Sister','0917000004'),(5,'P005','Robert Wilson','Father','0917000005'),(6,'P006','Linda Garcia','Mother','0917000006'),(7,'P007','Carlos Martinez','Brother','0917000007'),(8,'P008','Emma Brown','Sister','0917000008'),(9,'P009','David Thompson','Father','0917000009'),(10,'P010','Sophia Roberts','Mother','0917000010'),(11,'P011','Kevin Hart Sr.','Father','0917000011'),(12,'P012','Laura Jones Sr.','Mother','0917000012'),(13,'P013','Dwight Scott','Friend','0917000013'),(14,'P014','Lisa Simone','Sister','0917000014'),(15,'P015','Henry Wilde','Father','0917000015'),(16,'P016','May Parker','Aunt','0917000016'),(17,'P017','Judy Fabray','Mother','0917000017'),(18,'P018','Chris Reid','Brother','0917000018'),(19,'P019','Christine Strange','Wife','0917000019'),(20,'P020','Jeff Richmond','Husband','0917000020'),(21,'P021','Julia Grant','Wife','0917000021'),(22,'P022','Cynthia Doom','Mother','0917000022'),(23,'P023','Vision Maximoff','Husband','0917000023'),(24,'P024','Moira Xavier','Friend','0917000024'),(25,'P025','Balon Greyjoy','Father','0917000025'),(26,'P026','Nora Grey','Mother','0917000026'),(27,'P027','Dutch Morgan','Guardian','0917000027'),(28,'P028','Charlie Swan','Father','0917000028'),(29,'P029','Katherine Pratt','Mother','0917000029'),(30,'P030','Louise Ridley','Mother','0917000030'),(32,'P031','John','Father','0635218656');
/*!40000 ALTER TABLE `emergency_contacts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-16 11:44:19
