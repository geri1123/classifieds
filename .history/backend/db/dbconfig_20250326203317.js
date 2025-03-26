const mysql = require("mysql2");

const db = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD || "", 
   database: process.env.DB_NAME,
});

// Check connection
db.connect((err) => {
   if (err) {
       console.log("Error connecting to MySQL:", err);
   } else {
       console.log("Connected to MySQL database.");
   }
});

module.exports = db; 

// CREATE TABLE `attributes` (
//     `id` int(11) NOT NULL,
//     `name` varchar(50) NOT NULL,
//     `subcategory_id` int(11) DEFAULT NULL
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  
//   -- --------------------------------------------------------
  
//   --
//   -- Table structure for table `categories`
//   --
  
//   CREATE TABLE `categories` (
//     `id` int(11) NOT NULL,
//     `name` varchar(50) NOT NULL
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  
//   --
//   -- Dumping data for table `categories`
//   --
  
//   INSERT INTO `categories` (`id`, `name`) VALUES
//   (1, 'Motors'),
//   (2, 'Property'),
//   (3, 'Jobs'),
//   (4, 'Services');
  
//   -- --------------------------------------------------------
  
//   --
//   -- Table structure for table `products`
//   --
  
//   CREATE TABLE `products` (
//     `id` int(11) NOT NULL,
//     `user_id` int(11) DEFAULT NULL,
//     `category_id` int(11) DEFAULT NULL,
//     `subcategory_id` int(11) DEFAULT NULL,
//     `subcategories_items_id` int(11) DEFAULT NULL,
//     `title` varchar(100) NOT NULL,
//     `description` text DEFAULT NULL,
//     `price` decimal(10,2) DEFAULT NULL,
//     `created_at` timestamp NOT NULL DEFAULT current_timestamp()
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  
//   -- --------------------------------------------------------
  
//   --
//   -- Table structure for table `product_attributes`
//   --
  
//   CREATE TABLE `product_attributes` (
//     `product_id` int(11) NOT NULL,
//     `attribute_id` int(11) NOT NULL,
//     `value` varchar(100) DEFAULT NULL
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  
//   -- --------------------------------------------------------
  
//   --
//   -- Table structure for table `subcategories`
//   --
  
//   CREATE TABLE `subcategories` (
//     `id` int(11) NOT NULL,
//     `category_id` int(11) DEFAULT NULL,
//     `name` varchar(50) NOT NULL
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  
//   --
//   -- Dumping data for table `subcategories`
//   --
  
//   INSERT INTO `subcategories` (`id`, `category_id`, `name`) VALUES
//   (1, 1, 'Cars'),
//   (2, 1, 'Boats');
  
//   -- --------------------------------------------------------
  
//   --
//   -- Table structure for table `subcategories_items`
//   --
  
//   CREATE TABLE `subcategories_items` (
//     `id` int(11) NOT NULL,
//     `subcategory_id` int(11) DEFAULT NULL,
//     `name` varchar(50) NOT NULL
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  
//   -- --------------------------------------------------------
  
//   --
//   -- Table structure for table `users`
//   --
  
//   CREATE TABLE `users` (
//     `user_id` int(11) NOT NULL,
//     `profile_img` varchar(255) NOT NULL,
//     `username` varchar(50) NOT NULL,
//     `email` varchar(100) NOT NULL,
//     `password` varchar(100) NOT NULL,
//     `first_name` varchar(100) DEFAULT NULL,
//     `last_name` varchar(100) DEFAULT NULL,
//     `about_me` varchar(255) NOT NULL,
//     `phone` varchar(20) NOT NULL,
//     `receive_notifications` tinyint(1) NOT NULL DEFAULT 1,
//     `instagram` varchar(255) NOT NULL,
//     `fiver` varchar(255) NOT NULL,
//     `facebook` varchar(255) NOT NULL,
//     `linkedin` varchar(255) NOT NULL,
//     `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//     `last_username_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
//     `next_username_update` datetime DEFAULT NULL
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  
//   --
//   -- Dumping data for table `users`
//   --
  
//   INSERT INTO `users` (`user_id`, `profile_img`, `username`, `email`, `password`, `first_name`, `last_name`, `about_me`, `phone`, `receive_notifications`, `instagram`, `fiver`, `facebook`, `linkedin`, `created_at`, `last_username_update`, `next_username_update`) VALUES
//   (1, 'uploads/1743011544046-1740507316070-OIP (1).jpg', 'example', 'example@gmail.com', '$2b$10$42DqOa5mze4SO8/Ktd0TIODc2kfTJ9UBdfAr6QAlyWCGE0iJ1QaHq', 'example', 'example', 'gerger', '+355698574623', 1, '', '', '', '', '2025-03-26 17:51:21', '2025-03-26 19:08:44', NULL);
  
//   --
//   -- Indexes for dumped tables
//   --
  
//   --
//   -- Indexes for table `attributes`
//   --
//   ALTER TABLE `attributes`
//     ADD PRIMARY KEY (`id`),
//     ADD KEY `subcategory_id` (`subcategory_id`);
  
//   --
//   -- Indexes for table `categories`
//   --
//   ALTER TABLE `categories`
//     ADD PRIMARY KEY (`id`);
  
//   --
//   -- Indexes for table `products`
//   --
//   ALTER TABLE `products`
//     ADD PRIMARY KEY (`id`),
//     ADD KEY `user_id` (`user_id`),
//     ADD KEY `subcategories_items_id` (`subcategories_items_id`),
//     ADD KEY `category_id` (`category_id`),
//     ADD KEY `subcategory_id` (`subcategory_id`);
  
//   --
//   -- Indexes for table `product_attributes`
//   --
//   ALTER TABLE `product_attributes`
//     ADD PRIMARY KEY (`product_id`,`attribute_id`),
//     ADD KEY `attribute_id` (`attribute_id`);
  
//   --
//   -- Indexes for table `subcategories`
//   --
//   ALTER TABLE `subcategories`
//     ADD PRIMARY KEY (`id`),
//     ADD KEY `category_id` (`category_id`);
  
//   --
//   -- Indexes for table `subcategories_items`
//   --
//   ALTER TABLE `subcategories_items`
//     ADD PRIMARY KEY (`id`),
//     ADD KEY `subcategory_id` (`subcategory_id`);
  
//   --
//   -- Indexes for table `users`
//   --
//   ALTER TABLE `users`
//     ADD PRIMARY KEY (`user_id`);
  
//   --
//   -- AUTO_INCREMENT for dumped tables
//   --
  
//   --
//   -- AUTO_INCREMENT for table `attributes`
//   --
//   ALTER TABLE `attributes`
//     MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
  
//   --
//   -- AUTO_INCREMENT for table `categories`
//   --
//   ALTER TABLE `categories`
//     MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
  
//   --
//   -- AUTO_INCREMENT for table `products`
//   --
//   ALTER TABLE `products`
//     MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
  
//   --
//   -- AUTO_INCREMENT for table `subcategories`
//   --
//   ALTER TABLE `subcategories`
//     MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
  
//   --
//   -- AUTO_INCREMENT for table `subcategories_items`
//   --
//   ALTER TABLE `subcategories_items`
//     MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
  
//   --
//   -- AUTO_INCREMENT for table `users`
//   --
//   ALTER TABLE `users`
//     MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
  
//   --
//   -- Constraints for dumped tables
//   --
  
//   --
//   -- Constraints for table `attributes`
//   --
//   ALTER TABLE `attributes`
//     ADD CONSTRAINT `attributes_ibfk_1` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`);
  
//   --
//   -- Constraints for table `products`
//   --
//   ALTER TABLE `products`
//     ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
//     ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`subcategories_items_id`) REFERENCES `subcategories_items` (`id`),
//     ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
//     ADD CONSTRAINT `products_ibfk_4` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`);
  
//   --
//   -- Constraints for table `product_attributes`
//   --
//   ALTER TABLE `product_attributes`
//     ADD CONSTRAINT `product_attributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
//     ADD CONSTRAINT `product_attributes_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`);
  
//   --
//   -- Constraints for table `subcategories`
//   --
//   ALTER TABLE `subcategories`
//     ADD CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
  
//   --
//   -- Constraints for table `subcategories_items`
//   --
//   ALTER TABLE `subcategories_items`
//     ADD CONSTRAINT `subcategories_items_ibfk_1` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`);
//   COMMIT;
  
  /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
  /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
  /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
  