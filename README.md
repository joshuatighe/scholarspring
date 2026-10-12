# ScholarSpring

ScholarSpring is a frontend-only scholarship discovery app built for Homework 05. It is based on the interview findings in `Requirements gathering.docx`: students can search scholarships by name, create a profile with username/password, GPA, intended major, and preferred region, receive profile-informed results, and save scholarships.

## Run locally

No build step or dependency installation is required. From this folder, run:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000> in a browser. A local server is recommended because it mirrors how the submitted demo is served and avoids browser restrictions around local files.

## Demo workflow

1. Browse or search the seeded scholarships while logged out.
2. Select **Create a free profile** and enter any username, a six-character password, GPA from 0–4, major, and region.
3. Return to the results to see the profile tip and use the filters to explore matches.
4. Select a scholarship for details and save it.
5. Open **Saved** in the navigation to see saved opportunities. Refreshing the page preserves the demo state through `localStorage`.

## Files

- `index.html` — accessible page structure and dialogs.
- `styles.css` — responsive visual design.
- `app.js` — seeded data, filtering, profile flow, details, and localStorage persistence.
- `HW05-reflection.md` — requirements, interview findings, vibe-coding reflection, workflow, and cost estimates.
