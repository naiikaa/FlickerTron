# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, one `index.html` plus local `assets/`, matching the user's earlier RowanCEDH primer (user: "another site like my RowanCEDH"). No framework, no build step.

## Users

Pilots learning the Pauper deck FlickerTron (Ephemerate / Teachings Tron) in the owner's own configuration: how the Tron mana base comes together, how the flicker value engine works, which lines to run, and how to sideboard. Links get shared in Discord, so readers arrive on desktop and on phones about equally; both count as first-class.

## Product Purpose

A visual, animated primer for the owner's list (Moxfield "Teachings Tron" by hannnes23, https://moxfield.com/decks/M8o2H-CwzkGl7EKcMV7A3A). It teaches the deck by showing it: the Tron mana math, the flicker/recursion loops and the infinite combo played step by step with the real cards, a sample-hand simulator, the card roles, a sideboard guide and the full 60 + 15. Success: a new pilot can assemble Tron, run the Mnemonic Wall + Ghostly Flicker engine, execute the infinite, and knows what to bring in for each matchup.

## Positioning

The PauperBrews guide (https://www.pauperbrews.com/2025/06/flicker-tron-pauper-deck-guide.html) describes a different list in prose. This page follows the owner's list and is the only version that *plays the lines*: cards moving through hand, stack, graveyard and battlefield with mana, storm count, life and Bird tokens tracked.

## Operating Context

Static site on GitHub Pages (https://naiikaa.github.io/FlickerTron/), repo naiikaa/FlickerTron, sibling of https://naiikaa.github.io/RowanCEDH/. All assets local under `assets/` (card images and mana symbols from Scryfall, fonts self-hosted); must keep working offline and opened from disk.

## Capabilities and Constraints

- The owner's list is the source of truth for every decklist, package and sample hand. PauperBrews content applies only where it fits these 75 cards.
- Owner's infinite combo (owner-supplied): Tron with 3 Urza's Towers + 2 Mnemonic Wall + storm count 5 + Weather the Storm + Unwind + Energy Refractor gives arbitrarily large life and mana; Birds with Murmuring Mystic out; damage with Rolling Thunder in hand. Ghostly Flicker is the loop's repeater (it is the only card that re-triggers the Walls).
- Sideboard guide: written for the owner's 15 from card text and the PauperBrews matchup notes, marked "Derived" (owner chose this).
- Animated line player with play/pause, step, scrub and speed; keyboard control (Space, ←/→).
- Sample-hand simulator: shuffle the 60 and draw 7, checking Tron pieces and Tron finders against the keep rule.
- Hover zoom for every card.
- Section navigation in a side rail (carried over from RowanCEDH, where it was a user requirement).
- Light and fast: no video backgrounds, no heavy frameworks.

## Brand Commitments

- Visual world chosen by the owner: "Urza's Machine": Thran blueprint drafting, arc light, Tron lands as a power plant, mana as voltage.
- MTG flavor; a clean, corporate, SaaS look is wrong (carried over from RowanCEDH).
- Name on the page: FlickerTron. The Moxfield deck is titled "Teachings Tron".

## Evidence on Hand

- Owner's 60 + 15 from the Moxfield API (`assets/data.js`).
- PauperBrews guide by David Royale (strategy, tips, matchup notes for a different 75).
- Owner's infinite combo description (above).
- Card images and mana symbols in `assets/` (Scryfall; © Wizards of the Coast, used as fan content).
- No win rates, tournament results or testimonials exist for this list; none may be invented.

## Product Principles

1. Show the line, don't describe it: every mechanism is demonstrated with the real cards and tracked numbers.
2. The owner's list wins: never show a card as "in the deck" that isn't in the 75.
3. Every line states its source (owner, PauperBrews, derived from card text) and its exact requirements.
4. Teach in the order a pilot needs: Tron → engine → sample hand → lines → roles → sideboard → list.
5. Readable first: the theme serves comprehension, never obscures card text, costs or steps.
