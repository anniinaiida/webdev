-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 05, 2019 at 08:43 AM
-- Server version: 5.7.21
-- PHP Version: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `products`
--

-- --------------------------------------------------------

--
-- Table structure for table `asiakas`
--

DROP TABLE IF EXISTS `asiakas`;
CREATE TABLE IF NOT EXISTS `asiakas` (
  `AVAIN` int(11) NOT NULL AUTO_INCREMENT,
  `NIMI` varchar(50) CHARACTER SET latin1 NOT NULL,
  `OSOITE` varchar(50) CHARACTER SET latin1 NOT NULL,
  `POSTINRO` varchar(5) CHARACTER SET latin1 NOT NULL,
  `POSTITMP` varchar(50) CHARACTER SET latin1 NOT NULL,
  `LUONTIPVM` date NOT NULL,
  `ASTY_AVAIN` int(11) NOT NULL,
  PRIMARY KEY (`AVAIN`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Dumping data for table `asiakas`
--

INSERT INTO `asiakas` (`AVAIN`, `NIMI`, `OSOITE`, `POSTINRO`, `POSTITMP`, `LUONTIPVM`, `ASTY_AVAIN`) VALUES
(1, 'KALLE TAPPINEN', 'OPISTOTIE 2', '70100', 'KUOPIO', '2011-12-01', 1),
(2, 'VILLE VALLATON', 'MICROKATU 2', '70100', 'KUOPIO', '2011-12-03', 2),
(3, 'Kalle Östilä', 'Teku', '70100', 'Kuopio', '2018-09-22', 1),
(4, 'Keke Amstrong', 'Viasat', '00010', 'Tsadi', '2018-09-22', 2),
(7, 'Pasi Rautiainen', 'Viaplay', '89100', 'Rovaniemi', '2018-09-22', 1),
(8, 'mauri', 'Toivalantie 25', '7100', 'Siili', '2018-09-22', 2),
(11, 'Ã„mmÃ¤lÃ¤ Ã„ijÃ¤', 'Kotipolku 8', '71820', 'JOssain', '2018-09-25', 2),
(12, 'Ã„mmÃ¤lÃ¤ Ã„ijÃ¤', 'Kotipolku 8', '71820', 'JOssain', '2018-09-25', 2),
(13, 'Ämmälä', 'Kotipolku 8', '71820', 'JOssain', '2018-09-25', 2);

-- --------------------------------------------------------

--
-- Table structure for table `asiakastyyppi`
--

DROP TABLE IF EXISTS `asiakastyyppi`;
CREATE TABLE IF NOT EXISTS `asiakastyyppi` (
  `AVAIN` int(11) NOT NULL AUTO_INCREMENT,
  `LYHENNE` varchar(10) NOT NULL,
  `SELITE` varchar(50) NOT NULL,
  PRIMARY KEY (`AVAIN`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `asiakastyyppi`
--

INSERT INTO `asiakastyyppi` (`AVAIN`, `LYHENNE`, `SELITE`) VALUES
(1, 'YA', 'YRITYSASIAKAS'),
(2, 'KA', 'KULUTTAJA ASIAKAS');

-- --------------------------------------------------------

--
-- Table structure for table `tuote`
--

DROP TABLE IF EXISTS `tuote`;
CREATE TABLE IF NOT EXISTS `tuote` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `nimi` varchar(100) NOT NULL,
  `selite` varchar(100) NOT NULL,
  `tyyppi_id` int(11) NOT NULL,
  `ostopvm` date NOT NULL,
  `valmistaja` varchar(100) NOT NULL,
  `hinta` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tuote`
--

INSERT INTO `tuote` (`id`, `nimi`, `selite`, `tyyppi_id`, `ostopvm`, `valmistaja`, `hinta`) VALUES
(1, 'HS', 'Helwsingin Sanomat', 2, '2019-11-14', 'Sanoma Oy', 5),
(2, 'Tuntematon Sotilas', 'Oma kirja', 1, '2019-11-05', 'Kustanataja', 30);

-- --------------------------------------------------------

--
-- Table structure for table `tuotetyyppi`
--

DROP TABLE IF EXISTS `tuotetyyppi`;
CREATE TABLE IF NOT EXISTS `tuotetyyppi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nimi` varchar(100) NOT NULL,
  `selite` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tuotetyyppi`
--

INSERT INTO `tuotetyyppi` (`id`, `nimi`, `selite`) VALUES
(1, 'Kirja', 'joku kirja'),
(2, 'Lehti', 'Sanomalehti');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
