-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: localhost    Database: test-db
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account_name` varchar(63) NOT NULL,
  `active_key` varchar(56) NOT NULL,
  `owner_key` varchar(56) NOT NULL,
  `memo_key` varchar(56) NOT NULL,
  `member_since` datetime NOT NULL,
  `membership_expiration` datetime DEFAULT NULL,
  `lifetime_fees_paid` decimal(10,5) DEFAULT NULL,
  `pending_fees` decimal(10,5) DEFAULT NULL,
  `network_fees_paid` decimal(10,5) DEFAULT NULL,
  `registrar` varchar(15) DEFAULT NULL,
  `referrer` varchar(15) DEFAULT NULL,
  `account_id` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_name_UNIQUE` (`account_name`),
  FULLTEXT KEY `account_fulltext` (`account_name`),
  FULLTEXT KEY `account_id_fulltext` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16592 DEFAULT CHARSET=latin1 COMMENT='All accounts in the chain will be written here. We won''t be writing any momentary data like assets or history - we''ll pull those live from the chain when needed.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blocks`
--

DROP TABLE IF EXISTS `blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blocks` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `block_id` varchar(40) DEFAULT NULL,
  `block_number` bigint(20) unsigned NOT NULL,
  `transaction_count` int(11) DEFAULT '0',
  `operation_count` int(11) DEFAULT '0',
  `witness` varchar(15) NOT NULL,
  `signature` varchar(130) NOT NULL,
  `previous_block_hash` varchar(40) NOT NULL,
  `merkle_root` varchar(40) NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`,`block_number`)
) ENGINE=InnoDB AUTO_INCREMENT=29800364 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `committee`
--

DROP TABLE IF EXISTS `committee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `committee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `committee_id` varchar(45) NOT NULL,
  `committee_member_account` varchar(45) NOT NULL,
  `vote_id` varchar(45) DEFAULT NULL,
  `total_votes` bigint(9) DEFAULT NULL,
  `url` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `committee_id_UNIQUE` (`committee_id`),
  FULLTEXT KEY `committee_id_fulltext` (`committee_id`),
  FULLTEXT KEY `committee_fulltext` (`committee_member_account`)
) ENGINE=InnoDB AUTO_INCREMENT=2368 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contracts`
--

DROP TABLE IF EXISTS `contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object_id` varchar(20) DEFAULT NULL,
  `statistics_id` varchar(20) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `suicided` tinyint(1) DEFAULT NULL,
  `balances` json DEFAULT NULL,
  `statistics` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `object_id_UNIQUE` (`object_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `operations`
--

DROP TABLE IF EXISTS `operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operations` (
  `id` int(10) unsigned NOT NULL,
  `friendly_name` varchar(200) NOT NULL,
  `friendly_description` varchar(200) DEFAULT NULL,
  `current_fees` json DEFAULT NULL,
  `is_hidden` tinyint(4) DEFAULT NULL,
  `internal_comments` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `friendly_name_UNIQUE` (`friendly_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='A lookup table for operations, so we can give then names (and formats) rather than relying on the numeric int and a generic structure';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resources` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL DEFAULT 'www.example.com',
  `description` varchar(300) NOT NULL DEFAULT 'No Description Available',
  `category` varchar(50) DEFAULT 'Resources',
  PRIMARY KEY (`id`),
  UNIQUE KEY `url_UNIQUE` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='The Useful Resources table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `parent_block` bigint(20) unsigned NOT NULL,
  `expiration` datetime DEFAULT NULL,
  `operations` json DEFAULT NULL,
  `operation_results` json DEFAULT NULL,
  `extensions` json DEFAULT NULL,
  `signatures` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transaction to block_idx` (`parent_block`)
) ENGINE=InnoDB AUTO_INCREMENT=3117825 DEFAULT CHARSET=latin1 COMMENT='All transactions will be parsed from blocks and written to this table, with the bulk of their data going in a JSON field which is itself independently searchable.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `variables`
--

DROP TABLE IF EXISTS `variables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variables` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `var_name` varchar(100) NOT NULL,
  `value` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `var_name_UNIQUE` (`var_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2054 DEFAULT CHARSET=latin1 COMMENT='The Variables Table is used to store one off information about the blockchain or the explorer. These can be configuration variables (default language), maintenance interval, next scheduled maintenance block, etc. Its a simple map meant to provide lookup for config values as needed. The value can be JSON though if we need something specific.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `witnesses`
--

DROP TABLE IF EXISTS `witnesses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `witnesses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` varchar(15) NOT NULL,
  `account_name` varchar(63) NOT NULL,
  `witness` varchar(15) NOT NULL,
  `witness_since` datetime DEFAULT NULL,
  `total_votes` decimal(19,3) DEFAULT NULL,
  `total_missed` bigint(20) unsigned DEFAULT NULL,
  `url` varchar(300) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_account_witness_idx` (`account_id`),
  FULLTEXT KEY `witness_fulltext` (`witness`),
  FULLTEXT KEY `witness_account_fulltext` (`account_name`),
  FULLTEXT KEY `witness_aid_fulltext` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=331 DEFAULT CHARSET=latin1 COMMENT='All witnesses, active and standby, will be recorded here with their current vote numbers. These are only updated during a maintenance block, so it makes sense to cache this data.';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-03-06 14:20:35
