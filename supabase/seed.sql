insert into auth.users (
	id,
	aud,
	role,
	email,
	encrypted_password,
	email_confirmed_at,
	created_at,
	updated_at,
	raw_app_meta_data,
	raw_user_meta_data
)
values
	(
		'11111111-1111-1111-1111-111111111111',
		'authenticated',
		'authenticated',
		'erlich@example.com',
		'$2a$10$7EqJtq98hPqEX7fNZaFWoOaQf3J4wq4B7q4fA3Qf9N7x6QxSgQw6e',
		now(),
		now(),
		now(),
		'{"provider":"email","providers":["email"]}',
		'{"username":"erlich"}'
	),
	(
		'22222222-2222-2222-2222-222222222222',
		'authenticated',
		'authenticated',
		'richard@example.com',
		'$2a$10$7EqJtq98hPqEX7fNZaFWoOaQf3J4wq4B7q4fA3Qf9N7x6QxSgQw6e',
		now(),
		now(),
		now(),
		'{"provider":"email","providers":["email"]}',
		'{"username":"richard"}'
	)
on conflict (id) do nothing;

insert into public.profiles (
	id,
	username,
	first_name,
	last_name,
	qr_code,
	github_url,
	instagram_url,
	linkedin_url
)
values
	(
		'11111111-1111-1111-1111-111111111111',
		'erlich',
		'Erlich',
		'Bachman',
		'https://example.com/qr/erlich',
		'https://github.com/erlich',
		'https://instagram.com/erlich',
		'https://linkedin.com/in/erlich'
	),
	(
		'22222222-2222-2222-2222-222222222222',
		'richard',
		'Richard',
		'Hendricks',
		'https://example.com/qr/richard',
		'https://github.com/richard',
		'https://instagram.com/richard',
		'https://linkedin.com/in/richard'
	)
on conflict (id) do update
set
	username = excluded.username,
	first_name = excluded.first_name,
	last_name = excluded.last_name,
	qr_code = excluded.qr_code,
	github_url = excluded.github_url,
	instagram_url = excluded.instagram_url,
	linkedin_url = excluded.linkedin_url;

insert into public.designs (
	id,
	user_id,
	design_data,
	name,
	share_id
)
values
	(
		'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
		'11111111-1111-1111-1111-111111111111',
		'{"label":"classic","font":"retro","color":"amber"}'::jsonb,
		'Erlich Classic',
		'share-erlich-classic'
	),
	(
		'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
		'22222222-2222-2222-2222-222222222222',
		'{"label":"minimal","font":"sans","color":"black"}'::jsonb,
		'Richard Minimal',
		'share-richard-minimal'
	)
on conflict (id) do update
set
	user_id = excluded.user_id,
	design_data = excluded.design_data,
	name = excluded.name,
	share_id = excluded.share_id,
	updated_at = now();

insert into public.saved_designs (
	user_id,
	design_id
)
values
	('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
	('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
on conflict do nothing;
