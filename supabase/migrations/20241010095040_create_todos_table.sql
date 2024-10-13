
create table
todos (
    id bigint primary key generated always as identity,
    title varchar,
    created_at timestamptz default now(),
    updated_at timestamptz default NULL,
    priority bigint
);
