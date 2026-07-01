/*
 Navicat Premium Dump SQL

 Source Server         : my_db_01
 Source Server Type    : MySQL
 Source Server Version : 80045 (8.0.45)
 Source Host           : localhost:3306
 Source Schema         : campus_lost_and_found

 Target Server Type    : MySQL
 Target Server Version : 80045 (8.0.45)
 File Encoding         : 65001

 Date: 01/07/2026 19:52:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activities
-- ----------------------------
DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `action_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `target_id` int NULL DEFAULT NULL,
  `target_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for announcements
-- ----------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '公告标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '公告内容',
  `status` tinyint NULL DEFAULT 1 COMMENT '1显示 0隐藏',
  `is_top` tinyint NULL DEFAULT 0 COMMENT '1置顶 0普通',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `priority` tinyint NULL DEFAULT 1 COMMENT '1普通 2重要 3紧急',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for banners
-- ----------------------------
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '轮播图标题',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '图片地址',
  `link_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '点击跳转',
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NULL DEFAULT 1 COMMENT '1显示 0隐藏',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sort` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for chat_messages
-- ----------------------------
DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '记录聊天信息',
  `session_id` int NOT NULL COMMENT '会话id',
  `sender_id` int NOT NULL COMMENT '发送者',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '消息内容',
  `is_ready` tinyint NULL DEFAULT 0 COMMENT '是否已读',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '消息创建的时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_chat_msg_sender`(`sender_id` ASC) USING BTREE,
  INDEX `idx_session_id`(`session_id` ASC) USING BTREE,
  CONSTRAINT `fk_chat_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_chat_msg_session` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for chat_sessions
-- ----------------------------
DROP TABLE IF EXISTS `chat_sessions`;
CREATE TABLE `chat_sessions`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '发起的会话用id记录',
  `item_id` int NOT NULL COMMENT '物品ID',
  `user1_id` int NOT NULL COMMENT '发起聊天的用户',
  `user2_id` int NOT NULL COMMENT '物品发布者',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '会话创建的时间',
  `deleted_by_user1` tinyint NULL DEFAULT 0,
  `deleted_by_user2` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_session`(`item_id` ASC, `user1_id` ASC, `user2_id` ASC) USING BTREE,
  INDEX `idx_user1`(`user1_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for claims
-- ----------------------------
DROP TABLE IF EXISTS `claims`;
CREATE TABLE `claims`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `applicant_id` int NOT NULL COMMENT '发起认领的人',
  `receiver_id` int NOT NULL COMMENT '接收认领的人',
  `status` enum('pending','approved','rejected','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for email_codes
-- ----------------------------
DROP TABLE IF EXISTS `email_codes`;
CREATE TABLE `email_codes`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `type` enum('bind','verify','register','forget') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `expire_time` datetime NULL DEFAULT NULL,
  `is_used` tinyint NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 50 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for item_images
-- ----------------------------
DROP TABLE IF EXISTS `item_images`;
CREATE TABLE `item_images`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_cover` tinyint NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `item_id`(`item_id` ASC) USING BTREE,
  CONSTRAINT `item_images_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for items
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '发布人ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `category_id` int NULL DEFAULT NULL,
  `sub_category_id` int NULL DEFAULT NULL,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `type` enum('lost','found') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '物品类型',
  `status` enum('unclaimed','claimed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'unclaimed' COMMENT '是否认领',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint NULL DEFAULT 0 COMMENT '是否删除',
  `deleted_at` datetime NULL DEFAULT NULL,
  `audit_status` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `fk_items_category`(`category_id` ASC) USING BTREE,
  INDEX `fk_items_sub_category`(`sub_category_id` ASC) USING BTREE,
  CONSTRAINT `fk_items_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_items_sub_category` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sub_categories
-- ----------------------------
DROP TABLE IF EXISTS `sub_categories`;
CREATE TABLE `sub_categories`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `category_id`(`category_id` ASC) USING BTREE,
  CONSTRAINT `sub_categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `student_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '学号',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '姓名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '加密后的密码',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '/default-avatar.png' COMMENT '头像地址',
  `college` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '学院',
  `major` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '专业',
  `grade` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '年级',
  `role` enum('student','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'student' COMMENT '角色',
  `status` tinyint NULL DEFAULT 1 COMMENT '账号状态 1正常 0禁用',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `student_id`(`student_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- View structure for chat_message_full_view
-- ----------------------------
DROP VIEW IF EXISTS `chat_message_full_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `chat_message_full_view` AS select `cm`.`id` AS `message_id`,`cm`.`session_id` AS `session_id`,`cm`.`sender_id` AS `sender_id`,`cm`.`content` AS `content`,`cm`.`created_at` AS `created_at`,`u`.`username` AS `username`,`u`.`avatar` AS `avatar`,`cs`.`item_id` AS `item_id` from ((`chat_messages` `cm` left join `users` `u` on((`cm`.`sender_id` = `u`.`id`))) left join `chat_sessions` `cs` on((`cm`.`session_id` = `cs`.`id`)));

-- ----------------------------
-- View structure for chat_session_view
-- ----------------------------
DROP VIEW IF EXISTS `chat_session_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `chat_session_view` AS select `s`.`id` AS `session_id`,`s`.`user1_id` AS `user1_id`,`s`.`user2_id` AS `user2_id`,`s`.`deleted_by_user1` AS `deleted_by_user1`,`s`.`deleted_by_user2` AS `deleted_by_user2`,`i`.`id` AS `item_id`,`i`.`title` AS `item_title`,`i`.`picture` AS `item_picture`,`u1`.`username` AS `user1_name`,`u1`.`avatar` AS `user1_avatar`,`u2`.`username` AS `user2_name`,`u2`.`avatar` AS `user2_avatar`,`m`.`content` AS `last_message`,`m`.`created_at` AS `last_time` from ((((`chat_sessions` `s` left join `items` `i` on((`s`.`item_id` = `i`.`id`))) left join `users` `u1` on((`s`.`user1_id` = `u1`.`id`))) left join `users` `u2` on((`s`.`user2_id` = `u2`.`id`))) left join `chat_messages` `m` on((`m`.`id` = (select `chat_messages`.`id` from `chat_messages` where (`chat_messages`.`session_id` = `s`.`id`) order by `chat_messages`.`created_at` desc limit 1))));

-- ----------------------------
-- View structure for v_activities_user
-- ----------------------------
DROP VIEW IF EXISTS `v_activities_user`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_activities_user` AS select `a`.`id` AS `id`,`a`.`user_id` AS `user_id`,`a`.`action_type` AS `action_type`,`a`.`target_id` AS `target_id`,`a`.`target_type` AS `target_type`,`a`.`content` AS `content`,`a`.`created_at` AS `created_at`,`u`.`username` AS `username`,`u`.`avatar` AS `avatar` from (`activities` `a` left join `users` `u` on((`a`.`user_id` = `u`.`id`)));

-- ----------------------------
-- View structure for v_items_user
-- ----------------------------
DROP VIEW IF EXISTS `v_items_user`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_items_user` AS select `i`.`id` AS `id`,`i`.`user_id` AS `user_id`,`i`.`title` AS `title`,`i`.`description` AS `description`,`i`.`picture` AS `picture`,`i`.`category_id` AS `category_id`,`i`.`sub_category_id` AS `sub_category_id`,`i`.`location` AS `location`,`i`.`contact` AS `contact`,`i`.`type` AS `type`,`i`.`status` AS `status`,`i`.`created_at` AS `created_at`,`i`.`is_deleted` AS `is_deleted`,`i`.`deleted_at` AS `deleted_at`,`i`.`audit_status` AS `audit_status`,`u`.`username` AS `username`,`c`.`name` AS `category` from ((`items` `i` left join `users` `u` on((`i`.`user_id` = `u`.`id`))) left join `categories` `c` on((`i`.`category_id` = `c`.`id`)));

SET FOREIGN_KEY_CHECKS = 1;
