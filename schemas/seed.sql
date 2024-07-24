insert into department(name)
values ('sales'),
('service'),
('support');

insert into role(name,department_id)
values ('manager', 1),
('manager', 2),
('manager', 3),
('associate', 1),
('associate', 2),
('associate', 3),
('trainee', 1),
('trainee', 2),
('trainee', 3)
;

insert into employee(first_name,last_name, salary,role_id,department_id)
values
('Juan','Parra',100000,1,1),
('Andres','Parra',10000000,1,1)

select e.id as Employee_ID, e.first_name as first_name, e.last_name as last_name, r.name as role, d.name as department, e.salary as salary
    from employee e 
    inner join role r on e.role_id = r.id
    inner join department d on e.department_id = d.id;