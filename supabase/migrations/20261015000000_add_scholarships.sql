-- Seven more demo scholarships for graduating high-school seniors, filling gaps in the first six:
-- a women founders award (back as a high-school award, with a new id: the wording migration removes
-- the old 'women-build'), a high-GPA merit award, business and undecided majors, and the South,
-- Northeast and Midwest. All names and providers are fictional. Safe to run more than once.
insert into public.scholarships
  (id, name, provider, category, amount, deadline, min_gpa, majors, regions, description, eligibility)
values
  ('women-who-build', 'Women Who Build Scholarship', 'Brightline Founders Network', 'Entrepreneurship',
   10000, '2027-02-15', 3.0, '{"Business","Computer Science","Any major"}', '{"National"}',
   'For young women and nonbinary high-school students who have started a business, app or community project.',
   'Graduating high-school seniors who identify as women or nonbinary and can show a venture or project they started. Any intended major.'),
  ('bright-minds', 'Bright Minds Merit Award', 'Lantern Scholars Fund', 'Merit',
   15000, '2027-03-15', 3.8, '{"Any major"}', '{"National"}',
   'For high-school seniors with top grades who are ready to take on a challenging college program.',
   'Graduating high-school seniors with a 3.8 GPA or higher. Any intended major.'),
  ('main-street-business', 'Main Street Business Scholarship', 'Main Street Merchants Guild', 'Business',
   5000, '2027-04-01', 3.0, '{"Business"}', '{"National"}',
   'For high-school seniors who plan to study business, finance or marketing in college.',
   'Graduating high-school seniors planning to major in business. A part-time job or school business club is a plus.'),
  ('open-paths', 'Open Paths Scholarship', 'Wayfinder Education Fund', 'Exploration',
   3500, '2027-03-01', 2.5, '{"Any major"}', '{"National"}',
   'For high-school seniors who haven''t picked a major yet and want room to explore in their first year of college.',
   'Graduating high-school seniors who are still deciding on a major.'),
  ('southern-scholars', 'Southern Scholars Award', 'Magnolia Community Foundation', 'Regional',
   6000, '2027-01-31', 3.0, '{"Any major"}', '{"South"}',
   'For high-school seniors from the South, whether they stay close to home for college or head somewhere new.',
   'Graduating high-school seniors who live in a Southern state. Any intended major.'),
  ('harbor-light', 'Harbor Light Service Scholarship', 'Harbor Light Foundation', 'Community Service',
   5000, '2026-12-01', 2.8, '{"Any major"}', '{"Northeast"}',
   'For high-school seniors in the Northeast who give their time to their community.',
   'Graduating high-school seniors in a Northeastern state with at least 50 hours of volunteer service.'),
  ('heartland-rising', 'Heartland Rising Scholarship', 'Heartland Futures Fund', 'Opportunity',
   4500, '2027-01-15', 2.7, '{"Any major"}', '{"Midwest"}',
   'For Midwest high-school seniors who work a part-time job while keeping up with school.',
   'Graduating high-school seniors in a Midwestern state who have worked part-time during high school.')
on conflict (id) do nothing;
