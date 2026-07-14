# The Forgotten Birthday
# Chapter Engine Architecture

_Last Updated: July 2026 (After Chapter 5)_

---

# Vision

The Forgotten Birthday is built around a **small reusable theater engine**, not a collection of chapter-specific code.

Each chapter is simply **story data**.

The engine is responsible for:

- displaying artwork
- presenting interactions
- recording outcomes
- progressing the story

The chapter itself only defines **what happens**, never **how** it happens.

---

# Core Flow

```text
Storybook Map
        ↓
Memory Window
        ↓
Chapter Illustration
        ↓
Narration
        ↓
Interactive Cue
        ↓
Outcome Narration
        ↓
Next Cue
        ↓
...
        ↓
Chapter Complete
        ↓
Return to Storybook
```

---

# Overall Architecture

```text
App

└── ChapterScene
      │
      ├── AtmosphereLayer
      ├── Chapter Artwork
      ├── Visual Layers
      ├── GuardianLayer
      └── ChapterDirector
               │
               ├── Narration
               ├── GroupDecision
               ├── Observation
               ├── IndividualDecision
               ├── DiceCue
               ├── CooperativePuzzle
               ├── RhythmChallenge
               ├── RelicReveal
               └── ChapterComplete
```

The Chapter Director owns story progression.

Cue components never advance the story themselves.

---

# Gameplay Cue Engines

These are reusable interaction engines.

---

## Narration

```js
type: "narration"
```

Purpose

- Tell the story
- Introduce guardians
- Explain outcomes
- Transition between interactions

Output

- Continue

---

## Group Decision

```js
type: "groupDecision"
```

Entire table votes together.

Output

- selected option
- narration outcome

Current Uses

- Chapter 1
- Chapter 2
- Chapter 4
- Chapter 5

Future Uses

- moral choices
- travel
- strategy
- puzzle solving

---

## Observation

```js
type: "observation"
```

Players inspect an illustration.

Current Version

- clue list
- progress tracking

Still To Build

- clickable hotspots
- multiplayer synchronization
- success feedback

Future Uses

- hidden objects
- environmental storytelling
- "spot the difference"

---

## Individual Decision

```js
type: "individualDecision"
```

One Guest makes a personal choice.

Returns

- selected option
- narration outcome

Supports

- visualState updates

Current Uses

- Chapter 1
- Chapter 2
- Chapter 4
- Chapter 5

---

## Dice Cue

```js
type: "dice"
```

Individual dice roll.

Supports

- success
- failure
- Glory

Future

- class modifiers
- relic modifiers
- difficulty scaling

Current Use

- Chapter 2

---

## Cooperative Puzzle

```js
type: "cooperativePuzzle"
```

Entire group solves one puzzle.

Returns

```js
completed
attempts
```

Current Use

- Chapter 3

Future

- environmental puzzles
- riddles
- sequence puzzles

---

## Rhythm Challenge

```js
type: "rhythmChallenge"
```

Players repeat a rhythm.

Returns

```js
completed
accuracy
attempts
glory
```

Current Use

- Chapter 5

Future

- drums
- bells
- musical memory
- heartbeat puzzles

---

## Relic Reveal

```js
type: "relicReveal"
```

Displays a magical relic.

Supports optional conditions.

Example

```js
condition: {
    puzzleCueId,
    requiresPuzzleCompletion
}
```

Purpose

- celebrate major milestones
- unlock story relics

Relics intentionally **do not appear every chapter.**

---

## Chapter Complete

```js
type: "chapterComplete"
```

Ends the chapter.

Returns to Storybook.

---

# Visual Systems

These are separate from gameplay.

---

## Atmosphere Layer

Provides subtle movement.

Examples

- sparkles
- oven glow
- candle flicker
- drifting dust
- lantern glow
- embers
- mist
- confetti

Current Implementation

Mostly CSS animations.

Future

Reusable Ambient Particle Engine.

---

## Guardian Layer

Displays chapter guardian.

Each guardian defines

```js
guardian: {
    image,
    className
}
```

Current positioning is CSS.

Future positioning should become data-driven.

---

## Chapter Visual Layer

Supports story-driven artwork changes.

Current Use

Chapter 4

Selecting how to stir the batter replaces the illustration with the corresponding completed cake.

Future Uses

- repaired objects
- opened doors
- blooming flowers
- lit candles
- changing environments

---

# Atmosphere Philosophy

The atmosphere should make the illustrations feel **alive**, never busy.

Every chapter should have:

- one signature movement
- one subtle lighting behavior

Examples

| Chapter | Signature Movement | Lighting |
|----------|-------------------|-----------|
| 1 | Sparkles | Candle glow |
| 2 | Fireflies | Forest shafts of light |
| 3 | Candle flicker | Warm cathedral glow |
| 4 | Flour & recipe pages | Oven glow |
| 5 | Gentle banners/confetti | Lantern pulse |
| 6 | Floating toy dust | Workshop light |
| 7 | Echo ripples | Hall reflections |
| 8 | Clock dust | Pendulum shadows |
| 9 | Falling petals | Garden sunlight |
| 10 | Floating invitations | Invitation glow |
| 11 | Wish lights | Bridge lanterns |
| 12 | Golden particles | Sunrise |
| Finale | Combined effects | Full magical lighting |

Rule:

Less is more.

The artwork should always remain the hero.

---

# Chapter Data Structure

```text
chapter

├── heroImage

├── memoryWindowImage

├── guardian

├── atmosphere

├── mapPosition

└── sequence[]

        narration

        groupDecision

        observation

        individualDecision

        dice

        cooperativePuzzle

        rhythmChallenge

        relicReveal

        chapterComplete
```

---

# Story Progression

Current Chapters

| Chapter | Primary Engine |
|----------|----------------|
| 1 | Group Decision + Observation + Individual Decision |
| 2 | Dice |
| 3 | Cooperative Puzzle + Relic |
| 4 | Observation + Visual State |
| 5 | Rhythm Challenge |

Future chapters should continue introducing new experiences only when needed.

---

# Planned Engines

These intentionally do **not** exist yet.

---

## Memory Match

```js
type: "memoryMatch"
```

---

## Pattern Puzzle

```js
type: "pattern"
```

---

## Rotation Puzzle

```js
type: "rotation"
```

---

## Inventory Decision

```js
type: "inventoryDecision"
```

Choose from collected relics.

---

## Class Ability

```js
type: "classAbility"
```

Allow specific character classes to unlock alternate solutions.

---

## Final Boss

The finale should be composed almost entirely from existing engines rather than introducing a completely new gameplay system.

---

# Guiding Principles

## DO

✅ Keep chapters data-driven.

✅ Build reusable engines.

✅ Keep ChapterDirector responsible for progression.

✅ Allow cue components to focus on one interaction.

✅ Separate gameplay from visual presentation.

✅ Build new systems only when a chapter requires them.

---

## DON'T

❌ Hardcode chapter-specific logic into reusable components.

❌ Create giant abstract engines before they're needed.

❌ Build visual effects that overwhelm the artwork.

❌ Add relics just because a chapter "needs one."

---

# Current TODO

## Gameplay

- Observation hotspot clicking
- Multiplayer synchronization
- Glory system
- Inventory
- Class modifiers
- Relic progression

## Visual

- Replace CSS-only atmosphere with reusable Ambient Particle Engine
- Data-driven guardian positioning
- More dynamic lighting
- Better chapter visual transitions

## Story

- Chapters 6–12
- Finale
- Boss encounter

---

# Architectural Milestone

By Chapter 5, the reusable chapter architecture has been proven.

The following systems now exist and work together without requiring changes to the core flow:

- Narration
- Group Decision
- Observation
- Individual Decision
- Dice
- Cooperative Puzzle
- Rhythm Challenge
- Relic Reveal
- Chapter Complete

From this point forward, development should focus primarily on:

- richer story content
- atmosphere
- artwork
- polish

The engine should remain small, understandable, and reusable.
