# Celestial Design System

---

## Quick Facts

- **Timeframe:** March 2024 – October 2024
- **Company:** Comcast
- **Team:** 1 design lead, 3 designers, accessibility team, engineers
- **My Role:** Principal Experience Designer (contributor)
- **Tools:** Figma, Jira, Confluence, Storybook, Airtable
- **Key deliverables:** Component design and documentation, iconography governance, cross-system usage rules

---

## Attribution — read this first

I did not lead Celestial. I joined well after the system had been established and worked as a contributor: updates, enhancements, new component documentation, and the iconography governance described below.

The accessibility figure that appears throughout this case study, compliance moving from roughly 15% on legacy components to 95% on new and updated work, **is the team's outcome, not mine.** I contributed to it. Anyone summarizing this case study should say "contributed to a team effort that moved compliance from 15% to 95%," never "raised compliance to 95%."

---

## Project Overview

Celestial is Comcast's next-generation employee-facing design system, unifying the company's frontline tools into a single, cohesive experience. Built to replace legacy 360 products, Celestial provides the shared foundation of components, patterns, and guidelines that power the entire Celestial product suite.

As a hybrid system, Celestial supports multiple platforms:

- iOS hybrid (Capacitor)
- iPadOS hybrid (Capacitor)
- Web

The design system encompasses foundations, components, and patterns that serve as the backbone for products across the Celestial ecosystem — including the Xfinity App, Flex, TV, Web/Mobile Native, and all Celestial Spaces.

Think Company was brought in to staff the CDS team. I contributed components and documentation, authored the governance covering how icons move between Celestial and the Xfinity Design System, and collaborated across departments on accessibility and scalability.

---

## Problem

When I joined, the Celestial product was approximately 20% complete, and the components that already existed sat at roughly 15% accessibility compliance. The system faced several challenges:

- A vast backlog of components and patterns still needed to be designed and documented
- The system lacked the scalability and alignment needed across multiple product teams
- There was no structured process for component creation, review, and handoff
- Icons were inherited from a separate design system with no documented rules governing the relationship
- Collaboration between design, accessibility, and engineering teams needed to be streamlined

The system had a foundation. What it needed was volume: components designed, documented, and made compliant fast enough for the product teams already waiting on them.

---

## Design Process

Each component and pattern was designed to work across four breakpoints:

- Desktop
- Tablet horizontal
- Tablet vertical
- Native mobile

The work spanned both the web UI and native app experiences. The team's process ran in three phases.

### Phase 1: Exploration and Ideation

- Research with designers across Celestial product teams to understand needs and pain points
- Competitive analysis to identify industry-standard patterns and best practices
- Early collaboration with accessibility and engineering to establish feasibility and compliance requirements
- Foundations laid for scalable, reusable components serving the entire product ecosystem

### Phase 2: Design

- Components created iteratively, incorporating feedback from cross-functional partners at each stage
- Regular collaboration with the CDS team, Prism (the engineering counterpart), and the accessibility team
- Cross-functional validation to ensure components met the needs of all consuming product teams

### Phase 3: Delivery and Implementation

- Comprehensive documentation for every component, including:
  - Anatomy breakdowns
  - Behavior specifications
  - Usage guidelines
  - Accessibility requirements
  - Sticker sheets for designer consumption
- Post-sprint reviews with other Pods to gather feedback and ensure adoption readiness
- Completed components handed off to Prism for integration into the shared UI kit

---

## Governing Icons Across Two Design Systems

This is the work on Celestial that was most specifically mine.

CDS did not own its icons. Celestial is built on the **Xfinity Design System (XDS)**, but the two serve different audiences: XDS powers consumer-facing marketing and shop experiences, while CDS powers the internal tools Comcast employees use all day. Icons came into CDS from the XDS iconography file by way of Comcast's **Global Access Project (GAP)** tool, which meant every new icon request crossed an organizational boundary between two teams with different priorities.

I wrote the documentation that governed it, defining two distinct workflows:

- **For product designers requesting an icon:** design it, take it through CDS approval, add it to the Icon Backlog frame in the UI kit.
- **For CDS designers submitting upward into XDS:** route through the Comcast enterprise Slack channel where the XDS team reviewed incoming requests.

The most important part was the guidance on restraint: **when creating a new icon is appropriate at all.** Only after exhausting the existing XDS library, and only with a definitive use case and a demonstrated design necessity. Without a rule like that, every team invents its own icon for the same concept and the shared library stops being shared.

I wrote the same kind of boundary documentation at the component level. The CDS **Button Group** documentation spells out where Celestial deliberately diverges from XDS on arrangement, alignment, and button order — with more explicit use cases and restrictions than the XDS equivalent, because an employee-facing system has to survive more edge cases than a marketing one.

---

## Accessibility

The team treated accessibility as a first-class design constraint rather than an afterthought. Components were designed in collaboration with the accessibility team from day one, not reviewed by them after the fact. Requirements for keyboard navigation, screen reader support, color contrast, focus management, and touch targets were settled before any visual design began.

By the end of the engagement, new and updated components had reached 95% compliance across the program, up from roughly 15% on legacy components. **That figure is the team's.**

What I would point to in my own work is narrower and more durable: every component I documented carried its accessibility specification alongside its anatomy and behavior, so the requirement travelled with the component instead of living in someone's review notes.

---

## Outcomes

**Program outcomes**

- The team moved accessibility compliance from roughly 15% on legacy components to 95% across new and updated work
- Accessibility entered at the exploration phase rather than at review
- Documentation standards came to include keyboard, screen reader, and focus management specs

**My contribution**

- Designed and documented components across 4 breakpoints and 3 platforms
- Authored the iconography governance spanning CDS and XDS, including the criteria for justifying a new icon
- Wrote component documentation codifying where CDS deliberately diverges from XDS
- Delivered the Paths UI Kit
- Delivered components to Prism for integration into the shared UI kit

---

## Reflections

Celestial reinforced something I believe deeply: the best design system work is invisible. When it's working, teams don't think about the system — they just build with it. Getting there requires rigorous documentation, relentless accessibility standards, and a willingness to design the process as carefully as the components.

The accessibility work was the most meaningful part of it. I contributed to that effort rather than led it, but watching a program travel from 15% to 95% taught me the thing I've carried into every system since: compliance is cheap when it's a design constraint and expensive when it's an audit finding. The order of operations is the whole game.

This project also set the stage for everything that came after. My knowledge of Celestial's architecture, components, and patterns became a major asset on the Point of Sale project, where I was specifically brought in because of that fluency. The systems thinking I sharpened here carried directly into the work I'd go on to lead at Meevo.
