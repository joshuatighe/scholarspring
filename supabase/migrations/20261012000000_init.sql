-- ScholarSpring schema: scholarships, student profiles and saved scholarships.
-- Access is enforced here with Row Level Security, not in the app: the browser
-- only ever holds the public anon key.

------------------------------------------------------------------------------
-- Scholarships: a public catalogue. Everyone can read it; nobody can change it
-- from the app (edit it in the Supabase dashboard or with a new migration).
------------------------------------------------------------------------------
create table public.scholarships (
  id          text primary key check (id ~ '^[a-z0-9-]+$'),
  name        text not null,
  provider    text not null,
  category    text not null,
  amount      integer not null check (amount > 0),                         -- whole US dollars
  deadline    date not null,
  min_gpa     numeric(3, 2) not null default 0 check (min_gpa between 0 and 4),
  majors      text[] not null default '{}',                               -- 'Any major' matches every major
  regions     text[] not null default '{}',                               -- 'National' matches every region
  description text not null,
  eligibility text not null,
  url         text,
  created_at  timestamptz not null default now()
);

alter table public.scholarships enable row level security;

create policy "Anyone can read scholarships"
  on public.scholarships for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.scholarships from anon, authenticated;

------------------------------------------------------------------------------
-- Profiles: one per Supabase Auth user, created by a trigger on sign-up.
-- Students can read and update only their own row, and the username is fixed.
------------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  username   text not null check (username ~ '^[A-Za-z0-9._-]{2,30}$'),
  gpa        numeric(3, 2) not null check (gpa between 0 and 4),
  major      text not null,
  region     text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_username_key on public.profiles (lower(username));

alter table public.profiles enable row level security;

create policy "Students can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Students can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Rows are only created by the sign-up trigger and removed with the auth user,
-- and only these three columns can be changed.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (gpa, major, region) on public.profiles to authenticated;

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Creates the profile from the details the app passes to supabase.auth.signUp().
-- Users created another way (e.g. in the dashboard) get safe defaults.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, username, gpa, major, region)
  values (
    new.id,
    coalesce(nullif(meta ->> 'username', ''), 'student-' || left(new.id::text, 8)),
    coalesce((meta ->> 'gpa')::numeric, 0),
    coalesce(nullif(meta ->> 'major', ''), 'Undecided'),
    coalesce(nullif(meta ->> 'region', ''), 'National')
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lets the sign-up form say "that username is taken" before creating the account.
create function public.username_available(name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(name));
$$;

revoke execute on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

------------------------------------------------------------------------------
-- Saved scholarships: each student's shortlist. Students can see, add and
-- remove only their own rows.
------------------------------------------------------------------------------
create table public.saved_scholarships (
  profile_id     uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  scholarship_id text not null references public.scholarships (id) on delete cascade,
  saved_at       timestamptz not null default now(),
  primary key (profile_id, scholarship_id)
);

alter table public.saved_scholarships enable row level security;

create policy "Students can read their own saved scholarships"
  on public.saved_scholarships for select
  to authenticated
  using ((select auth.uid()) = profile_id);

create policy "Students can save scholarships for themselves"
  on public.saved_scholarships for insert
  to authenticated
  with check ((select auth.uid()) = profile_id);

create policy "Students can remove their own saved scholarships"
  on public.saved_scholarships for delete
  to authenticated
  using ((select auth.uid()) = profile_id);

revoke update on public.saved_scholarships from anon, authenticated;
revoke insert, delete on public.saved_scholarships from anon;
