# Genal MR
## Describe your changes
>
## User Story ID and link
- User Story ID:
- Issue Link:
## Checklist before requesting a review
- [ ] I have pulled and merged the master branch into my feature branch
- [ ] I have performed a self-review of my code
- [ ] The code is properly formatted
- [ ] The feature is fully finished and ready for review
- [ ] This MR is targeting the developer branch
- [ ] I have removed all debug code and console logs
- [ ] I have created an entry to the wiki about this feature

- [ ] If it is a core feature, I have added thorough tests. (if applicable)
- [ ] The added tests are passing (if applicable)

---
# Frontend Specific
## Perceivable
- [ ] All media (audio, video) have comprehensible subtitles
- [ ] All animations are controllable via `prefers-reduced-motion`
- [ ] All form fields have visible labels

## Layout and Information Hierarchy
- [ ] I have ensured the layout is responsive
    - [ ] Content is usable at 200% and 400% zoom (WCAG 1.4.4, Level AA)
    - [ ] No horizontal scrolling at a viewport width of 320 CSS pixels (WCAG 1.4.10, Level AA)
    - [ ] Touch targets are at least 44×44px (WCAG 2.5.8)
- [ ] Each page/section has a clear primary purpose
- [ ] The visual hierarchy supports the semantic hierarchy
- [ ] Spacing and grouping are used to aid orientation

## Colors
- [ ] I have checked text and UI elements for sufficient contrast
- [ ] No information is conveyed through color alone

## Fonts / Text
- [ ] I have tested typography for scalability (as with layout at 200%–400%)
- [ ] Fonts used are sans-serif
- [ ] Letters and numbers are clearly distinguishable in the chosen font
- [ ] Fonts used are not italic
- [ ] NO LONG TEXTS IN ALL CAPS LIKE THIS
- [ ] Long texts are left-aligned for better readability
- [ ] Semantic emphasis (bold, italic) is used deliberately and sparingly
- [ ] For hyperlinks, the link text itself carries the information
- [ ] The chosen font is easy and fluid to read

## Images
- [ ] All images have meaningful alt text
- [ ] All images have appropriate fallbacks

## Operable
- [ ] All functionality is accessible without a mouse
- [ ] The keyboard focus order follows the visual and content logic
- [ ] There are no keyboard traps in menus, dialogs, or widgets
- [ ] Skip links and landmarks are implemented for faster keyboard navigation
- [ ] A visible focus indicator is present on all interactive elements → focus indicator: at least 2px wide, contrast 3:1 against background (WCAG 2.4.13)
- [ ] All implemented click/touch targets are at least 44×44px
- [ ] There are no unnecessary time limits or auto-redirects

## Understandable
- [ ] Simple and direct language is used
- [ ] The heading hierarchy is clear and consistent
- [ ] Clear labels are used — no vague labels or placeholders
- [ ] Consistent behavior: same actions → same patterns
- [ ] I have implemented precise, understandable error messages with resolution hints
- [ ] Error texts are placed close to the field and visually highlighted
- [ ] Error texts are descriptive and specific
- [ ] Error texts include an actionable instruction
- [ ] ARIA attributes are used — ARIA tells screen readers what elements are (important for complex UI elements): "This is a menu," "This button is currently expanded," "This field is required"
- [ ] When multiple errors occur in a form → an error summary at the top of the form with anchor links to the fields
- [ ] Status messages (success/error) are announced to screen readers
- [ ] Live validation is subtle and not overly aggressive (show error messages in a way that helps without being annoying or stressful)

## Robust
- [ ] Semantic structure is implemented as the foundation for assistive technologies — semantic role = Is this a button, a link, a heading?