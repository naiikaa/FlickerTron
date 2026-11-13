---
name: FlickerTron
description: A cyanotype blueprint of Urza's machine; the Pauper deck drafted as a power plant whose lines run like circuits.
colors:
  ink-0: "#032447"
  ink-1: "#06335f"
  ink-2: "#0b3f72"
  ink-3: "#17508a"
  ink-4: "#2a66a6"
  chalk: "#eef5ff"
  chalk-2: "#b6cdea"
  chalk-3: "#8fadd3"
  chalk-4: "#5d7ea8"
  rule: "rgba(208,228,255,.16)"
  rule-2: "rgba(208,228,255,.34)"
  grid-minor: "rgba(150,195,255,.05)"
  grid-major: "rgba(150,195,255,.095)"
  arc: "#7fe7ff"
  arc-hot: "#e8fcff"
  arc-ink: "#02233a"
  volt: "#ffd447"
  volt-hot: "#fff3bf"
  volt-ink: "#1b1404"
  red: "#ff7b67"
typography:
  display:
    fontFamily: "'osifont', 'Archivo', sans-serif"
    fontSize: "clamp(56px, 7.6vw, 96px)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "0.015em"
  headline:
    fontFamily: "'osifont', 'Archivo', sans-serif"
    fontSize: "clamp(38px, 4.6vw, 62px)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "0.01em"
  title:
    fontFamily: "'osifont', 'Archivo', sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "0.03em"
  body:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "tnum"
  label:
    fontFamily: "'osifont', 'Archivo', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.12em"
  numeral:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontWeight: 800
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
    fontVariation: "'wdth' 125"
rounded:
  hairline: "2px"
  zone: "3px"
  card: "4.6% / 3.4%"
  lamp: "50%"
spacing:
  grid-minor: "24px"
  grid-major: "120px"
  section: "124px"
  column-gap: "56px"
  control-gap: "10px"
components:
  button:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.hairline}"
    padding: "12px 20px"
    height: "46px"
    typography: "{typography.label}"
  button-hover:
    textColor: "{colors.arc-hot}"
  button-live:
    backgroundColor: "{colors.volt}"
    textColor: "{colors.volt-ink}"
  button-live-hover:
    backgroundColor: "{colors.volt-hot}"
  segment-selected:
    backgroundColor: "{colors.arc}"
    textColor: "{colors.arc-ink}"
    rounded: "{rounded.hairline}"
    padding: "10px 16px 9px"
    height: "44px"
  plate:
    backgroundColor: "{colors.arc}"
    textColor: "{colors.arc-ink}"
    rounded: "{rounded.hairline}"
    padding: "9px 12px 8px"
  tag-owner:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink-0}"
    rounded: "{rounded.hairline}"
    padding: "5px 9px 4px"
  rail:
    backgroundColor: "{colors.ink-0}"
    textColor: "{colors.chalk-3}"
    width: "248px"
  lamp:
    backgroundColor: "{colors.ink-0}"
    rounded: "{rounded.lamp}"
    size: "14px"
  lamp-on:
    backgroundColor: "{colors.arc}"
---

# Design System: FlickerTron

## Overview

**Creative North Star: "Urza's Machine"**

The page is a cyanotype drawing sheet. A Prussian-blue ground carries a two-level drafting grid, white linework and ISO 3098 technical lettering. The deck is drawn as a power plant: the three Tron lands are generators wired to a bus, mana is voltage read off a drafted voltmeter, and every line is a circuit the reader watches run card by card. Light is a material: cyan arc light only appears where current flows.

Density is that of an engineering drawing. Hairline rules, ruler-ticked sheet edges, dashed zone outlines, title blocks, parts lists and revision blocks do the structural work that boxed panels would do in a stock deck site. The real Scryfall cards are the only imagery; they lie flat on the sheet with a soft drop shadow and never get decorative frames.

Rejected: the clean corporate SaaS look and the stock dark deck site of boxed panels with one accent (PRODUCT.md brand commitment). The theme always yields to legibility of card text, costs and steps.

**Key Characteristics:**
- Drenched Prussian-blue ground with a native 24px / 120px drafting grid and faint paper noise.
- osifont technical lettering, always uppercase and tracked, over Archivo body text with tabular figures.
- Three signal hues with fixed meanings: cyan arc = powered/current, yellow volt = the primary action, redline = opponent and cuts.
- Hairline rules and dashed outlines instead of filled panels; 2px corners on every control.
- Leader-line annotations, a drafted voltmeter, parts list and revision block as signature drawing devices.

## Colors

Monochrome blueprint (inks and chalks of one blue hue) with three reserved signal colors that each mean exactly one thing.

### Primary
- **Arc Light** (arc): powered or current state only. The live wire and flowing bus, lit lamps, the current rail section, the gauge fill, the active step tick, selected segments and line picks, the current step plate, changed HUD readouts, focus rings, text selection.
- **Arc White-Hot** (arc-hot): the brightest point of current: flow dashes, the gauge needle, live nodes, link and row hover text, the final step plate.
- **Arc Ink** (arc-ink): text set on arc fills.

### Secondary
- **Live Volt** (volt): the one primary action button per view ("Run the infinite") and the skip link. Nothing else.
- **Volt Hot** (volt-hot): hover fill of the live button.
- **Volt Ink** (volt-ink): text on volt fills.

### Tertiary
- **Redline** (red): the opponent's zone, opponent cards and badges, mulligan verdicts, bottomed cards, cuts in the revision block and sideboard "out" counts.

### Neutral
- **Prussian Ink 0–4** (ink-0 … ink-4): ink-1 is the sheet; ink-0 is the deepest (rail, topbar, title-block cells, quantity flags, scrollbar track); ink-2 fills buttons and selects; ink-3 is unpowered track (wire, gauge arc, step ticks, HUD bars, setup plate); ink-4 is the scrollbar thumb.
- **Chalk 1–4** (chalk … chalk-4): chalk is primary linework and text; chalk-2 is body copy and ledes; chalk-3 is labels, table heads, leader lines; chalk-4 is unpowered/cold (dashed wires, dormant lamps, the cold needle, the title's dim second line).
- **Rules** (rule, rule-2): hairline dividers; rule-2 for header rules, control borders and dashed zones.
- **Grid** (grid-minor, grid-major): the drafting grid only.

### Named Rules
**The Current Rule.** Cyan arc means current is flowing or this is the current step. A surface that is not powered, live or selected never takes arc.

**The One Switch Rule.** Volt yellow belongs to the primary action button and the skip link. If a view has two volt buttons, one of them is wrong.

**The Redline Rule.** Red marks the opponent and removals (cuts, mulligans, bottomed cards, sideboard outs), never errors or emphasis.

**The Mark-Plus-Hue Rule.** State is carried by a mark as well as a color: lit lamp vs. hollow ring, solid vs. dashed wire, strikethrough on cuts, check/cross icons on verdicts.

## Typography

**Display Font:** osifont (with Archivo, sans-serif)
**Body Font:** Archivo (with system-ui, sans-serif)
**Label/Mono Font:** osifont for labels; Archivo at 125% width, weight 800, for numerals

**Character:** ISO technical lettering gives every heading and label the hand of a draftsman; Archivo keeps paragraphs readable, and its expanded heavy cut makes the numbers read like meter faces.

### Hierarchy
- **Display** (400, clamp(56px, 7.6vw, 96px), 0.9): the hero title only; second line dims to chalk-4 and lights to arc when Tron is assembled.
- **Headline** (400, clamp(38px, 4.6vw, 62px), 0.98): section headings under the ruler-ticked sheet edge.
- **Title** (400, 24px, 1.08): sub-headings; 19px in finder rows; line-title scales clamp(30px, 3.4vw, 44px).
- **Body** (400, 17px, 1.6; 16px under 820px): copy in chalk-2, ledes at 18–19px held to 46–68ch, captions at 15.5px.
- **Label** (400, 11–15px, 0.07–0.14em, uppercase): nav items, buttons, tags, table heads, zone names, units, title-block keys. Smaller labels track wider.
- **Numeral** (800, 125% width, tabular): voltmeter readout (clamp(52px, 5.6vw, 76px)), HUD readouts, tallies, quantities.

### Named Rules
**The Drafted Caps Rule.** osifont is always uppercase, weight 400 and positively tracked. Never bold it, never set it in sentence case.

**The Meter Figures Rule.** Every number that counts something is tabular Archivo at expanded width, never osifont.

## Layout

A fixed 248px left rail plus a centered sheet column (max 1220px, side padding clamp(20px, 4vw, 64px)). Sections open 124px apart (92px under 820px) under a ruler edge: a rule-2 hairline with minor ticks every 24px and major ticks every 120px, matching the background grid. Two-column compositions use a 56px gutter; control rows gap 10–12px.

The hero splits roughly 0.86fr / 1.14fr: title, lede, actions and a drawing title block on the left, the power-plant schematic and voltmeter on the right.

Breakpoints: at 1100px the hero and two-column studies stack; at 1000px the rail becomes an off-canvas drawer behind a 56px topbar with a scrim; at 820px pickers, facts, revision and parts blocks go single-column and the hand shows 4 across; at 560px phases stack, card grids go 2–3 across and spec tables reflow to grid rows.

**The Native Grid Rule.** The 24/120px drafting grid is the world's paper, not decoration; it stays on every surface and section rulers align to it.

## Elevation & Depth

The sheet is flat; depth is reserved for two things. Cards are physical objects lying on the drawing, so they carry a soft, dark, downward drop shadow and lift on hover. Current-state markers glow in arc light, and that glow always carries a small y-offset, as if cast onto the paper below. Panels, controls and tables have no shadow.

### Shadow Vocabulary
- **Card on sheet** (`box-shadow: 0 10px 20px -10px rgba(0,0,0,.9)`): rest state for every card image.
- **Card lifted** (`box-shadow: 0 22px 30px -14px rgba(0,0,0,.95), 0 8px 16px -8px rgba(0,0,0,.9)` with `translateY(-5px)`): card hover.
- **Arc lamp glow** (`box-shadow: 0 2px 10px 1px rgba(127,231,255,.55)`): the current rail lamp; `0 2px 8px` variants on lit hand lamps and the current step tick.
- **Live wire glow** (`filter: drop-shadow(0 2px 5px rgba(127,231,255,.55))`): powered wires in the schematic.
- **Hot card** (`box-shadow: 0 12px 26px -6px rgba(127,231,255,.6)` with a 2px arc outline): the card acting in the current step.
- **Zoom** (`box-shadow: 0 30px 60px -20px #000, 0 0 0 1px rgba(0,0,0,.4)`): hover card zoom.

### Named Rules
**The Cast Glow Rule.** Arc glow is limited to state markers (lamps, live wires, current tick, hot card) and always offset downward. Never glow text, buttons or containers.

## Shapes

Hairline geometry. Controls, tags, plates, flags and selects use 2px corners; zone outlines 3px; lamps and nodes are circles; cards keep their true printed radius (4.6% / 3.4%). Borders are 1px hairlines; dashed strokes mean "outline / not yet powered" (zones, unpowered wires, derived tags, the loop plate), solid strokes mean live or committed. Leader lines are a 1px rule ending in a 7px dot.

**The Dashed Outline Rule.** Board zones are dashed rule-2 outlines with the zone name set as a label above the outline, never inside a filled box. The opponent zone alone is a solid redline outline.

## Components

### Buttons
- **Shape:** near-square (2px), 46px tall, 1px rule-2 border.
- **Default:** ink-2 fill, chalk osifont label at 15px / 0.09em; icon 18px stroked.
- **Hover / Focus:** border goes arc, text arc-hot; press nudges 1px down; focus is a 2px arc outline at 3px offset.
- **Live (primary):** volt fill and border, volt-ink text, hover volt-hot. One per view.
- **Icon button:** 46×46 square. Disabled: 35% opacity.

### Chips (segments, tags, step plates)
- **Segments:** transparent with rule-2 border and chalk-2 label; selected fills arc with arc-ink text.
- **Source tags:** owner = chalk fill on ink-0; PauperBrews = solid chalk-2 outline; derived = dashed chalk-3 outline.
- **Step plates:** arc fill for the current step, ink-3 for setup, dashed arc outline for loop steps, arc-hot for the final step.

### Cards / Containers
- **Corner Style:** printed card radius (4.6% / 3.4%).
- **Background:** the card image itself; ink-2 while loading.
- **Shadow Strategy:** Card on sheet / Card lifted (see Elevation).
- **Border:** none; a quantity flag (ink-0, rule-2 border, 2px) hangs off the left edge, chalk-filled for +, redline for −.
- **Faded:** grayscale and dimmed for absent or bottomed cards.

### Inputs / Fields
- **Style:** the speed select matches buttons: 46px, ink-2, rule-2 border, 2px, osifont 14px.
- **Focus:** global 2px arc outline.

### Navigation
- **Rail:** ink-0 column with crest, a vertical ink-3 wire and lamp stops; the wire fills with arc down to the current section. Items are osifont 15px uppercase chalk-3; current is chalk with a lit, glowing lamp; passed sections show an arc ring with a dim core.
- **Mobile:** 56px ink-0 topbar with the current section name in arc; the rail slides in as a 272px drawer over a scrim.

### Voltmeter (signature)
A drafted 340px gauge: ink-3 arc track, arc fill, chalk tick marks (major ticks heavier), arc-hot needle easing 0.7s, Numeral readout in arc with an osifont unit. Cold state turns needle and readout chalk-4.

### Power-plant schematic (signature)
The three land cards are switches wired to a bus: dashed chalk-4 wires when off, solid arc with travelling arc-hot flow dashes when live. Notes attach by leader lines.

### Leader-line annotations (signature)
Annotations hang off a 14px hairline ending in a 7px dot, in chalk-3. Line-player badges hang below the acting card on an 18px leader in arc (redline for the opponent).

### Parts list and revision block (signature)
Lists render as drawing tables, not image grids: the 60 + 15 as a parts list (item no., qty, part in osifont caps, cost) with group rows; changes as a revision block where cuts are redline with a strikethrough. Rows reveal the card on hover.

### Title block
A ruled 3-column `dl` (2 under 560px) with 11px osifont keys and chalk values, framed by rule-2.

## Do's and Don'ts

### Do:
- **Do** keep the 24px / 120px drafting grid on the ground of every surface.
- **Do** reserve arc for powered or current state, volt for the single primary action and the skip link, red for the opponent and cuts.
- **Do** set every heading and label in uppercase, tracked osifont at weight 400; every count in expanded tabular Archivo.
- **Do** carry state with a mark as well as a hue (lamp fill, solid vs. dashed, strikethrough, icon).
- **Do** attach notes with leader lines and render lists as parts lists and revision blocks.
- **Do** put zone names above dashed outlines.
- **Do** honor `prefers-reduced-motion`: stop flow, deal and needle animation and smooth scroll.

### Don't:
- **Don't** use arc for decoration, hover fills or non-state emphasis.
- **Don't** put volt on secondary buttons, tags or highlights.
- **Don't** wrap content in filled, rounded, shadowed panels; use hairline rules and outlines.
- **Don't** glow anything that is not a state marker, and never glow without the downward offset.
- **Don't** add imagery other than the real cards, and don't frame or tilt them decoratively.
- **Don't** let the theme reduce legibility of card text, costs or steps.
