use stgo;

 create table User (
     idUser int not null auto_increment,
     username varchar(45) unique,
     mail varchar(250) unique,
     pass varchar(250), 
     xp int,
     primary key(idUser));

 create table Journey (
     idJourney int not null auto_increment,
     color varchar(45),
     titleJourney varchar (250),
     primary key(idJourney));

 create table POI (
     idPOI int not null auto_increment,
     lon float, lat float,
     titlePOI varchar (100),
     descPOI varchar(250),
     primary key(idPOI));

 create table Activity (
     idActivity int not null auto_increment,
     title varchar(45),
     des varchar(250), 
     xpAmount int, 
     primary key(idActivity));

 create table Response (
     idResponse int not null auto_increment, 
     caption varchar(45), 
     valid bool, 
     primary key(idResponse));
     
 
 alter table POI
 add idJourney int;

 alter table Activity
 add idPOI int;
 
 alter table Response
 add idActivity int;


alter table POI
 add foreign key(idJourney) references Journey(idJourney);
 
alter table Activity
 add foreign key(idPOI) references POI(idPOI);

 alter table Response
 add foreign key(idActivity) references Activity(idActivity);