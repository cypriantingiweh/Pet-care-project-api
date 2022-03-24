
CREATE TABLE cage (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name varchar(45) DEFAULT NULL,
  address varchar(45) DEFAULT NULL,
  height float DEFAULT NULL,
  width float NOT NULL,
  length float DEFAULT NULL,
  capacity float DEFAULT NULL,
  created_at timestamp DEFAULT NULL,
  updated_at timestamp DEFAULT NULL,
  available BOOLEAN NOT NULL,
  pet_type_id int NOT NULL
);

--
-- Table structure for table cage_in_pet
--

CREATE TABLE cage_in_pet (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  Pet_id int NOT NULL,
  cage_id int NOT NULL,
  sign_out varchar(4) NOT NULL,
  enter_date timestamp DEFAULT NULL,
  number_of_days int DEFAULT NULL,
  leaving_date timestamp DEFAULT NULL,
  created_at timestamp DEFAULT NULL,
  updated_at timestamp DEFAULT NULL
);

--
-- Table structure for table cage_out_pet
--

CREATE TABLE cage_out_pet (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cage_in_pet_id int NOT NULL,
  Pet_id int NOT NULL,
  cage_id int NOT NULL,
  enter_date timestamp DEFAULT NULL,
  number_of_days int DEFAULT NULL,
  leaving_date timestamp DEFAULT NULL,
  sign_out_date timestamp DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table normal_services
--

CREATE TABLE normal_services (
  id int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name varchar(45) DEFAULT NULL,
  description varchar(100) NOT NULL,
  cost float DEFAULT NULL,
  created_at timestamp DEFAULT NULL,
  updated_at timestamp DEFAULT NULL,
  pet_type_id int NOT NULL
);

-- Table structure for table Pet
--

CREATE TABLE Pet (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name varchar(45) NOT NULL,
  wieght int NOT NULL,
  date_of_birth timestamp NOT NULL,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL,
  pet_type_id int NOT NULL,
  note text
);

--
-- Table structure for table pet_owner
--

CREATE TABLE pet_owner (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  Users_id int NOT NULL,
  Pet_id int NOT NULL,
  created_at timestamp DEFAULT NULL,
  updated_at timestamp DEFAULT NULL
);
--
-- Table structure for table pet_type
--

CREATE TABLE pet_type (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type_name varchar(45) NOT NULL,
  created_at timestamp DEFAULT NULL,
  updated_at timestamp DEFAULT NULL
);

--
-- Table structure for table provide
--

CREATE TABLE provide (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  services_id int NOT NULL,
  pet_cage_id int NOT NULL,
  extra_service BOOLEAN NOT NULL,
  number_oftimes_per_day int DEFAULT NULL,
  updated_at timestamp DEFAULT NULL,
  created_at timestamp DEFAULT NULL
);

--
-- Table structure for table Users
--

CREATE TABLE Users (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  fullnames varchar(45) DEFAULT NULL,
  phone varchar(15) DEFAULT NULL,
  email varchar(30) DEFAULT NULL,
  password varchar(100) NOT NULL,
  role varchar(45) DEFAULT NULL,
  created_at timestamp DEFAULT NULL,
  updated_at timestamp DEFAULT NULL
);
--
-- Indexes for table cage
--
ALTER TABLE cage
  ADD CONSTRAINT fk_cage_pet_type FOREIGN KEY (pet_type_id) REFERENCES pet_type(id);
--
-- Indexes for table cage_in_pet
--
ALTER TABLE cage_in_pet
  ADD CONSTRAINT fk_cage_in_pet_Pet FOREIGN KEY (Pet_id) REFERENCES Pet(id),
  ADD CONSTRAINT fk_cage_in_pet_cage FOREIGN KEY (cage_id)REFERENCES cage(id);

--
-- Indexes for table normal_services
--
ALTER TABLE normal_services
  ADD CONSTRAINT fk_normal_services_pet_type FOREIGN KEY (pet_type_id) REFERENCES pet_type(id);

--
-- Indexes for table Pet
--
ALTER TABLE Pet
  ADD CONSTRAINT fk_Pet_pet_type FOREIGN KEY (pet_type_id) REFERENCES pet_type(id);

--
-- Indexes for table pet_owner
--
ALTER TABLE pet_owner
  ADD CONSTRAINT fk_pet_owner_Users FOREIGN KEY (Users_id) REFERENCES Users(id),
  ADD CONSTRAINT fk_pet_owner_Pet FOREIGN KEY(Pet_id) REFERENCES Pet(id);


-- Indexes for table provide
--
ALTER TABLE provide
  ADD CONSTRAINT fk_provide_normal_services FOREIGN KEY (services_id) REFERENCES normal_services(id),
  ADD CONSTRAINT fk_provide_pet_cage FOREIGN KEY (pet_cage_id) REFERENCES cage(id);






--inserting
--
-- Dumping data for table pet_type
--

INSERT INTO pet_type (type_name, created_at, updated_at) VALUES
('Dogs', '2022-03-15 19:39:00', '2022-03-15 19:39:00'),
('Cat', '2022-03-15 19:39:00', '2022-03-15 19:39:00');


--
-- Dumping data for table cage
--

INSERT INTO cage (name, address, height, width, length, capacity, created_at, updated_at, available, pet_type_id) VALUES
('cute Yorkies', 'R6', 2, 3, 4, 24, '2022-03-16 16:11:25', '2022-03-16 16:11:25', '0', 1),
( 'Alpha Golden', 'R1', 2, 3, 4, 24, '2022-03-16 16:11:25', '2022-03-16 16:11:25', '1', 1),
('Man’s Bestie', 'R2', 2, 3, 5, 30, '2022-03-16 16:11:25', '2022-03-16 16:11:25', '1', 1),
('Managerial', 'R3', 2, 3, 5, 30, '2022-03-16 16:11:25', '2022-03-16 16:11:25', '1', 1),
('Cage 1', 'R4', 2, 3, 5, 30, '2022-03-16 16:11:25', '2022-03-16 16:11:25', '1', 1),
('Cage 2', 'R5', 2, 3, 5, 30, '2022-03-16 16:11:25', '2022-03-16 16:11:25', '1', 1),
('Cage 3', 'R6', 3, 2, 3, 18, '2022-03-16 16:11:25', '2022-03-16 16:11:25', '0', 1),
('Cage 4', 'R7', 3, 2, 3, 18, '2022-03-16 16:11:25', '2022-03-16 16:11:25', '1', 1),
('Cage 5', 'R8', 3, 2, 3, 18, '2022-03-16 16:11:25', '2022-03-16 16:11:25', '0', 1),
('Cage 6', 'R9', 3, 2, 3, 18, '2022-03-16 16:11:25', '2022-03-16 16:11:25', '1', 1),
('Cage 7', 'R10', 3, 2, 3, 18, '2022-03-16 16:11:25', '2022-03-16 16:11:25', '1', 1),
('Cat cage 1', 'R1', 40, 35, 80, 600, '2020-11-16 00:00:00', '2022-03-20 20:03:24', '0', 2),
('Cat cage 1', 'R2', 50, 40, 90, 890, '2022-03-20 20:03:24', '2022-03-20 20:03:24', '0', 2),
('Cat cage 1', 'R1', 40, 35, 80, 570, '2020-11-16 00:00:00', '2022-03-20 20:03:24', '0', 2),
('Cat cage 1', 'R2', 50, 40, 90, 406, '2022-03-20 20:03:24', '2022-03-20 20:03:24', '1', 2);
-- --------------------------------------------------------

--
-- Dumping data for table Pet
--
INSERT INTO Pet (name, wieght, date_of_birth, created_at, updated_at, pet_type_id, note) VALUES
('Whisky Nono', 50, '2000-03-15 22:07:30', '2022-03-15 22:42:18', '2022-03-16 10:35:17', 1, 'This dog like sleeping alot'),
('Lucky Gastroper', 34, '2022-03-20 00:00:00', '2022-03-20 12:37:27', '2022-03-20 12:37:27', 1, 'This My dog like flow foods, Avoid giving her meat.'),
('Gasperic doly', 6, '2000-03-20 00:00:00', '2022-03-20 15:02:52', '2022-03-20 15:02:52', 2, 'Very fast cat. it eat very much ');

--
-- Dumping data for table normal_services
--

INSERT INTO normal_services (name, description, cost, created_at, updated_at, pet_type_id) VALUES
('Dogs above 40kg', 'Services given to dogs above 40kg of weight', 3000, '2022-03-15 20:35:29', '2022-03-15 20:35:29', 1),
('Dogs between 40kg and 20kg', 'Services given to dogs between 40kg and 20kg of weight', 2000, '2022-03-15 20:35:29', '2022-03-15 20:35:29', 1),
('Dogs below 20kg', 'Services given to dogs below 20kg of weight', 1500, '2022-03-15 20:41:47', '2022-03-15 20:41:47', 1),
('Cat Services', 'Services given to cat regardless of size', 2000, '2022-03-15 20:41:47', '2022-03-15 20:41:47', 2),
('Sharving', 'A service given to dog only', 500, '2022-03-16 17:22:01', '2022-03-16 17:22:01', 1),
('Extra Washing', 'Services given to all pets', 500, '2022-03-16 17:22:01', '2022-03-16 17:39:14', 2),
('Extra Washing', 'Services given to dogs', 500, '2022-03-22 16:47:07', '2022-03-22 16:47:07', 1);

--
-- Dumping data for table Users
--

INSERT INTO Users (fullnames, phone, email, password, role, created_at, updated_at) VALUES
('GeradNdula Nuyui', '+237680020094', 'Gerad@birocas.com', '$2a$08$RNk4AVOw6M1EPHmeBynh7OihGutOcyDVUJ7/z7o/J0Ny0lFbEVdC6', 'SUPER', '2022-03-15 22:07:30', '2022-03-15 22:07:30'),
('Pet OwnerNchinda', '+237680020094', 'abroad@gmail.com', '$2a$08$vdGitsqSJl0CgEDi2Pe6S.LLKgoxKpLURXkJGj2QNBAs9.zRvMVP2', 'PET_OWNER', '2022-03-15 22:07:30', '2022-03-15 22:07:30'),
('Cyprian Simtenyui', '681120009', 'cypriantingiweh@gmail.com', '$2a$08$DFKBW8rj6OwrSXdMccbH1uvxJtwpPEGy/M8d5wxtTAfmNYW6WeqLq', 'PET_OWNER', '2022-03-20 11:33:50', '2022-03-20 11:33:50');

--
-- Dumping data for table cage_in_pet
--

INSERT INTO cage_in_pet (Pet_id, cage_id, sign_out, enter_date, number_of_days, leaving_date, created_at, updated_at) VALUES
(1, 1, 'IN', '2022-03-16 16:11:25', 2, '2022-03-18 16:11:25', '2022-03-16 16:11:25', '2022-03-16 16:11:25'),
(2, 7, 'IN', '2022-03-22 15:58:55', 3, '2022-03-25 00:00:00', '2022-03-22 15:58:55', '2022-03-22 15:58:55');


--
-- Dumping data for table pet_owner
--

INSERT INTO pet_owner (Users_id, Pet_id, created_at, updated_at) VALUES
(2, 1, '2022-03-15 22:42:18', '2022-03-15 22:42:18'),
(3, 2, '2022-03-20 12:37:27', '2022-03-20 12:37:27'),
(3, 3, '2022-03-20 15:02:52', '2022-03-20 15:02:52');

--
-- Dumping data for table provide
--

INSERT INTO provide (services_id, pet_cage_id, extra_service, number_oftimes_per_day, updated_at, created_at) VALUES
(1, 1, '0', 0, '2022-03-16 22:45:47', '2022-03-16 22:45:47'),
(5, 1, '1', 0, '2022-03-16 22:45:47', '2022-03-16 22:45:47'),
(6, 1, '1', 2, '2022-03-16 22:45:47', '2022-03-16 22:45:47'),
(3, 6, '0', 0, '2022-03-22 15:58:55', '2022-03-22 15:58:55'),
(3, 6, '0', 0, '2022-03-22 15:58:55', '2022-03-22 15:58:55'),
(7, 6, '1', 0, '2022-03-22 15:58:55', '2022-03-22 15:58:55'),
(3, 6, '0', 0, '2022-03-22 15:58:55', '2022-03-22 15:58:55');
-------------------------------
