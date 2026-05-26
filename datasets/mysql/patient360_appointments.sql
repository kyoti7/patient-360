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
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `ApptID` varchar(10) NOT NULL,
  `PatientID` varchar(10) DEFAULT NULL,
  `DocID` varchar(10) DEFAULT NULL,
  `ApptDate` datetime DEFAULT NULL,
  `ApptStatus` enum('Scheduled','Completed','Cancelled') DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ApptID`),
  KEY `PatientID` (`PatientID`),
  KEY `DocID` (`DocID`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patients` (`PatientID`),
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`DocID`) REFERENCES `doctors` (`DocID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES ('A001','P001','DOC01','2026-05-01 09:00:00','Completed','2026-05-07 01:07:55'),('A002','P002','DOC02','2026-05-02 10:00:00','Scheduled','2026-05-07 01:07:55'),('A003','P003','DOC03','2026-05-03 11:00:00','Cancelled','2026-05-07 01:07:55'),('A004','P004','DOC04','2026-05-04 12:00:00','Completed','2026-05-07 01:07:55'),('A005','P005','DOC05','2026-05-05 13:00:00','Scheduled','2026-05-07 01:07:55'),('A006','P006','DOC06','2026-05-06 14:00:00','Completed','2026-05-07 01:07:55'),('A007','P007','DOC07','2026-05-07 15:00:00','Scheduled','2026-05-07 01:07:55'),('A008','P008','DOC08','2026-05-08 16:00:00','Completed','2026-05-07 01:07:55'),('A009','P009','DOC09','2026-05-09 09:00:00','Scheduled','2026-05-07 01:07:55'),('A010','P010','DOC10','2026-05-10 10:00:00','Completed','2026-05-07 01:07:55'),('A011','P011','DOC11','2026-05-11 11:00:00','Scheduled','2026-05-07 01:07:55'),('A012','P012','DOC12','2026-05-12 12:00:00','Completed','2026-05-07 01:07:55'),('A013','P013','DOC13','2026-05-13 13:00:00','Scheduled','2026-05-07 01:07:55'),('A014','P014','DOC14','2026-05-14 14:00:00','Completed','2026-05-07 01:07:55'),('A015','P015','DOC15','2026-05-15 15:00:00','Scheduled','2026-05-07 01:07:55'),('A016','P016','DOC16','2026-05-16 16:00:00','Completed','2026-05-07 01:07:55'),('A017','P017','DOC17','2026-05-17 09:00:00','Scheduled','2026-05-07 01:07:55'),('A018','P018','DOC18','2026-05-18 10:00:00','Completed','2026-05-07 01:07:55'),('A019','P019','DOC19','2026-05-19 11:00:00','Scheduled','2026-05-07 01:07:55'),('A020','P020','DOC20','2026-05-20 12:00:00','Completed','2026-05-07 01:07:55'),('A021','P021','DOC21','2026-05-21 13:00:00','Scheduled','2026-05-07 01:07:55'),('A022','P022','DOC22','2026-05-22 14:00:00','Completed','2026-05-07 01:07:55'),('A023','P023','DOC23','2026-05-23 15:00:00','Scheduled','2026-05-07 01:07:55'),('A024','P024','DOC24','2026-05-24 16:00:00','Completed','2026-05-07 01:07:55'),('A025','P025','DOC25','2026-05-25 09:00:00','Scheduled','2026-05-07 01:07:55'),('A026','P026','DOC26','2026-05-26 10:00:00','Completed','2026-05-07 01:07:55'),('A027','P027','DOC27','2026-05-27 11:00:00','Scheduled','2026-05-07 01:07:55'),('A028','P028','DOC28','2026-05-28 12:00:00','Completed','2026-05-07 01:07:55'),('A029','P029','DOC29','2026-05-29 13:00:00','Scheduled','2026-05-07 01:07:55'),('A030','P030','DOC30','2026-05-30 14:00:00','Completed','2026-05-07 01:07:55'),('APPT031','P031','DOC031','2026-05-15 12:34:55','Cancelled','2026-05-15 20:37:43');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
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
