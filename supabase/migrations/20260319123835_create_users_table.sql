create table if not exists users (
  id integer primary key generated always as identity,
  username text unique not null,
  password text not null,
  qr_code_url text,
  linked_in_url text,
  instagram_url text,
  github_url text,
  created_at timestamptz default now()
);