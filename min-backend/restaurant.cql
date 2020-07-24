create keyspace restaurant_keyspace with replication = { 
    'class': 'SimpleStrategy','replication_factor': 3 } 
    AND durable_writes = 'true';

use restaurant_keyspace;


















create table customer_by_id (
    id uuid,
    first_name text,
    last_name text,
    birth_date date,
    email text,
    password text,
    primary key(id)
);
create materialized view restaurant_keyspace.customer_by_email
as select *
from restaurant_keyspace.customer_by_id
where email is not null and
id is not null
primary key(email, id);
describe tables;
select * from customer_by_id;
select * from customer_by_email;



create table product_by_branch (
    id uuid,
    description text,
    category text,
    stock counter,
    branch int,
    price float,
    primary key(branch, id, category)
);

create table product_by_branch (
    description text,
    category text,
    branch int,
    stock int,
    price float,
    primary key(branch, category, description)
);



// employee_by_branch_and_id
create table employee_by_branch_and_id (
    id uuid,
    branch int,
    first_name text,
    last_name text,
    entry_time time,
    departure_time time,
    salary float,
    email text,
    password text,
    job text,            // papu ya tengo las tablas de arriba weeee sin errores
    PRIMARY KEY((branch,id))
);
// employee_by_branch_and_job
create materialized view restaurant_keyspace.employee_by_branch_and_job
as select *
from restaurant_keyspace.employee_by_branch_and_id
where id is not null and
branch is not null and
job is not null
primary key((branch, job), id);

// employee_by_email
create materialized view restaurant_keyspace.employee_by_email
as select *
from restaurant_keyspace.employee_by_branch_and_id
where id is not null and
branch is not null and
email is not null
primary key(email, id, branch);
select * from employee_by_email where email = 'hi@email.com';


// factura_by_id & factura_by_customer
create table factura_by_id(
    id uuid,
    id_customer uuid,
    name_customer text,
    products set<frozen<tuple<text,int,double, double>>>,
    total int,
    date timestamp,
    id_vale uuid,
    branch int,
    PRIMARY KEY(id)
);
create materialized view restaurant_keyspace.factura_by_customer
as select *
from restaurant_keyspace.factura_by_id
where id is not null and
id_customer is not null
primary key(id_customer, id);
select * from factura_by_customer where id_customer = now();


create table reservation_by_branch_and_id(
    id                  uuid,
    reservation_date    date,
    hour                time,
    id_mesa         list<uuid>,
    id_customer         uuid,
    branch              int,
    PRIMARY KEY((branch,id))
);
//Materialized views  “reservation_by_id” PK (id, branch)
create materialized view restaurant_keyspace.reservation_by_id
as select *
from restaurant_keyspace.reservation_by_branch_and_id
where id is not null and
branch is not null
primary key(id, branch);
//
//Materialized views  “reservation_by_branch” PK (branch, id)
create materialized view restaurant_keyspace.reservation_by_branch
as select *
from restaurant_keyspace.reservation_by_branch_and_id
where id is not null and
branch is not null
primary key(branch, id);


create table vale(
    id uuid,
    id_customer uuid,
    launch_date  date,
    expiration_date date,
    PRIMARY KEY(id,id_customer)
);

create table table_by_branch(
    branch int,
    id uuid,
    available boolean,
    capacity int,
    PRIMARY KEY(branch,id)
);
// Materialized views “table_by_ID_and_availability” partition key (ID, Available) clustering key (branch)
create materialized view restaurant_keyspace.table_by_ID_and_availability
as select *
from restaurant_keyspace.table_by_branch
where id is not null and
available is not null and
branch is not null
primary key((id, available), branch);
select * from table_by_ID_and_availability;
