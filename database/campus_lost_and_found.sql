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

 Date: 16/03/2026 21:40:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sort` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, '数码产品', 0);
INSERT INTO `categories` VALUES (2, '衣物', 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chat_messages
-- ----------------------------

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
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_session`(`item_id` ASC, `user1_id` ASC, `user2_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chat_sessions
-- ----------------------------
INSERT INTO `chat_sessions` VALUES (1, 1, 1, 2, '2026-03-13 15:08:05');
INSERT INTO `chat_sessions` VALUES (2, 9, 1, 2, '2026-03-13 15:32:24');
INSERT INTO `chat_sessions` VALUES (3, 7, 1, 1, '2026-03-13 15:33:02');

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
-- Records of item_images
-- ----------------------------
INSERT INTO `item_images` VALUES (1, 22, 'http://localhost:3000/uploads/1773134458283-test卫衣.webp', 1, '2026-03-10 17:21:55');
INSERT INTO `item_images` VALUES (2, 23, 'http://localhost:3000/uploads/items/1773621106066-Test黑色长筒裤.jpg', 1, '2026-03-16 08:32:20');

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
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `fk_items_category`(`category_id` ASC) USING BTREE,
  INDEX `fk_items_sub_category`(`sub_category_id` ASC) USING BTREE,
  CONSTRAINT `fk_items_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_items_sub_category` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of items
-- ----------------------------
INSERT INTO `items` VALUES (1, 1, '索尼耳机xm5', '黑色的索尼XM5耳机丢在了西教学楼', NULL, 1, 5, NULL, NULL, 'lost', 'unclaimed', '2026-03-04 17:51:10', 1, '2026-03-10 20:25:19');
INSERT INTO `items` VALUES (7, 1, '黑色蓝牙耳机一副', 'Test', NULL, 1, 5, 'test', '电话:15377654991', 'found', 'unclaimed', '2026-03-04 23:16:30', 0, NULL);
INSERT INTO `items` VALUES (8, 2, '白色苹果耳机一副', NULL, NULL, 1, 5, NULL, NULL, 'found', 'unclaimed', '2026-03-04 23:19:54', 0, NULL);
INSERT INTO `items` VALUES (9, 2, '相机一台', NULL, NULL, 1, 6, NULL, NULL, 'found', 'unclaimed', '2026-03-06 00:22:34', 0, NULL);
INSERT INTO `items` VALUES (10, 1, '校园卡', NULL, NULL, NULL, NULL, NULL, NULL, 'lost', 'unclaimed', '2026-03-06 14:33:39', 0, NULL);
INSERT INTO `items` VALUES (11, 1, '白色水杯', NULL, NULL, NULL, NULL, NULL, NULL, 'lost', 'unclaimed', '2026-03-06 14:39:43', 0, NULL);
INSERT INTO `items` VALUES (15, 1, '鞋子', 'shoe', NULL, 2, 3, '图书馆', '123456778910', 'lost', 'unclaimed', '2026-03-06 15:04:28', 0, NULL);
INSERT INTO `items` VALUES (16, 2, 'iPhone17手机', '一部白色的iPhone17手机遗失在了食堂3楼的桌子上，现在已经放到保安室了', NULL, 1, 1, '食堂3楼', '13455706833', 'found', 'unclaimed', '2026-03-07 01:09:44', 0, NULL);
INSERT INTO `items` VALUES (17, 1, '华为手机', '本人丢失一部白色华为pura80', NULL, 1, 1, '疑似在东教学楼丢失', '13131313131', 'lost', 'unclaimed', '2026-03-09 23:09:38', 0, NULL);
INSERT INTO `items` VALUES (18, 1, '12', '1', NULL, 1, 1, '1', '1', 'found', 'unclaimed', '2026-03-09 23:21:46', 0, NULL);
INSERT INTO `items` VALUES (19, 1, 'test', 'test', NULL, 1, 2, 'test', 'test', 'found', 'unclaimed', '2026-03-10 13:22:44', 1, '2026-03-10 20:29:45');
INSERT INTO `items` VALUES (20, 1, 'test', 'test', NULL, 2, 4, 'test', 'test', 'found', 'unclaimed', '2026-03-10 13:26:16', 1, '2026-03-10 20:21:41');
INSERT INTO `items` VALUES (21, 1, '联想笔记本电脑', '一台黑色的联想笔记本电脑', NULL, 1, 2, '5号宿舍楼楼下的蜜雪冰城奶茶店', '电话:13778965431', 'found', 'unclaimed', '2026-03-10 17:04:35', 0, NULL);
INSERT INTO `items` VALUES (22, 1, '红色卫衣', '在图书馆3楼捡到一件红色的m码卫衣，请失主看见和我联系', 'http://localhost:3000/uploads/items/1773331205084-test卫衣.webp', 2, 3, '图书馆3楼', '电话: 1835460789', 'found', 'unclaimed', '2026-03-10 17:21:55', 0, NULL);
INSERT INTO `items` VALUES (23, 1, '黑色长筒裤', '一件L码的黑色长筒裤', 'http://localhost:3000/uploads/items/1773621106066-Test黑色长筒裤.jpg', 2, 4, '7号学生宿舍楼附近', '电话:13456789012', 'lost', 'unclaimed', '2026-03-16 08:32:20', 0, NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sub_categories
-- ----------------------------
INSERT INTO `sub_categories` VALUES (1, '手机', 1);
INSERT INTO `sub_categories` VALUES (2, '电脑', 1);
INSERT INTO `sub_categories` VALUES (3, '上衣', 2);
INSERT INTO `sub_categories` VALUES (4, '裤子', 2);
INSERT INTO `sub_categories` VALUES (5, '耳机', 1);
INSERT INTO `sub_categories` VALUES (6, '相机', 1);
INSERT INTO `sub_categories` VALUES (7, '鞋子', 2);

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
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '20260303', 'TestUser', '$2b$10$k9Iju2icOWdYN3KiXKplKe8LgxX/7.5ge/sbrOuBa0NHrbbzMTwEG', '13567891011', '123456@gmail.com', 'http://localhost:3000/uploads/avatars/1773298767730-avatar.jpg', NULL, 'TestMajor', 'TestGrade', 'student', 1, '2026-03-03 22:42:24', '2026-03-16 20:12:24');
INSERT INTO `users` VALUES (2, '20260304', 'shiroha', '$2b$10$kguf736II3Vq60SFf1OuM.XJ/Ckg9DBd072D.b0FmemU6K0mepc7y', NULL, NULL, '/default-avatar.png', NULL, NULL, NULL, 'student', 1, '2026-03-04 23:18:07', '2026-03-04 23:18:07');

-- ----------------------------
-- View structure for chat_message_full_view
-- ----------------------------
DROP VIEW IF EXISTS `chat_message_full_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `chat_message_full_view` AS select `cm`.`id` AS `message_id`,`cm`.`session_id` AS `session_id`,`cm`.`sender_id` AS `sender_id`,`cm`.`content` AS `content`,`cm`.`created_at` AS `created_at`,`u`.`username` AS `username`,`u`.`avatar` AS `avatar`,`cs`.`item_id` AS `item_id` from ((`chat_messages` `cm` left join `users` `u` on((`cm`.`sender_id` = `u`.`id`))) left join `chat_sessions` `cs` on((`cm`.`session_id` = `cs`.`id`)));

-- ----------------------------
-- View structure for chat_session_view
-- ----------------------------
DROP VIEW IF EXISTS `chat_session_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `chat_session_view` AS select `cs`.`id` AS `session_id`,`cs`.`user1_id` AS `user1_id`,`cs`.`user2_id` AS `user2_id`,`i`.`id` AS `item_id`,`i`.`title` AS `item_title`,`i`.`picture` AS `item_picture`,`u1`.`username` AS `user1_name`,`u1`.`avatar` AS `user1_avatar`,`u2`.`username` AS `user2_name`,`u2`.`avatar` AS `user2_avatar`,(select `chat_messages`.`content` from `chat_messages` where (`chat_messages`.`session_id` = `cs`.`id`) order by `chat_messages`.`created_at` desc limit 1) AS `last_message`,(select `chat_messages`.`created_at` from `chat_messages` where (`chat_messages`.`session_id` = `cs`.`id`) order by `chat_messages`.`created_at` desc limit 1) AS `last_time` from (((`chat_sessions` `cs` left join `items` `i` on((`cs`.`item_id` = `i`.`id`))) left join `users` `u1` on((`cs`.`user1_id` = `u1`.`id`))) left join `users` `u2` on((`cs`.`user2_id` = `u2`.`id`)));

SET FOREIGN_KEY_CHECKS = 1;
