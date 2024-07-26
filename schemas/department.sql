\c

-- Create department first
create table department(
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- create role second 
create table role(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) not null,
    salary integer not null,
    department_id integer,
    foreign key (department_id) references department(id)
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  manager VARCHAR(30),
  role_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES role(id),
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES department(id)
);