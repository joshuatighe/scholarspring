-- The six scholarships from the original demo. Safe to run more than once.
insert into public.scholarships
  (id, name, provider, category, amount, deadline, min_gpa, majors, regions, description, eligibility)
values
  ('stem-forward', 'STEM Forward Scholarship', 'Bright Futures Foundation', 'STEM & Innovation',
   10000, '2026-04-30', 3.2, '{"Computer Science","Environmental Science"}', '{"National"}',
   'For curious students using science and technology to create a more equitable, sustainable future.',
   'Current high-school seniors or undergraduate students pursuing a STEM degree.'),
  ('green-future', 'Green Future Fellowship', 'Earthwell Initiative', 'Environment',
   7500, '2026-05-15', 3.0, '{"Environmental Science","Any major"}', '{"West","National"}',
   'Supporting students with a passion for protecting our planet and strengthening local communities.',
   'Students with a demonstrated interest in environmental stewardship or climate solutions.'),
  ('first-gen', 'First Generation Promise', 'The Northstar Fund', 'Opportunity',
   5000, '2026-06-01', 2.8, '{"Any major"}', '{"Midwest","National"}',
   'A little momentum can change everything. This award helps first-generation students take their next step.',
   'First-generation college students enrolled at an accredited institution.'),
  ('future-teachers', 'Future Teachers Award', 'Learnwell Foundation', 'Education',
   8000, '2026-06-20', 3.0, '{"Education"}', '{"National"}',
   'Investing in the thoughtful, dedicated people who will shape the next generation of learners.',
   'Students pursuing teaching certification or an education-related degree.'),
  ('creative-voice', 'Creative Voice Scholarship', 'Mosaic Arts Council', 'Arts & Design',
   4000, '2026-07-10', 2.5, '{"Arts & Design","Any major"}', '{"West","Northeast","National"}',
   'Your perspective matters. Share the work that makes you see the world differently.',
   'Emerging creators in visual art, design, film, music, or creative writing.'),
  ('women-build', 'Women Who Build', 'Forge Ventures', 'Leadership',
   12000, '2026-08-01', 3.5, '{"Computer Science","Business","Any major"}', '{"National"}',
   'For women and nonbinary students turning bold ideas into companies, products, and movements.',
   'Women and nonbinary undergraduate students demonstrating leadership and initiative.')
on conflict (id) do nothing;
