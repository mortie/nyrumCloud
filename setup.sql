SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema {db}
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `{db}` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
USE `{db}` ;

-- -----------------------------------------------------
-- Table `{db}`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `{db}`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `passwordHash` VARCHAR(128) NOT NULL,
  `passwordSalt` VARCHAR(128) NOT NULL,
  `isAdmin` TINYINT(1) NOT NULL DEFAULT FALSE,
  `email` VARCHAR(256) NULL,
  UNIQUE (username),
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `{db}`.`directory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `{db}`.`directory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `parent_directory_id` INT NULL,
  `owner_user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_directory_directory1_idx` (`parent_directory_id` ASC),
  INDEX `fk_directory_user1_idx` (`owner_user_id` ASC),
  CONSTRAINT `fk_directory_directory1`
    FOREIGN KEY (`parent_directory_id`)
    REFERENCES `{db}`.`directory` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_directory_user1`
    FOREIGN KEY (`owner_user_id`)
    REFERENCES `{db}`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `{db}`.`file`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `{db}`.`file` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `parent_directory_id` INT NOT NULL,
  `content` LONGBLOB NOT NULL,
  `mimetype` VARCHAR(45) NOT NULL,
  `extension` VARCHAR(20) NOT NULL,
  `title` VARCHAR(256) NOT NULL,
  `owner_user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_file_directory_idx` (`parent_directory_id` ASC),
  INDEX `fk_file_user1_idx` (`owner_user_id` ASC),
  CONSTRAINT `fk_file_directory`
    FOREIGN KEY (`parent_directory_id`)
    REFERENCES `{db}`.`directory` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_file_user1`
    FOREIGN KEY (`owner_user_id`)
    REFERENCES `{db}`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
