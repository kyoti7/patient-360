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
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `PatientID` varchar(10) NOT NULL,
  `PatientName` varchar(100) NOT NULL,
  `BirthDate` date DEFAULT NULL,
  `Sex` enum('Male','Female') DEFAULT NULL,
  `BloodType` varchar(5) DEFAULT NULL,
  `ContactNumber` varchar(20) DEFAULT NULL,
  `PatientStatus` enum('Admitted','Discharged','Outpatient') DEFAULT NULL,
  `RoomNum` varchar(10) DEFAULT NULL,
  `RegistrationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PatientID`),
  UNIQUE KEY `ContactNumber` (`ContactNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES ('P001','Alice Johnson','1990-05-12','Female','O+','0911111111','Admitted','R101','2026-05-07 01:07:46'),('P002','Bob Williams','1985-11-20','Male','A-','0911111112','Outpatient',NULL,'2026-05-07 01:07:46'),('P003','Charlie Davis','1975-02-14','Male','B+','0911111113','Discharged',NULL,'2026-05-07 01:07:46'),('P004','Diana Miller','1998-09-30','Female','AB+','0911111114','Admitted','R102','2026-05-07 01:07:46'),('P005','Edward Wilson','1982-03-22','Male','O-','0911111115','Outpatient',NULL,'2026-05-07 01:07:46'),('P006','Fiona Garcia','1992-07-08','Female','A+','0911111116','Discharged',NULL,'2026-05-07 01:07:46'),('P007','George Martinez','1968-12-01','Male','B-','0911111117','Admitted','R103','2026-05-07 01:07:46'),('P008','Hannah Brown','2001-01-15','Female','O+','0911111118','Outpatient',NULL,'2026-05-07 01:07:46'),('P009','Ian Thompson','1979-06-25','Male','AB-','0911111119','Admitted','R104','2026-05-07 01:07:46'),('P010','Julia Roberts','1995-10-10','Female','A-','0911111120','Discharged',NULL,'2026-05-07 01:07:46'),('P011','Kevin Hart','1988-04-05','Male','O+','0911111121','Outpatient',NULL,'2026-05-07 01:07:46'),('P012','Laura Jones','1993-08-19','Female','B+','0911111122','Admitted','R105','2026-05-07 01:07:46'),('P013','Michael Scott','1970-03-15','Male','O+','0911111123','Discharged',NULL,'2026-05-07 01:07:46'),('P014','Nina Simone','1984-11-21','Female','A+','0911111124','Outpatient',NULL,'2026-05-07 01:07:46'),('P015','Oscar Wilde','1965-10-16','Male','B-','0911111125','Admitted','R106','2026-05-07 01:07:46'),('P016','Peter Parker','2004-08-10','Male','O-','0911111126','Outpatient',NULL,'2026-05-07 01:07:46'),('P017','Quinn Fabray','1996-02-14','Female','AB+','0911111127','Discharged',NULL,'2026-05-07 01:07:46'),('P018','Riley Reid','1991-07-09','Female','A-','0911111128','Admitted','R107','2026-05-07 01:07:46'),('P019','Steven Strange','1978-11-11','Male','B+','0911111129','Outpatient',NULL,'2026-05-07 01:07:46'),('P020','Tina Fey','1972-05-18','Female','O+','0911111130','Discharged',NULL,'2026-05-07 01:07:46'),('P021','Ulysses Grant','1960-04-27','Male','A+','0911111131','Admitted','R108','2026-05-07 01:07:46'),('P022','Victor Doom','1983-09-01','Male','AB-','0911111132','Outpatient',NULL,'2026-05-07 01:07:46'),('P023','Wanda Maximoff','1989-02-10','Female','O-','0911111133','Discharged',NULL,'2026-05-07 01:07:46'),('P024','Charles Xavier','1955-07-13','Male','A+','0911111134','Admitted','R109','2026-05-07 01:07:46'),('P025','Yara Greyjoy','1992-12-25','Female','B+','0911111135','Outpatient',NULL,'2026-05-07 01:07:46'),('P026','Zane Grey','1987-01-30','Male','O+','0911111136','Discharged',NULL,'2026-05-07 01:07:46'),('P027','Arthur Morgan','1863-05-05','Male','A-','0911111137','Admitted','R110','2026-05-07 01:07:46'),('P028','Bella Swan','1990-09-13','Female','O+','0911111138','Outpatient',NULL,'2026-05-07 01:07:46'),('P029','Chris Pratt','1979-06-21','Male','B-','0911111139','Discharged',NULL,'2026-05-07 01:07:46'),('P030','Daisy Ridley','1992-04-10','Female','AB+','0911111140','Admitted','R111','2026-05-07 01:07:46'),('P031','Anne','2026-05-15','Female','A','096541236','Discharged','RM092','2026-05-15 20:25:50');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-16 11:44:18
