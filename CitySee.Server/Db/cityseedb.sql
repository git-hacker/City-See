/*
Navicat MySQL Data Transfer

Source Server         : citysee
Source Server Version : 50719
Source Host           : 192.168.50.145:3306
Source Database       : cityseedb

Target Server Type    : MYSQL
Target Server Version : 50719
File Encoding         : 65001

Date: 2018-01-14 19:22:34
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for aspnetroleclaims
-- ----------------------------
DROP TABLE IF EXISTS `aspnetroleclaims`;
CREATE TABLE `aspnetroleclaims` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ClaimType` longtext,
  `ClaimValue` longtext,
  `RoleId` varchar(127) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`),
  CONSTRAINT `aspnetroleclaims_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for aspnetroles
-- ----------------------------
DROP TABLE IF EXISTS `aspnetroles`;
CREATE TABLE `aspnetroles` (
  `Id` varchar(127) NOT NULL,
  `ConcurrencyStamp` longtext,
  `Name` varchar(256) DEFAULT NULL,
  `NormalizedName` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `RoleNameIndex` (`NormalizedName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for aspnetuserclaims
-- ----------------------------
DROP TABLE IF EXISTS `aspnetuserclaims`;
CREATE TABLE `aspnetuserclaims` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ClaimType` longtext,
  `ClaimValue` longtext,
  `UserId` varchar(127) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetUserClaims_UserId` (`UserId`),
  CONSTRAINT `aspnetuserclaims_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for aspnetuserlogins
-- ----------------------------
DROP TABLE IF EXISTS `aspnetuserlogins`;
CREATE TABLE `aspnetuserlogins` (
  `LoginProvider` varchar(127) NOT NULL,
  `ProviderKey` varchar(127) NOT NULL,
  `ProviderDisplayName` longtext,
  `UserId` varchar(127) NOT NULL,
  PRIMARY KEY (`LoginProvider`,`ProviderKey`),
  KEY `IX_AspNetUserLogins_UserId` (`UserId`),
  CONSTRAINT `aspnetuserlogins_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for aspnetuserroles
-- ----------------------------
DROP TABLE IF EXISTS `aspnetuserroles`;
CREATE TABLE `aspnetuserroles` (
  `UserId` varchar(127) NOT NULL,
  `RoleId` varchar(127) NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`),
  KEY `IX_AspNetUserRoles_RoleId` (`RoleId`),
  CONSTRAINT `aspnetuserroles_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `aspnetuserroles_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for aspnetusers
-- ----------------------------
DROP TABLE IF EXISTS `aspnetusers`;
CREATE TABLE `aspnetusers` (
  `Id` varchar(127) NOT NULL,
  `AccessFailedCount` int(11) NOT NULL,
  `ConcurrencyStamp` longtext,
  `Email` varchar(256) DEFAULT NULL,
  `EmailConfirmed` bit(1) NOT NULL,
  `LockoutEnabled` bit(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `NormalizedEmail` varchar(256) DEFAULT NULL,
  `NormalizedUserName` varchar(256) DEFAULT NULL,
  `PasswordHash` longtext,
  `PhoneNumber` longtext,
  `PhoneNumberConfirmed` bit(1) NOT NULL,
  `SecurityStamp` longtext,
  `TwoFactorEnabled` bit(1) NOT NULL,
  `UserName` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  KEY `EmailIndex` (`NormalizedEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for aspnetusertokens
-- ----------------------------
DROP TABLE IF EXISTS `aspnetusertokens`;
CREATE TABLE `aspnetusertokens` (
  `UserId` varchar(127) NOT NULL,
  `LoginProvider` varchar(127) NOT NULL,
  `Name` varchar(127) NOT NULL,
  `Value` longtext,
  PRIMARY KEY (`UserId`,`LoginProvider`,`Name`),
  CONSTRAINT `aspnetusertokens_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for buildings
-- ----------------------------
DROP TABLE IF EXISTS `buildings`;
CREATE TABLE `buildings` (
  `Id` varchar(127) NOT NULL,
  `BuildingName` varchar(255) NOT NULL,
  `Longitude` decimal(10,6) NOT NULL,
  `Latitude` decimal(10,6) NOT NULL,
  `Intro` text,
  `Icon` text,
  `CreateTime` datetime(6) NOT NULL,
  `CommentNum` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `Id` varchar(127) NOT NULL,
  `BuildingId` varchar(127) NOT NULL,
  `CustomerId` varchar(127) NOT NULL,
  `Content` text,
  `IsAnonymous` bit(1) NOT NULL,
  `CreateTime` datetime(6) NOT NULL,
  `ReplyNum` int(11) NOT NULL,
  `LikeNum` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for commentimages
-- ----------------------------
DROP TABLE IF EXISTS `commentimages`;
CREATE TABLE `commentimages` (
  `FileGuid` varchar(127) NOT NULL,
  `CommentId` varchar(127) NOT NULL,
  `From` varchar(255) DEFAULT NULL,
  `FileType` int(11) NOT NULL,
  `CreateTime` datetime(6) NOT NULL,
  PRIMARY KEY (`FileGuid`,`CommentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for commentreply
-- ----------------------------
DROP TABLE IF EXISTS `commentreply`;
CREATE TABLE `commentreply` (
  `Id` varchar(127) NOT NULL,
  `CommentId` varchar(127) NOT NULL,
  `CustomerId` varchar(127) NOT NULL,
  `Content` text,
  `ToCustomerId` varchar(127) NOT NULL,
  `IsAnonymous` bit(1) NOT NULL,
  `CreateTime` datetime(6) NOT NULL,
  `ParentId` varchar(127) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for fileinfos
-- ----------------------------
DROP TABLE IF EXISTS `fileinfos`;
CREATE TABLE `fileinfos` (
  `FileGuid` varchar(127) CHARACTER SET utf8mb4 NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Size` double NOT NULL,
  `Type` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
  `FileExt` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
  `Height` int(11) DEFAULT NULL,
  `Uri` varchar(1000) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Width` int(11) DEFAULT NULL,
  `Ext1` varchar(1000) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Ext2` varchar(1000) CHARACTER SET utf8mb4 DEFAULT NULL,
  PRIMARY KEY (`FileGuid`,`Type`,`FileExt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for givelike
-- ----------------------------
DROP TABLE IF EXISTS `givelike`;
CREATE TABLE `givelike` (
  `Id` varchar(127) NOT NULL,
  `CustomerId` varchar(127) NOT NULL,
  `CreateTime` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`,`CustomerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for openiddictapplications
-- ----------------------------
DROP TABLE IF EXISTS `openiddictapplications`;
CREATE TABLE `openiddictapplications` (
  `Id` varchar(127) NOT NULL,
  `ClientId` varchar(127) NOT NULL,
  `ClientSecret` longtext,
  `DisplayName` longtext,
  `PostLogoutRedirectUris` longtext,
  `RedirectUris` longtext,
  `Timestamp` tinyblob,
  `Type` longtext,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_OpenIddictApplications_ClientId` (`ClientId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for openiddictauthorizations
-- ----------------------------
DROP TABLE IF EXISTS `openiddictauthorizations`;
CREATE TABLE `openiddictauthorizations` (
  `Id` varchar(127) NOT NULL,
  `ApplicationId` varchar(127) DEFAULT NULL,
  `Scopes` longtext,
  `Status` longtext NOT NULL,
  `Subject` longtext NOT NULL,
  `Timestamp` tinyblob,
  `Type` longtext NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_OpenIddictAuthorizations_ApplicationId` (`ApplicationId`),
  CONSTRAINT `openiddictauthorizations_ibfk_1` FOREIGN KEY (`ApplicationId`) REFERENCES `openiddictapplications` (`Id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for openiddictscopes
-- ----------------------------
DROP TABLE IF EXISTS `openiddictscopes`;
CREATE TABLE `openiddictscopes` (
  `Id` varchar(127) NOT NULL,
  `Description` longtext,
  `Name` longtext NOT NULL,
  `Timestamp` tinyblob,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for openiddicttokens
-- ----------------------------
DROP TABLE IF EXISTS `openiddicttokens`;
CREATE TABLE `openiddicttokens` (
  `Id` varchar(127) NOT NULL,
  `ApplicationId` varchar(127) DEFAULT NULL,
  `AuthorizationId` varchar(127) DEFAULT NULL,
  `Ciphertext` longtext,
  `CreationDate` datetime(6) DEFAULT NULL,
  `ExpirationDate` datetime(6) DEFAULT NULL,
  `Hash` varchar(127) DEFAULT NULL,
  `Status` longtext,
  `Subject` longtext NOT NULL,
  `Type` longtext NOT NULL,
  `Timestamp` tinyblob,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_OpenIddictTokens_Hash` (`Hash`),
  KEY `IX_OpenIddictTokens_ApplicationId` (`ApplicationId`),
  KEY `IX_OpenIddictTokens_AuthorizationId` (`AuthorizationId`),
  CONSTRAINT `openiddicttokens_ibfk_1` FOREIGN KEY (`ApplicationId`) REFERENCES `openiddictapplications` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `openiddicttokens_ibfk_2` FOREIGN KEY (`AuthorizationId`) REFERENCES `openiddictauthorizations` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
