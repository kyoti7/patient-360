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
-- Table structure for table `visits`
--

DROP TABLE IF EXISTS `visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visits` (
  `VisitID` varchar(10) NOT NULL,
  `PatientID` varchar(10) DEFAULT NULL,
  `DocID` varchar(10) DEFAULT NULL,
  `ApptID` varchar(10) DEFAULT NULL,
  `VisitDate` datetime DEFAULT NULL,
  `VisitType` enum('Routine Checkup','Follow Up','Emergency','Consultation') DEFAULT NULL,
  `VisitStatus` enum('Ongoing','Completed') DEFAULT NULL,
  `RoomNum` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`VisitID`),
  KEY `PatientID` (`PatientID`),
  KEY `DocID` (`DocID`),
  KEY `ApptID` (`ApptID`),
  CONSTRAINT `visits_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patients` (`PatientID`),
  CONSTRAINT `visits_ibfk_2` FOREIGN KEY (`DocID`) REFERENCES `doctors` (`DocID`),
  CONSTRAINT `visits_ibfk_3` FOREIGN KEY (`ApptID`) REFERENCES `appointments` (`ApptID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visits`
--

LOCK TABLES `visits` WRITE;
/*!40000 ALTER TABLE `visits` DISABLE KEYS */;
INSERT INTO `visits` VALUES ('V001','P001','DOC01','A001','2026-05-01 09:30:00','Consultation','Completed','R101'),('V002','P002','DOC02','A002','2026-05-02 10:30:00','Routine Checkup','Ongoing','OPD'),('V003','P003','DOC03','A003','2026-05-03 11:30:00','Emergency','Completed','ER'),('V004','P004','DOC04','A004','2026-05-04 12:30:00','Consultation','Completed','R102'),('V005','P005','DOC05','A005','2026-05-05 13:30:00','Follow Up','Ongoing','OPD'),('V006','P006','DOC06','A006','2026-05-06 14:30:00','Consultation','Completed','R103'),('V007','P007','DOC07','A007','2026-05-07 15:30:00','Routine Checkup','Ongoing','OPD'),('V008','P008','DOC08','A008','2026-05-08 16:30:00','Consultation','Completed','R104'),('V009','P009','DOC09','A009','2026-05-09 09:30:00','Emergency','Completed','ER'),('V010','P010','DOC10','A010','2026-05-10 10:30:00','Consultation','Completed','R105'),('V011','P011','DOC11','A011','2026-05-11 11:30:00','Follow Up','Ongoing','OPD'),('V012','P012','DOC12','A012','2026-05-12 12:30:00','Consultation','Completed','R106'),('V013','P013','DOC13','A013','2026-05-13 13:30:00','Routine Checkup','Ongoing','OPD'),('V014','P014','DOC14','A014','2026-05-14 14:30:00','Consultation','Completed','R107'),('V015','P015','DOC15','A015','2026-05-15 15:30:00','Emergency','Completed','ER'),('V016','P016','DOC16','A016','2026-05-16 16:30:00','Consultation','Completed','R108'),('V017','P017','DOC17','A017','2026-05-17 09:30:00','Follow Up','Ongoing','OPD'),('V018','P018','DOC18','A018','2026-05-18 10:30:00','Consultation','Completed','R109'),('V019','P019','DOC19','A019','2026-05-19 11:30:00','Routine Checkup','Ongoing','OPD'),('V020','P020','DOC20','A020','2026-05-20 12:30:00','Consultation','Completed','R110'),('V021','P021','DOC21','A021','2026-05-21 13:30:00','Emergency','Completed','ER'),('V022','P022','DOC22','A022','2026-05-22 14:30:00','Consultation','Completed','R111'),('V023','P023','DOC23','A023','2026-05-23 15:30:00','Follow Up','Ongoing','OPD'),('V024','P024','DOC24','A024','2026-05-24 16:30:00','Consultation','Completed','R112'),('V025','P025','DOC25','A025','2026-05-25 09:30:00','Routine Checkup','Ongoing','OPD'),('V026','P026','DOC26','A026','2026-05-26 10:30:00','Consultation','Completed','R113'),('V027','P027','DOC27','A027','2026-05-27 11:30:00','Emergency','Completed','ER'),('V028','P028','DOC28','A028','2026-05-28 12:30:00','Consultation','Completed','R114'),('V029','P029','DOC29','A029','2026-05-29 13:30:00','Follow Up','Ongoing','OPD'),('V030','P030','DOC30','A030','2026-05-30 14:30:00','Consultation','Completed','R115'),('V031','P031','DOC031','APPT031','2026-05-15 12:45:03','Routine Checkup','Completed','RM092');
/*!40000 ALTER TABLE `visits` ENABLE KEYS */;
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
