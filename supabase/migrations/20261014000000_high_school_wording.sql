-- ScholarSpring is for high-school students applying to college, so the demo scholarships are
-- reworded for graduating seniors. "Women Who Build" (an undergraduate founders' award) becomes
-- "Future Founders Award" with a new id; anyone who saved it keeps it. Safe to run more than once.

-- 1. Replace women-build with future-founders, carrying over amount, deadline and requirements.
insert into public.scholarships (id, name, provider, category, amount, deadline, min_gpa, majors, regions, description, eligibility)
select 'future-founders', 'Future Founders Award', provider, 'Leadership', amount, deadline, min_gpa, majors, regions,
       'For high-school students who started a club, business or community project and want to keep building in college.',
       'Graduating high-school seniors who can show a project they started and led. Any intended major.'
from public.scholarships
where id = 'women-build'
on conflict (id) do nothing;

update public.saved_scholarships saved
set scholarship_id = 'future-founders'
where saved.scholarship_id = 'women-build'
  and not exists (
    select 1 from public.saved_scholarships other
    where other.profile_id = saved.profile_id and other.scholarship_id = 'future-founders'
  );

delete from public.scholarships where id = 'women-build';

-- 2. Reword the other five for high-school seniors.
update public.scholarships set
  description = 'For high-school seniors who love science and technology and plan to study it in college.',
  eligibility = 'Graduating high-school seniors planning to major in computer science or environmental science.'
where id = 'stem-forward';

update public.scholarships set
  name = 'Green Future Scholarship',
  description = 'For high-school seniors who have led environmental projects at school or in their community.',
  eligibility = 'Graduating high-school seniors with environmental service or climate-action experience. Any intended major.'
where id = 'green-future';

update public.scholarships set
  category = 'First Generation',
  description = 'For students who will be the first in their family to go to college.',
  eligibility = 'High-school seniors whose parents did not finish a four-year degree, starting college next fall.'
where id = 'first-gen';

update public.scholarships set
  description = 'For high-school seniors who want to become teachers.',
  eligibility = 'Graduating high-school seniors planning to study education in college. Tutoring or classroom volunteering is a plus.'
where id = 'future-teachers';

update public.scholarships set
  description = 'For high-school artists, writers, filmmakers and musicians on their way to college.',
  eligibility = 'Graduating high-school seniors who submit a portfolio or writing sample. Any intended major.'
where id = 'creative-voice';
