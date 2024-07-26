insert into department(name)
values ('sales'),
('service'),
('support');

insert into role(name,department_id,salary)
values ('manager', 1,100000,1),
('manager', 2, 100000),
('manager', 3, 100000),
('associate', 1,60000),
('associate', 2,60000),
('associate', 3,60000),
('trainee', 1,40000),
('trainee', 2,40000),
('trainee', 3,40000)
;
