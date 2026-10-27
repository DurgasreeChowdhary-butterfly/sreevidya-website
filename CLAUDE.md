\# Abhyasana School Site

Stack: plain HTML/CSS/JS, no build, no frameworks. Mobile-first (primary), then 768/1024/1280.

Ref image: design/reference.png (view ONLY if I say "check ref"). Never imitate any other site.



\## Tokens (css/base.css :root)

navy #0F2A55 | orange #F47B20 | cream #FFF6EC | peach gradient cream→#FFE9D2 | white cards | text #1B2A41 | muted #5F6B7A

Headings: Playfair Display (serif, 700; one italic orange accent word). Body: Poppins/Inter.

Cards: radius 16-20px, soft shadow, white. Buttons: pill; primary orange, secondary outlined navy.

Soft peach wave shape behind hero/inner heroes. Line icons (inline SVG, navy/orange).



\## Structure

css/base.css (tokens, reset, header, footer, buttons, cards), css/home.css, css/page.css

js/main.js (menu, reveal, counters, carousels). data/branches.js (5 branches).

Shared header/footer injected by js/layout.js from one source (no duplication).

Pages: index, about, branches, branch (?b=slug template), academics, campus-life, facilities, contact.



\## Nav

Home | About▾ (Our Story, Vision \& Mission, Leadership) | Branches▾ (Overview + 5) | Academics▾ (Curriculum, Programs, Assessment) | Campus Life▾ (Sports, Arts \& Creativity, Clubs, Events, Community) | Facilities▾ (Infrastructure, Labs, Library, Safety \& Care) | Contact▾ (Get in Touch, Locate a Campus, Enquiry)

Header: logo left, sticky white, orange "Admissions" pill. Mobile: hamburger + accordion + bottom Call/Enquire bar.



\## Branches

Serilingampally, Attapur (Hyderabad); Kothagudem, Palvancha, Bhadrachalam (Telangana).

Stats: 14,000+ Students, 920+ Educators, 5 Branches, 5.25L+ sq ft, 34 Years.



\## Rules

Placeholder images: img/ with descriptive filenames, object-fit cover, loading=lazy, alt text. No lorem ipsum; short real copy. Subtle scroll reveals + counters only; respect prefers-reduced-motion. Keep files small; don't rewrite files wholesale, edit in place. Reply with a 3-line summary only.

