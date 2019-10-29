-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Hôte : sansgodapf656.mysql.db
-- Généré le :  mar. 29 oct. 2019 à 16:38
-- Version du serveur :  5.6.39-log
-- Version de PHP :  5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `sansgodapf656`
--

-- --------------------------------------------------------

--
-- Structure de la table `hikes`
--

CREATE TABLE `hikes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `beginning` varchar(255) DEFAULT NULL,
  `distance` varchar(255) DEFAULT NULL,
  `info` text,
  `waypoints` text NOT NULL,
  `creationDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `hikes`
--

INSERT INTO `hikes` (`id`, `name`, `beginning`, `distance`, `info`, `waypoints`, `creationDate`) VALUES
(14, 'Parcours test', NULL, NULL, NULL, '[{\"lat\":47.737381053440195,\"lng\":6.686350949983307},{\"lat\":47.74084436008933,\"lng\":6.6948052727982486},{\"lat\":47.74150813422062,\"lng\":6.70025552151651},{\"lat\":47.74889565756318,\"lng\":6.698066838960358}]', '2018-10-19 22:44:44'),
(15, 'Balade Col de Bramont -&gt; Kastelberg -&gt; Batteriekopf', NULL, NULL, NULL, '[{\"lat\":48.0003,\"lng\":6.9456,\"alt\":956},{\"lat\":48.0044,\"lng\":6.9677,\"alt\":1029},{\"lat\":48.0096,\"lng\":6.9827,\"alt\":1304},{\"lat\":48.0213,\"lng\":7.0013,\"alt\":1350},{\"lat\":48.0006,\"lng\":6.981,\"alt\":1311},{\"lat\":47.9938,\"lng\":6.9807,\"alt\":1309}]', '2018-10-20 13:20:47'),
(16, 'Parcours test fichiers', NULL, NULL, NULL, '[{\"lat\":47.9688,\"lng\":6.4611,\"alt\":553,\"note\":\"Pylône \"},{\"lat\":47.9739,\"lng\":6.4521,\"alt\":547,\"note\":\"Croisement\"}]', '2018-10-20 17:29:54'),
(17, 'Etang de la Demoiselle', NULL, NULL, NULL, '[{\"lat\":47.9775,\"lng\":6.4637,\"alt\":564,\"note\":\"\"},{\"lat\":47.9815,\"lng\":6.4653,\"alt\":556,\"note\":\"\"},{\"lat\":47.9841,\"lng\":6.4761,\"alt\":538,\"note\":\"\"},{\"lat\":47.9863,\"lng\":6.4884,\"alt\":566,\"note\":\"\"},{\"lat\":47.9965,\"lng\":6.5096,\"alt\":592,\"note\":\"\"},{\"lat\":48.0023,\"lng\":6.5284,\"alt\":562,\"note\":\"\"},{\"lat\":48.0005,\"lng\":6.5312,\"alt\":577,\"note\":\"\"},{\"lat\":48.0005,\"lng\":6.5345,\"alt\":580,\"note\":\"\"},{\"lat\":48.0011,\"lng\":6.5357,\"alt\":586,\"note\":\"\"},{\"lat\":48.004,\"lng\":6.5402,\"alt\":574,\"note\":\"\"},{\"lat\":48.0022,\"lng\":6.543,\"alt\":548,\"note\":\"Etang atteint, demi-tour !\"}]', '2018-10-22 20:33:34'),
(18, 'Parcours 01', NULL, NULL, NULL, '[{\"lat\":43.6081,\"lng\":1.4882,\"alt\":139,\"note\":\"\"}]', '2018-10-24 10:00:03'),
(19, 'positions', NULL, NULL, NULL, '[{\"lat\":45.8065,\"lng\":4.8079,\"alt\":267,\"note\":\"\"},{\"lat\":45.7961,\"lng\":4.7813,\"alt\":306,\"note\":\"\"},{\"lat\":45.7738,\"lng\":4.7516,\"alt\":265,\"note\":\"\"},{\"lat\":45.7624,\"lng\":4.7767,\"alt\":219,\"note\":\"\"},{\"lat\":45.7673,\"lng\":4.8232,\"alt\":168,\"note\":\"\"},{\"lat\":45.7849,\"lng\":4.831,\"alt\":244,\"note\":\"\"},{\"lat\":45.7996,\"lng\":4.8526,\"alt\":249,\"note\":\"\"},{\"lat\":45.7662,\"lng\":4.8713,\"alt\":169,\"note\":\"\"},{\"lat\":45.7571,\"lng\":4.857,\"alt\":168,\"note\":\"\"},{\"lat\":45.7491,\"lng\":4.8057,\"alt\":294,\"note\":\"\"}]', '2018-11-23 16:22:50'),
(20, 'Test morilles', NULL, NULL, NULL, '[{\"lat\":47.9741,\"lng\":6.4659,\"alt\":545,\"note\":\"Morrilles\"}]', '2019-05-26 15:26:11'),
(21, 'Mariage', NULL, NULL, NULL, '[{\"lat\":47.4906,\"lng\":4.3323,\"alt\":285,\"note\":\"Eglise\"},{\"lat\":47.4903,\"lng\":4.3351,\"alt\":287,\"note\":\"Parking\"},{\"lat\":47.4901,\"lng\":4.3324,\"alt\":283,\"note\":\"Mairie\"}]', '2019-09-07 12:32:34'),
(22, 'Parcours n°', NULL, NULL, NULL, '[{\"lat\":45.7935,\"lng\":4.3369,\"alt\":596,\"note\":\"\"}]', '2019-10-10 11:09:06'),
(23, 'Parcours n°10km', NULL, NULL, NULL, '[{\"lat\":45.8518,\"lng\":4.3549,\"alt\":815,\"note\":\"\"},{\"lat\":45.8521,\"lng\":4.3517,\"alt\":796,\"note\":\"\"},{\"lat\":45.8584,\"lng\":4.3491,\"alt\":747,\"note\":\"\"},{\"lat\":45.8599,\"lng\":4.3556,\"alt\":812,\"note\":\"\"},{\"lat\":45.864,\"lng\":4.3628,\"alt\":868,\"note\":\"\"},{\"lat\":45.8638,\"lng\":4.3743,\"alt\":708,\"note\":\"\"}]', '2019-10-15 21:21:20'),
(24, 'Rdv Nancy', NULL, NULL, NULL, '[{\"lat\":48.6983,\"lng\":6.1716,\"alt\":207,\"note\":\"\"},{\"lat\":48.6929,\"lng\":6.1933,\"alt\":198,\"note\":\"\"}]', '2019-10-23 10:29:03');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `hikes`
--
ALTER TABLE `hikes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `hikes`
--
ALTER TABLE `hikes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
