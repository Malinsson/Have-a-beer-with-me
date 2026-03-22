insert into public.users (username, password)
values
	('erlich', 'dev-password-1'),
	('richard', 'dev-password-2'),
	('monica', 'dev-password-3')
on conflict (username) do nothing;
