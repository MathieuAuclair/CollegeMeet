DROP DATABASE IF EXISTS MEETME;
CREATE DATABASE MEETME;
USE MEETME;

CREATE TABLE MEMBER
(
EMAIL NVARCHAR(30) NOT NULL PRIMARY KEY,
NAME CHAR(20) NOT NULL,
BIRTH TINYINT(2),
GENDER TINYINT(1),
IMGPROFILE NVARCHAR(200),
BIO NVARCHAR(200),
PASSWORD NVARCHAR(20) NOT NULL,
LASTMATCH DATE NOT NULL
);

CREATE OR REPLACE VIEW DAILYMATCH AS
SELECT EMAIL, NAME, BIO, IMGPROFILE, LASTMATCH
FROM MEMBER;

CREATE TABLE FRIEND
(
ID_MEMBER NVARCHAR(30) NOT NULL,
ID_FRIEND NVARCHAR(30) NOT NULL,
FOREIGN KEY (ID_MEMBER) REFERENCES MEMBER(EMAIL)
);

CREATE TABLE MESSAGE
(
ID_MEMBER NVARCHAR(30) NOT NULL,
ID_FRIEND NVARCHAR(30) NOT NULL,
CONTENT NVARCHAR(500) NOT NULL,
SENDER NVARCHAR(30) NOT NULL,
TIMESENT DATETIME NOT NULL,
FOREIGN KEY (ID_MEMBER) REFERENCES MEMBER(EMAIL)
);


/*
 linux command line to connect to DB:
	mysql -h 127.0.0.1 -P 3306 -u root -p MEETME

 linux command line to launch createDB.sql
	mysql -u root -p < createDB.sql
*/
