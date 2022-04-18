SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `bots` (
  `name` text NOT NULL,
  `token` varchar(125) NOT NULL,
  `created` bigint(20) NOT NULL,
  `prefix` text NOT NULL,
  `client_id` text NOT NULL,
  `id` int(11) NOT NULL,
  `memes_feature` tinyint(1) NOT NULL DEFAULT 0,
  `poll_feature` tinyint(1) NOT NULL DEFAULT 0,
  `moderation_feature` tinyint(1) NOT NULL,
  `color_embed` text NOT NULL,
  `ban_feature` tinyint(1) NOT NULL,
  `clear_feature` tinyint(1) NOT NULL,
  `kick_feature` tinyint(1) NOT NULL,
  `ping_feature` tinyint(1) NOT NULL,
  `tag` text DEFAULT NULL,
  `image_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `bots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD UNIQUE KEY `client_id` (`client_id`) USING HASH;
  
ALTER TABLE `bots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;