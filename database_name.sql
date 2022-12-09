-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: localhost    Database: quan_ly_nhan_khau
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `don_chuyen_khau`
--

DROP TABLE IF EXISTS `don_chuyen_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_chuyen_khau` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dai_dien_id` int unsigned NOT NULL,
  `ngay_chuyen` date NOT NULL,
  `so_ho_khau_cu` int unsigned NOT NULL,
  `so_ho_khau_moi` int unsigned NOT NULL,
  `ngay_lam_don` date NOT NULL,
  `ngay_phe_duyet` date DEFAULT NULL,
  `user_phe_duyet` int unsigned DEFAULT NULL,
  `trang_thai` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHO_PHE_DUYET',
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ly_do` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `don_chuyen_khau_FK` (`dai_dien_id`),
  KEY `don_chuyen_khau_FK_1` (`so_ho_khau_cu`),
  KEY `don_chuyen_khau_FK_2` (`so_ho_khau_moi`),
  KEY `don_chuyen_khau_FK_3` (`user_phe_duyet`),
  CONSTRAINT `don_chuyen_khau_FK` FOREIGN KEY (`dai_dien_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `don_chuyen_khau_FK_1` FOREIGN KEY (`so_ho_khau_cu`) REFERENCES `so_ho_khau` (`id`),
  CONSTRAINT `don_chuyen_khau_FK_3` FOREIGN KEY (`user_phe_duyet`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_chuyen_khau`
--

LOCK TABLES `don_chuyen_khau` WRITE;
/*!40000 ALTER TABLE `don_chuyen_khau` DISABLE KEYS */;
INSERT INTO `don_chuyen_khau` VALUES (3,1,'2022-12-12',39,345,'2022-12-10','2022-12-10',NULL,'PHE_DUYET','string','string');
/*!40000 ALTER TABLE `don_chuyen_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_chuyen_khau_nhan_khau`
--

DROP TABLE IF EXISTS `don_chuyen_khau_nhan_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_chuyen_khau_nhan_khau` (
  `don_chuyen_khau_id` int unsigned NOT NULL,
  `nhan_khau_id` int unsigned NOT NULL,
  `quan_he_chu_ho` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ghi_chu` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`don_chuyen_khau_id`,`nhan_khau_id`),
  KEY `don_chuyen_khau_nhan_khau_FK_1` (`nhan_khau_id`),
  CONSTRAINT `don_chuyen_khau_nhan_khau_FK` FOREIGN KEY (`don_chuyen_khau_id`) REFERENCES `don_chuyen_khau` (`id`),
  CONSTRAINT `don_chuyen_khau_nhan_khau_FK_1` FOREIGN KEY (`nhan_khau_id`) REFERENCES `nhan_khau` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_chuyen_khau_nhan_khau`
--

LOCK TABLES `don_chuyen_khau_nhan_khau` WRITE;
/*!40000 ALTER TABLE `don_chuyen_khau_nhan_khau` DISABLE KEYS */;
/*!40000 ALTER TABLE `don_chuyen_khau_nhan_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_dinh_chinh_do_ho_khau`
--

DROP TABLE IF EXISTS `don_dinh_chinh_do_ho_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_dinh_chinh_do_ho_khau` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `so_ho_khau_id` int unsigned NOT NULL,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `trang_thai` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay_lam_don` date NOT NULL,
  `ngay_phe_duyet` date DEFAULT NULL,
  `user_phe_duyet` int unsigned DEFAULT NULL,
  `mo_ta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `don_dinh_chinh_do_ho_khau_FK` (`so_ho_khau_id`),
  KEY `don_dinh_chinh_do_ho_khau_FK_1` (`user_phe_duyet`),
  CONSTRAINT `don_dinh_chinh_do_ho_khau_FK` FOREIGN KEY (`so_ho_khau_id`) REFERENCES `so_ho_khau` (`id`),
  CONSTRAINT `don_dinh_chinh_do_ho_khau_FK_1` FOREIGN KEY (`user_phe_duyet`) REFERENCES `don_dinh_chinh_nhan_khau` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_dinh_chinh_do_ho_khau`
--

LOCK TABLES `don_dinh_chinh_do_ho_khau` WRITE;
/*!40000 ALTER TABLE `don_dinh_chinh_do_ho_khau` DISABLE KEYS */;
/*!40000 ALTER TABLE `don_dinh_chinh_do_ho_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_dinh_chinh_nhan_khau`
--

DROP TABLE IF EXISTS `don_dinh_chinh_nhan_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_dinh_chinh_nhan_khau` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nhan_khau_id` int unsigned NOT NULL,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `trang_thai` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay_lam_don` date NOT NULL,
  `ngay_phe_duyet` date DEFAULT NULL,
  `user_phe_duyet` int unsigned DEFAULT NULL,
  `mo_ta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `don_dinh_chinh_nhan_khau_FK` (`nhan_khau_id`),
  KEY `don_dinh_chinh_nhan_khau_FK_1` (`user_phe_duyet`),
  CONSTRAINT `don_dinh_chinh_nhan_khau_FK` FOREIGN KEY (`nhan_khau_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `don_dinh_chinh_nhan_khau_FK_1` FOREIGN KEY (`user_phe_duyet`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_dinh_chinh_nhan_khau`
--

LOCK TABLES `don_dinh_chinh_nhan_khau` WRITE;
/*!40000 ALTER TABLE `don_dinh_chinh_nhan_khau` DISABLE KEYS */;
INSERT INTO `don_dinh_chinh_nhan_khau` VALUES (1,2,'string','PHE_DUYET','2018-02-12',NULL,NULL,'string'),(2,2,'string','PHE_DUYET','2018-02-12',NULL,NULL,'{\"thong_tin_cu\":{\"cccd\":\"1233\"},\"thong_tin_moi\":{\"cccd\":\"1111\"}}');
/*!40000 ALTER TABLE `don_dinh_chinh_nhan_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_nhap_khau`
--

DROP TABLE IF EXISTS `don_nhap_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_nhap_khau` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nhan_khau_id` int unsigned NOT NULL,
  `so_ho_khau_cu_id` int unsigned NOT NULL,
  `dia_chi_co_quan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay_lam_don` date NOT NULL,
  `ngay_phe_duyet` date DEFAULT NULL,
  `user_phe_duyet` int unsigned DEFAULT NULL,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `so_ho_khau_moi_id` int unsigned DEFAULT NULL,
  `ngay_chuyen` date NOT NULL,
  `ly_do` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `don_nhap_khau_FK` (`nhan_khau_id`),
  KEY `don_nhap_khau_FK_1` (`so_ho_khau_cu_id`),
  KEY `don_nhap_khau_FK_2` (`so_ho_khau_moi_id`),
  KEY `don_nhap_khau_FK_3` (`user_phe_duyet`),
  CONSTRAINT `don_nhap_khau_FK` FOREIGN KEY (`nhan_khau_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `don_nhap_khau_FK_1` FOREIGN KEY (`so_ho_khau_cu_id`) REFERENCES `so_ho_khau` (`id`),
  CONSTRAINT `don_nhap_khau_FK_2` FOREIGN KEY (`so_ho_khau_moi_id`) REFERENCES `so_ho_khau` (`id`),
  CONSTRAINT `don_nhap_khau_FK_3` FOREIGN KEY (`user_phe_duyet`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_nhap_khau`
--

LOCK TABLES `don_nhap_khau` WRITE;
/*!40000 ALTER TABLE `don_nhap_khau` DISABLE KEYS */;
/*!40000 ALTER TABLE `don_nhap_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_nhap_khau_nhap_cung`
--

DROP TABLE IF EXISTS `don_nhap_khau_nhap_cung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_nhap_khau_nhap_cung` (
  `nhan_khau_id` int unsigned NOT NULL,
  `don_nhap_khau_id` int unsigned NOT NULL,
  `quan_he_dai_dien` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`nhan_khau_id`,`don_nhap_khau_id`),
  KEY `don_nhap_khau_nhap_cung_FK_1` (`don_nhap_khau_id`),
  CONSTRAINT `don_nhap_khau_nhap_cung_FK` FOREIGN KEY (`nhan_khau_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `don_nhap_khau_nhap_cung_FK_1` FOREIGN KEY (`don_nhap_khau_id`) REFERENCES `don_nhap_khau` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_nhap_khau_nhap_cung`
--

LOCK TABLES `don_nhap_khau_nhap_cung` WRITE;
/*!40000 ALTER TABLE `don_nhap_khau_nhap_cung` DISABLE KEYS */;
/*!40000 ALTER TABLE `don_nhap_khau_nhap_cung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_tach_khau`
--

DROP TABLE IF EXISTS `don_tach_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_tach_khau` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `chu_ho_id` int unsigned NOT NULL,
  `so_ho_khau_cu` int unsigned NOT NULL,
  `so_ho_khau_moi` int unsigned DEFAULT NULL,
  `ngay_tach` date NOT NULL,
  `ly_do` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay_lam_don` date NOT NULL,
  `ngay_phe_duyet` date DEFAULT NULL,
  `user_phe_duyet` int unsigned DEFAULT NULL,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `trang_thai` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_chi_moi` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `don_tach_khau_FK` (`user_phe_duyet`),
  KEY `don_tach_khau_FK_1` (`chu_ho_id`),
  KEY `don_tach_khau_FK_2` (`so_ho_khau_cu`),
  KEY `don_tach_khau_FK_3` (`so_ho_khau_moi`),
  CONSTRAINT `don_tach_khau_FK` FOREIGN KEY (`user_phe_duyet`) REFERENCES `user` (`id`),
  CONSTRAINT `don_tach_khau_FK_1` FOREIGN KEY (`chu_ho_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `don_tach_khau_FK_2` FOREIGN KEY (`so_ho_khau_cu`) REFERENCES `so_ho_khau` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_tach_khau`
--

LOCK TABLES `don_tach_khau` WRITE;
/*!40000 ALTER TABLE `don_tach_khau` DISABLE KEYS */;
INSERT INTO `don_tach_khau` VALUES (6,2,41,51,'2022-01-01','string','2022-03-02',NULL,NULL,NULL,'string','string'),(7,2,41,52,'2022-01-01','string','2022-03-02',NULL,NULL,NULL,'string','string'),(8,2,41,53,'2022-01-01','string','2022-03-02',NULL,NULL,NULL,'string','string'),(9,2,41,NULL,'2022-01-01','string','2022-03-02','2022-12-09',2,'','PHE_DUYET','string'),(18,2,41,NULL,'2022-01-01','string','2022-03-02',NULL,NULL,NULL,'123e4r','string'),(19,2,41,39,'2022-01-01','string','2022-03-02','2022-12-09',2,'','PHE_DUYET','string');
/*!40000 ALTER TABLE `don_tach_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_tach_khau_tach_cung`
--

DROP TABLE IF EXISTS `don_tach_khau_tach_cung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_tach_khau_tach_cung` (
  `don_tach_khau_id` int unsigned NOT NULL,
  `nhan_khau_id` int unsigned NOT NULL,
  `quan_he` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`nhan_khau_id`,`don_tach_khau_id`),
  KEY `don_tach_khau_tach_cung_FK_1` (`don_tach_khau_id`),
  CONSTRAINT `don_tach_khau_tach_cung_FK` FOREIGN KEY (`nhan_khau_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `don_tach_khau_tach_cung_FK_1` FOREIGN KEY (`don_tach_khau_id`) REFERENCES `don_tach_khau` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_tach_khau_tach_cung`
--

LOCK TABLES `don_tach_khau_tach_cung` WRITE;
/*!40000 ALTER TABLE `don_tach_khau_tach_cung` DISABLE KEYS */;
INSERT INTO `don_tach_khau_tach_cung` VALUES (18,66,'con',NULL),(19,66,'con',NULL);
/*!40000 ALTER TABLE `don_tach_khau_tach_cung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_tam_tru`
--

DROP TABLE IF EXISTS `don_tam_tru`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_tam_tru` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nhan_khau_id` int unsigned NOT NULL,
  `ngay_lam_don` date NOT NULL,
  `ngay_tam_tru` date NOT NULL,
  `ly_do` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TAO MOI',
  `dia_chi_thuong_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_chi_tam_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_phe_duyet` int unsigned DEFAULT NULL,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ngay_phe_duyet` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `don_tam_tru_FK` (`nhan_khau_id`),
  KEY `don_tam_tru_FK_1` (`user_phe_duyet`),
  CONSTRAINT `don_tam_tru_FK` FOREIGN KEY (`nhan_khau_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `don_tam_tru_FK_1` FOREIGN KEY (`user_phe_duyet`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_tam_tru`
--

LOCK TABLES `don_tam_tru` WRITE;
/*!40000 ALTER TABLE `don_tam_tru` DISABLE KEYS */;
INSERT INTO `don_tam_tru` VALUES (1,29,'2022-02-02','2022-03-02','nguoi yeu','PHE_DUYET','ttes','tam tru de',2,'','2022-12-09'),(2,29,'2022-02-02','2022-03-02','nguoi yeu','TAO MOI','ttes','tam tru de',NULL,NULL,NULL),(3,29,'2022-02-02','2022-03-02','nguoi yeu','TAO MOI','ttes','tam tru de',NULL,NULL,NULL),(4,71,'2022-02-02','2022-03-02','nguoi yeu','PHE_DUYET','ttes','tam tru de',2,'','2022-12-09'),(5,71,'2022-02-02','2022-03-02','nguoi yeu','TAO MOI','ttes','tam tru de',NULL,NULL,NULL);
/*!40000 ALTER TABLE `don_tam_tru` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_tam_vang`
--

DROP TABLE IF EXISTS `don_tam_vang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_tam_vang` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nhan_khau_id` int unsigned NOT NULL,
  `ngay_lam_don` date NOT NULL,
  `ly_do` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_chi_tam_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TAO MOI',
  `so_ho_khau_id` int unsigned NOT NULL,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `user_phe_duyet` int unsigned DEFAULT NULL,
  `ngay_phe_duyet` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `don_tam_vang_FK` (`nhan_khau_id`),
  KEY `don_tam_vang_FK_1` (`so_ho_khau_id`),
  KEY `don_tam_vang_FK_2` (`user_phe_duyet`),
  CONSTRAINT `don_tam_vang_FK` FOREIGN KEY (`nhan_khau_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `don_tam_vang_FK_1` FOREIGN KEY (`so_ho_khau_id`) REFERENCES `so_ho_khau` (`id`),
  CONSTRAINT `don_tam_vang_FK_2` FOREIGN KEY (`user_phe_duyet`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_tam_vang`
--

LOCK TABLES `don_tam_vang` WRITE;
/*!40000 ALTER TABLE `don_tam_vang` DISABLE KEYS */;
INSERT INTO `don_tam_vang` VALUES (1,2,'2022-02-02','nguoi yeu','tuan','PHE_DUYET',41,'',2,'2022-12-09');
/*!40000 ALTER TABLE `don_tam_vang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `giay_khai_sinh`
--

DROP TABLE IF EXISTS `giay_khai_sinh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `giay_khai_sinh` (
  `nhan_khau_id` int unsigned NOT NULL,
  `bo_id` int unsigned DEFAULT NULL,
  `me_id` int unsigned DEFAULT NULL,
  `ngay_khai_sinh` date NOT NULL,
  `noi_dang_ki` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nguoi_khai_sinh` int unsigned NOT NULL,
  `quan_he` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ho_khau_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHO_DUYET',
  PRIMARY KEY (`nhan_khau_id`),
  KEY `giay_khai_sinh_FK_1` (`bo_id`),
  KEY `giay_khai_sinh_FK_2` (`me_id`),
  KEY `giay_khai_sinh_FK_3` (`nguoi_khai_sinh`),
  CONSTRAINT `giay_khai_sinh_FK` FOREIGN KEY (`nhan_khau_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `giay_khai_sinh_FK_1` FOREIGN KEY (`bo_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `giay_khai_sinh_FK_2` FOREIGN KEY (`me_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `giay_khai_sinh_FK_3` FOREIGN KEY (`nguoi_khai_sinh`) REFERENCES `nhan_khau` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giay_khai_sinh`
--

LOCK TABLES `giay_khai_sinh` WRITE;
/*!40000 ALTER TABLE `giay_khai_sinh` DISABLE KEYS */;
INSERT INTO `giay_khai_sinh` VALUES (65,1,2,'2002-02-02','string','string',1,'string','1','CHO_DUYET'),(66,1,2,'2002-02-02','string','string',1,'string','1','CHO_DUYET'),(70,1,2,'2002-02-02','string','string',1,'string','1','CHO_DUYET');
/*!40000 ALTER TABLE `giay_khai_sinh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `giay_khai_tu`
--

DROP TABLE IF EXISTS `giay_khai_tu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `giay_khai_tu` (
  `nhan_khau_id` int unsigned NOT NULL,
  `ngay_khai_tu` date NOT NULL,
  `ngay_lam_giay` date NOT NULL,
  `nguoi_lam_giay_id` int unsigned NOT NULL,
  `quan_he` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`nhan_khau_id`),
  KEY `giay_khai_tu_FK_1` (`nguoi_lam_giay_id`),
  CONSTRAINT `giay_khai_tu_FK` FOREIGN KEY (`nhan_khau_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `giay_khai_tu_FK_1` FOREIGN KEY (`nguoi_lam_giay_id`) REFERENCES `nhan_khau` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giay_khai_tu`
--

LOCK TABLES `giay_khai_tu` WRITE;
/*!40000 ALTER TABLE `giay_khai_tu` DISABLE KEYS */;
INSERT INTO `giay_khai_tu` VALUES (65,'2022-10-02','2022-10-02',1,'ke thu','string'),(66,'2022-10-02','2022-10-02',1,'ke thu','string');
/*!40000 ALTER TABLE `giay_khai_tu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoa_don_muon_thiet_bi`
--

DROP TABLE IF EXISTS `hoa_don_muon_thiet_bi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoa_don_muon_thiet_bi` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ngay_tao` date NOT NULL,
  `ngay_muon` date NOT NULL,
  `ngay_ban_giao` date NOT NULL,
  `nhan_khau_id` int unsigned NOT NULL,
  `user_thu_ngan` int unsigned DEFAULT NULL,
  `phuong_thuc` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hoa_don_muon_thiet_bi_FK` (`user_thu_ngan`),
  KEY `hoa_don_muon_thiet_bi_FK_1` (`nhan_khau_id`),
  CONSTRAINT `hoa_don_muon_thiet_bi_FK` FOREIGN KEY (`user_thu_ngan`) REFERENCES `user` (`id`),
  CONSTRAINT `hoa_don_muon_thiet_bi_FK_1` FOREIGN KEY (`nhan_khau_id`) REFERENCES `nhan_khau` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoa_don_muon_thiet_bi`
--

LOCK TABLES `hoa_don_muon_thiet_bi` WRITE;
/*!40000 ALTER TABLE `hoa_don_muon_thiet_bi` DISABLE KEYS */;
/*!40000 ALTER TABLE `hoa_don_muon_thiet_bi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoa_don_muon_thiet_bi_bao_gom`
--

DROP TABLE IF EXISTS `hoa_don_muon_thiet_bi_bao_gom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoa_don_muon_thiet_bi_bao_gom` (
  `hoa_don_muon_thiet_bi` int unsigned NOT NULL,
  `thiet_bi_id` int unsigned NOT NULL,
  `gia_tien` int NOT NULL,
  `trang_thai` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `den_bu` int DEFAULT NULL,
  `tinh_trang_truoc` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tinh_trang_sau` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`hoa_don_muon_thiet_bi`,`thiet_bi_id`),
  KEY `hoa_don_thiet_bi_bao_gom_FK` (`thiet_bi_id`),
  CONSTRAINT `hoa_don_thiet_bi_bao_gom_FK` FOREIGN KEY (`thiet_bi_id`) REFERENCES `thiet_bi` (`id`),
  CONSTRAINT `hoa_don_thiet_bi_bao_gom_FK_1` FOREIGN KEY (`hoa_don_muon_thiet_bi`) REFERENCES `hoa_don_muon_thiet_bi` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoa_don_muon_thiet_bi_bao_gom`
--

LOCK TABLES `hoa_don_muon_thiet_bi_bao_gom` WRITE;
/*!40000 ALTER TABLE `hoa_don_muon_thiet_bi_bao_gom` DISABLE KEYS */;
/*!40000 ALTER TABLE `hoa_don_muon_thiet_bi_bao_gom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_khau`
--

DROP TABLE IF EXISTS `nhan_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_khau` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cccd` decimal(12,0) DEFAULT NULL,
  `ho` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ten_dem` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ten` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_sinh` date NOT NULL,
  `bi_danh` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `noi_sinh` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `nguyen_quan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `dan_toc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ton_giao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `nghe_nhiep` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `noi_lam_viec` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cccd_ngay_cap` date DEFAULT NULL,
  `cccd_noi_cap` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `so_dien_thoai` decimal(12,0) DEFAULT NULL,
  `email` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `gioi_tinh` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_khau`
--

LOCK TABLES `nhan_khau` WRITE;
/*!40000 ALTER TABLE `nhan_khau` DISABLE KEYS */;
INSERT INTO `nhan_khau` VALUES (1,1233,'nguyen','minh ','tuan','2020-12-23',NULL,NULL,NULL,'jkinh','khong',NULL,NULL,NULL,NULL,NULL,NULL,0,1),(2,1111,'nguyen','minh','tuan','2022-03-02',NULL,NULL,NULL,'kinh','khong',NULL,NULL,NULL,NULL,NULL,NULL,0,1),(29,123,'nguyen','minh','tuan','2002-09-25',NULL,NULL,NULL,'kinh','khong',NULL,NULL,NULL,NULL,NULL,NULL,1,1),(50,324,'f','dfdsf','fdsf','2020-09-22','s',NULL,NULL,'kinh','khong',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL),(62,123,'string','string','string','2002-02-25','string','string','string','string','string','string','string','2002-09-02','string',123456,'string',1,NULL),(65,123,'string','string','string','2002-02-25','string','string','string','string','string','string','string','2002-09-02','string',123456,'string',0,NULL),(66,123,'string','string','string','2002-02-25','string','string','string','string','string','string','string','2002-09-02','string',123456,'string',0,NULL),(69,123,'string','string','string','2002-02-25','string','string','string','string','string','string','string','2002-09-02','string',123456,'string',1,NULL),(70,123,'string','string','string','2002-02-25','string','string','string','string','string','string','string','2002-09-02','string',123456,'string',1,NULL),(71,2509,'string','string','string','2002-02-25','string','string','string','string','string','string','string','2002-09-02','string',123456,'string',1,NULL);
/*!40000 ALTER TABLE `nhan_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_khau_so_ho_khau`
--

DROP TABLE IF EXISTS `nhan_khau_so_ho_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_khau_so_ho_khau` (
  `nhan_khau_id` int unsigned NOT NULL,
  `so_ho_khau_id` int unsigned NOT NULL,
  `quan_he_chu_ho` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`nhan_khau_id`),
  KEY `nhan_khau_so_ho_khau_FK_1` (`so_ho_khau_id`),
  CONSTRAINT `nhan_khau_so_ho_khau_FK` FOREIGN KEY (`nhan_khau_id`) REFERENCES `nhan_khau` (`id`),
  CONSTRAINT `nhan_khau_so_ho_khau_FK_1` FOREIGN KEY (`so_ho_khau_id`) REFERENCES `so_ho_khau` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_khau_so_ho_khau`
--

LOCK TABLES `nhan_khau_so_ho_khau` WRITE;
/*!40000 ALTER TABLE `nhan_khau_so_ho_khau` DISABLE KEYS */;
INSERT INTO `nhan_khau_so_ho_khau` VALUES (2,53,'Chủ hộ',NULL),(62,41,'Con',NULL),(65,41,'Con',NULL),(66,39,'con',NULL),(69,39,'vo',NULL),(70,41,'Con',NULL);
/*!40000 ALTER TABLE `nhan_khau_so_ho_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `so_ho_khau`
--

DROP TABLE IF EXISTS `so_ho_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `so_ho_khau` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dia_chi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `chu_ho_id` int unsigned NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `so_ho_khau_FK` (`chu_ho_id`),
  CONSTRAINT `so_ho_khau_FK` FOREIGN KEY (`chu_ho_id`) REFERENCES `nhan_khau` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `so_ho_khau`
--

LOCK TABLES `so_ho_khau` WRITE;
/*!40000 ALTER TABLE `so_ho_khau` DISABLE KEYS */;
INSERT INTO `so_ho_khau` VALUES (39,'fdsf',29,1),(41,'bach Khoa',1,1),(51,'string',2,1),(52,'string',2,1),(53,'string',2,1),(55,'test',2,1),(56,'test',2,1),(57,'test',2,1),(58,'test',2,1);
/*!40000 ALTER TABLE `so_ho_khau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thiet_bi`
--

DROP TABLE IF EXISTS `thiet_bi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thiet_bi` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ten` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tinh_trang` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `xuat_xu` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dac_diem_nhan_dang` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `thong_tin_them` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `loai_thiet_bi` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thiet_bi`
--

LOCK TABLES `thiet_bi` WRITE;
/*!40000 ALTER TABLE `thiet_bi` DISABLE KEYS */;
/*!40000 ALTER TABLE `thiet_bi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_phe_duyet` int unsigned DEFAULT NULL,
  `ngay_dang_ki` date NOT NULL DEFAULT (curdate()),
  `ngay_phe_duyet` date DEFAULT NULL,
  `trang_thai` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TAO_MOI',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `hash` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_UN` (`username`),
  KEY `user_FK` (`user_phe_duyet`),
  CONSTRAINT `user_FK` FOREIGN KEY (`user_phe_duyet`) REFERENCES `don_dinh_chinh_nhan_khau` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,NULL,'2022-12-06',NULL,'s','admin','admin','12345678'),(2,NULL,'2022-12-06',NULL,'PHE_DUYET','tuan','user','test');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-09  7:48:13
