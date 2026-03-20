create table if not exists designs (
  id integer primary key generated always as identity,
    user_id integer not null references users(id) on delete cascade,
    first_name text not null,
    last_name text not null,
    label_preset text not null,
    font_preset text not null,
    font_color text not null,
    description text,
    tags text[],
    custom_image_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);