-- The six demo scholarships were seeded with 2026 deadlines that have now passed. Since the app
-- hides closed scholarships by default, move them forward one year. Only touches those six rows,
-- and only while they still have their original 2026 deadlines, so it is safe to run more than once.
update public.scholarships
set deadline = (deadline + interval '1 year')::date
where id in ('stem-forward', 'green-future', 'first-gen', 'future-teachers', 'creative-voice', 'women-build')
  and deadline < date '2027-01-01';
