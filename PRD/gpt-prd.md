**Product Requirements Document (PRD)**
**Product:** IMPACT POST – Digital-First Community Media Platform
**Version:** v1.0 (Website MVP)

---

## 1. Product Overview

**1.1 Purpose**

Build a modern, digital-first media website for **IMPACT POST** that:

* Amplifies stories and voices of equity-deserving communities.
* Showcases youth creators and community leaders.
* Serves as a hub for news, resources, events, and opportunities.
* Supports long-term sustainability via advertising, sponsorships, and memberships.

The site should feel **premium, welcoming, and community-centered**, with a strong focus on storytelling, multimedia, and accessibility—similar in polish to mission-driven newsrooms like **The 19th News**, **Prism**, and **Blavity** which clearly foreground mission, topic navigation, and newsletter/community calls-to-action. ([19thnews.org][1])

---

## 2. Objectives & Success Metrics

**2.1 Business & Mission Objectives**

1. **Amplify Equity-Deserving Voices**
   Publish high-quality journalism and storytelling centred on equity-deserving communities.

2. **Build a Leading Digital Hub**
   Position IMPACT POST as a go-to destination for community-focused news, features, and multimedia.

3. **Empower Youth & Emerging Talent**
   Provide visible space and clear onboarding for youth contributors and emerging creators.

4. **Strengthen Community Partnerships**
   Make it easy for partners, sponsors, and advertisers to discover collaboration opportunities.

5. **Support Sustainability**
   Prepare the platform for diversified revenue (ads, sponsorships, memberships, government campaigns, events).

**2.2 Measurable KPIs (for analytics setup)**

* Monthly Unique Visitors
* Average Time On Page & Pages per Session
* Newsletter Sign-ups per month
* Number of “Pitch a Story / Become a Creator” submissions
* Number of advertiser/partner inquiries
* Event registrations (when events are live)

---

## 3. Target Users & Personas

1. **Community Readers (General)**

   * Adults from equity-deserving communities.
   * Needs: trustworthy, relatable news; features on people like them; easy navigation and readability.

2. **Youth & Emerging Creators**

   * Teens & young adults interested in writing, video, photography, or design.
   * Needs: simple way to submit work, understand expectations, and see their work showcased.

3. **Families & Newcomers**

   * Parents, caregivers, and newcomers seeking resources.
   * Needs: practical guides, family & wellness articles, settlement and education resources.

4. **Community Leaders & Organizations**

   * Nonprofits, community groups, activists, schools.
   * Needs: visibility for initiatives, events promotion, partnership options.

5. **Entrepreneurs & Local Businesses**

   * Owners of community-based businesses.
   * Needs: advertising opportunities, feature stories, sponsorship options, media kit.

6. **Advertisers / Sponsors / Government Campaign Leads**

   * Agencies and organizations seeking to reach these audiences.
   * Needs: clear “Advertise / Sponsor” information and contact funnel.

7. **Internal Users (Editorial Team)**

   * Editors, staff journalists, youth program coordinators.
   * Needs: simple CMS, workflows for editing and publishing, tagging, and media management.

---

## 4. Scope

### 4.1 In Scope (MVP Website)

* Public website (desktop + mobile responsive).
* CMS for managing articles, multimedia, events, print issues, and static pages.
* Newsletter signup and contact/partner forms.
* Initial advertising and sponsorship-ready layout (placed but simple).

### 4.2 Out of Scope (Future)

* Native mobile apps.
* Full paywall or membership billing system.
* Complex community forums / social network features.
* Advanced personalization (recommendations based on user accounts).

---

## 5. Information Architecture & Sitemap

### 5.1 Top-Level Navigation (Desktop)

* **Home**
* **Community Voices**
* **Youth & Leadership**
* **Business & Entrepreneurship**
* **Culture & Identity**
* **Family & Wellness**
* **Issues & Solutions**
* **Multimedia** (Videos/Podcasts)
* **Events**
* **About**
* **Get Involved** (dropdown: Pitch a Story, Become a Creator, Partner/Advertise, Careers/Volunteer)
* **Newsletter** (CTA button in header)

On mobile: collapsible menu with prominent “Newsletter” and “Pitch a Story” buttons.

### 5.2 Key Page Types

1. **Home Page**

   * Hero: featured story (large image, headline, brief deck).
   * “Voices of Strength. Stories of Impact.” tagline option near top.
   * Row of **latest stories** across pillars.
   * Highlight strip: **Youth & Leadership** latest 3 stories.
   * Section for **Community Voices** profiles.
   * Carousel or grid of **multimedia** (videos, audio).
   * Block for **Upcoming Events** (if any).
   * **Newsletter signup** with short value proposition.
   * Partner spotlight / sponsor banner position.
   * Footer: navigation, social links, privacy, editorial guidelines, contact.

2. **Content Pillar Landing Pages**
   For each of the 6 pillars (Community Voices, Youth & Leadership, etc.):

   * Intro paragraph explaining the pillar.
   * Featured story at top.
   * Article list with filters (Format, Topic tags, Date, Location).
   * Sidebar: related newsletter or event, call-to-action for pitches.

3. **Article / Story Page Template**

   * Elements:

     * Headline, subheadline.
     * Author name & bio snippet (with link to author page).
     * Publication date and estimated read time.
     * Lead image / multimedia embed.
     * Body text with pull quotes and inline images.
     * Tags: pillar, topics, location, audience (e.g., youth, families).
     * Sharing buttons (X/Twitter, Facebook, LinkedIn, email).
     * “Support IMPACT POST” or “Subscribe to Newsletter” CTA after article.
     * Related stories section (by pillar / tags).
   * Accessibility: good contrast, large font, optional text size toggles if feasible.

4. **Multimedia Hub**

   * Grid of videos, podcasts, and short clips.
   * Filters: Format (video, audio, photo story), Pillar, Topic.
   * Capability to embed content from YouTube, Vimeo, etc. (similar to The 19th and Blavity which heavily use video across their digital channels). ([YouTube][2])

5. **Events Page**

   * List of upcoming and past events: workshops, storytelling forums, community gatherings.
   * Each event card: title, date/time, location or virtual link, short description, registration link (external or embedded).
   * Event detail page with richer description and share buttons.

6. **Print Edition Archive**

   * Grid of quarterly print covers.
   * Each issue page: cover image, short editorial note, highlight stories (linking back to online versions), downloadable PDF (if provided), purchase/ordering info (future).

7. **About Page**

   * Vision, Mission, Values (summarized and web-ready).
   * Team bios and photos (optional phase 2).
   * Advisory board / partners logos.
   * Link to **Editorial Guidelines** page.

8. **Editorial Guidelines Page**

   * High-level editorial purpose, content pillars, ethics, and representation standards.
   * Short, clear language for contributors and readers.

9. **Get Involved Hub**

   * Subpages:

     * **Pitch a Story** – form for community members.
     * **Become a Youth Creator** – info on youth opportunities plus application form.
     * **Partner / Advertise** – overview of collaboration types, audience stats, contact form, media kit download.
     * **Careers / Volunteer** – listing of openings.

10. **Resource Library (Family & Wellness / Newcomer Resources)**

    * Catalog of guides, resource links, and PDFs.
    * Filters: group (families, newcomers, youth, organizations), topic (mental health, education, settlement, etc.).

11. **Contact Page**

    * Contact form (general inquiries).
    * Email addresses by category (editorial, partnerships).
    * Social links.

12. **Utility Pages**

    * Privacy Policy
    * Terms of Use
    * Cookie Notice
    * 404 page with helpful links.

---

## 6. Functional Requirements

### 6.1 Content Management System (CMS)

**CMS Goals**

* Easy for non-technical staff to create/edit content.
* Support multiple content types and taxonomies.
* Provide editorial workflow and role-based permissions (inspired by best practices of professional newsrooms). ([19thnews.org][3])

**Content Types**

1. **Article** (standard news/feature)
2. **Profile / Community Story** (structured fields for person/org)
3. **Youth Feature** (tagged content type or sub-type of article)
4. **Multimedia Item** (video, podcast, photo essay)
5. **Event**
6. **Resource** (guide/tool/resource entry)
7. **Print Issue**
8. **Static Page** (About, Guidelines, etc.)

**Core Fields (for Article-Type items)**

* Title
* Subtitle / Deck
* Slug (auto-generated editable URL)
* Hero Image + alt text
* Body (rich text, headings, pull quotes, embeds)
* Content Pillar (mandatory; 1–2 max)
* Tags (topics, location, audience)
* Author (relation to “Author” entity)
* Publish Date & Time
* Status: Draft, In Review, Scheduled, Published
* SEO fields: meta title, description, social image override

**Roles & Permissions**

* **Admin:** full control, user management.
* **Editor:** create/edit/publish all content, approve contributors.
* **Staff Writer:** create/edit their own content, submit for review.
* **Contributor / Youth Creator:** limited access to submit drafts only; cannot publish.

**Workflow**

* Contributor creates draft → Editor reviews → Approve/reject with comments → Publish or schedule.

### 6.2 Front-End / UX

**General**

* Fully responsive design for mobile, tablet, desktop.
* Intuitive navigation, modern typography, and strong use of imagery.
* Clean, uncluttered layouts similar to The 19th and Prism, which prioritize readability, white space, and strong photography. ([19thnews.org][1])

**Search & Discovery**

* Site-wide search bar (header on desktop, icon on mobile).
* Results page with filters by content type, pillar, date.
* Related stories algorithm using tags/pillars.

**Newsletter & Lead Capture**

* Global **newsletter signup** modules:

  * In footer.
  * On homepage (prominent).
  * Inline after article body (before related stories).
* Simple form: first name (optional) + email + consent checkbox.

**Social & Sharing**

* Social handles in header/footer.
* Share buttons on article pages (X, Facebook, LinkedIn, email; more optional).

### 6.3 Engagement & Community

* **Pitch a Story Form**

  * Fields: name, email, community/organization, story idea description, topic/pillar selection, file upload (optional), consent checkbox.
  * Routes to designated editorial email.

* **Youth Creator Application**

  * Similar form, plus age range, area of interest (writing, video, photography, design), sample work link or upload.

* **Feedback Widget (Optional MVP)**

  * Simple “Was this story helpful/important?” with emoji or thumbs up/down.
  * Store aggregated count per article in analytics or simple DB table.

* **Comments** (Priority: Low/optional due to moderation overhead)

  * If implemented, must include anti-abuse tools (spam filter, approval queue).

### 6.4 Monetization & Partnerships

* **Ad placements** configurable in CMS:

  * Homepage banner position.
  * Sidebar / in-article blocks (top, middle, bottom).
  * Labels for sponsored content (“Sponsored” or “Partner Content”) following journalistic standards (e.g., as used by many nonprofit newsrooms for transparency). ([19thnews.org][3])

* **Partner / Advertise Page**

  * Audience overview, reach highlights, community focus.
  * Example placements (screenshots/mockups).
  * Downloadable media kit PDF.
  * Contact form for campaign inquiries.

* **Membership / Donate (Future)**

  * Support page explaining ways to support (donation, membership, sponsorship).
  * For MVP: link to external donation platform if available.

### 6.5 Events & Print

* CMS support for **Events** (title, date/time, location, description, registration link, tags).
* Public events listing page and detail template.
* **Print issue** content type for archiving quarterly magazines with ability to attach PDF and highlight top stories.

---

## 7. Non-Functional Requirements

1. **Accessibility**

   * Target **WCAG 2.1 AA**:

     * Keyboard navigable.
     * Proper heading structure.
     * Sufficient color contrast.
     * Alt text on images.
     * ARIA labels for interactive elements.

2. **Performance**

   * Optimized images (lazy loading, responsive sizes).
   * Lighthouse performance score target: **≥ 85** on mobile/desktop.

3. **SEO**

   * Clean semantic HTML.
   * Descriptive meta tags.
   * Open Graph & Twitter card data.
   * Human-readable URLs.

4. **Security & Privacy**

   * HTTPS everywhere.
   * Form submissions protected against spam (basic CAPTCHA or equivalent).
   * Privacy policy and cookie notice.

5. **Scalability**

   * Architecture should support increased content volume, traffic spikes (e.g., viral stories, events).

---

## 8. Integrations

* **Email / Newsletter Provider** (e.g., Mailchimp, ConvertKit, or similar)

  * API integration for subscription lists & segmented audiences (Youth, Families, Business, General).

* **Analytics**

  * Google Analytics 4 or privacy-oriented alternative (e.g., Plausible, Matomo).
  * Event tracking for newsletter signup, pitch submissions, partner form submissions.

* **Multimedia Hosting**

  * Embed YouTube/Vimeo/Podcast hosting links.
  * Ensure embed responsiveness.

---

## 9. Content Strategy Alignment (with Client’s Pillars)

Each content pillar will have:

* Landing page, curated hero story, and pillar-specific description.
* Tagging rules in CMS to maintain consistency.
* Example mapping:

1. **Community Voices** – profiles, lived experience essays.
2. **Youth & Leadership** – youth stories, leadership programs, opportunities.
3. **Business & Entrepreneurship** – features on community-based businesses.
4. **Culture & Identity** – arts, heritage, creative expression.
5. **Family & Wellness** – mental health, education, parenting, newcomer resources.
6. **Issues & Solutions** – systemic challenges, solution-oriented journalism.

---

## 10. Admin & Operations Requirements

* Simple dashboard with:

  * View of recent articles and drafts.
  * Quick links: “Create Article”, “Create Multimedia”, “Create Event”.
* Media library:

  * Browse images, videos, documents.
  * Support for folders or tags (by issue, event, campaign).
* Backups:

  * Regular automated backups of database and media.

---

## 11. Recommended Feature Additions & Priorities

Below are suggested features categorized by **High / Medium / Low** priority for the developer roadmap.

### High Priority (MVP – must have)

1. **Responsive Website & Core Pages**

   * Home, Pillar pages, Article templates, About, Editorial Guidelines, Contact.

2. **CMS with Editorial Workflow**

   * Content types (article, multimedia, event, resource, print issue).
   * Roles: Admin, Editor, Writer, Contributor/Youth.

3. **Search & Tagging**

   * Site-wide search and standard taxonomy (pillars + tags).

4. **Newsletter Integration**

   * Signup blocks across the site, connected to email provider.

5. **Pitch a Story & Youth Creator Forms**

   * Forms + email notifications.

6. **Events Listing**

   * Upcoming events with event detail pages.

7. **Print Issue Archive**

   * Issue covers & detail pages.

8. **Basic Ad/Sponsor Slots**

   * Configurable banner + sidebar/in-article ad spaces, with clear “Sponsored” labelling.

9. **Accessibility & Performance Baseline**

   * WCAG 2.1 AA minded design, image optimization, caching.

10. **Analytics Integration**

    * Pageview tracking, signup conversion tracking.

### Medium Priority (Phase 2 – enhance engagement & depth)

1. **Resource Library**

   * Filterable database of family/newcomer resources and toolkits.

2. **Author Pages**

   * Bios and list of articles for each writer / youth creator.

3. **Topic / Tag Hubs**

   * Landing pages for key recurring topics (e.g., mental health, immigration, entrepreneurship).

4. **Support / Donate Page**

   * Even if pointing to external donation platform.

5. **In-Article Feedback (“Was this helpful?”)**

   * Simple engagement metric.

6. **Event Registration Tracking**

   * Simple attendee list or integration with event platforms (Eventbrite, etc.).

7. **Newsletter Segmentation**

   * Distinct lists for Youth, Families, Business, General.

8. **Press / Media Page**

   * Press releases and coverage about IMPACT POST.

### Low Priority (Phase 3 – advanced / experimental)

1. **User Accounts**

   * Ability for users to create profiles, save articles.

2. **Community Forum / Discussion Boards**

   * Requires moderation guidelines & staffing.

3. **Membership / Subscription System**

   * Tiered memberships with perks (behind-the-scenes content, early event access).

4. **Dark Mode Toggle**

   * Optional theme for nighttime reading.

5. **Audio Read-Aloud**

   * Auto-generated or recorded audio versions of key articles for accessibility.

6. **Interactive Maps & Data Visualizations**

   * For stories tied to geography or data-heavy topics.

7. **Progressive Web App (PWA)**

   * Installable web app with offline reading of saved stories.

---

If you’d like, I can next:

* Turn this PRD into a **one-page developer brief** (simplified)
* Or design a **sample homepage wireframe** (section by section) that you can hand to a designer or no-code builder.

[1]: https://19thnews.org/?utm_source=chatgpt.com "The 19th News | An independent, nonprofit newsroom."
[2]: https://www.youtube.com/%4019thNews?utm_source=chatgpt.com "The 19th"
[3]: https://19thnews.org/about-us/?utm_source=chatgpt.com "About The 19th"
