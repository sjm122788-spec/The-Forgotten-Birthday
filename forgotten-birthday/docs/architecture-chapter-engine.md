# The Forgotten Birthday
# Chapter Engine Architecture

Status: LOCKED (V1)

This document explains how a chapter is played.

It exists so future development does not accidentally hardcode chapter logic into reusable components.

---

# Philosophy

Every chapter is treated like a theatrical performance.

The React components are the stage.

The chapter data is the script.

The Director tells the stage what should happen next.

The stage never decides the story.

---

# High Level Flow

App

↓

Storybook Map

↓

Memory Window

↓

Chapter Scene (Stage)

↓

Chapter Director

↓

Cue Components

↓

Return to Storybook

---

# Responsibility Breakdown

## App.jsx

Responsible for:

- Global navigation
- Current screen
- Current chapter
- Returning to the Storybook

App does NOT know:

- Narration
- Decisions
- Guardians
- Atmosphere
- Chapter flow

---

## chapterOne.js (and future chapter files)

The chapter file is the script.

It contains:

- title
- hero illustration
- map image
- memory window
- atmosphere configuration
- guardian configuration
- sequence of cues

The chapter file contains NO React.

It is pure story data.

Example:

```js
sequence: [

    narration,

    narration,

    groupDecision,

    narration,

    observation,

    narration,

    chapterComplete

]
```

---

## ChapterScene.jsx

ChapterScene is the STAGE.

Its job is to render:

- Hero illustration
- AtmosphereLayer
- GuardianLayer
- ChapterDirector

It should NEVER import:

- Chapter-specific artwork
- Guardians
- Props
- Layer images

Everything comes from the chapter data.

If ChapterScene ever imports:

```js
confettiSweeper
```

or

```js
sparkles
```

the architecture has been broken.

---

## AtmosphereLayer

Responsible for rendering environmental overlays.

Examples:

- candlelight
- sparkles
- dust
- petals
- fog
- drifting wishes
- falling confetti

It knows NOTHING about chapters.

It simply renders the layers it receives.

---

## GuardianLayer

Responsible for rendering:

- Guardian
- Optional Guardian props

Examples:

Confetti Sweeper

+

Broom

Ribbon Stitcher

+

Ribbon

Clock Mender

+

Pocket Watch

It knows NOTHING about the story.

Only how to display a configured Guardian.

---

## ChapterDirector

The Chapter Director is the brain.

It controls:

- current cue
- advancing cues
- decision results
- chapter completion

The Director owns progression.

Nothing else should decide what happens next.

---

# Cue Components

Each cue does ONE thing.

Cue components NEVER control chapter progression.

They report back to the Director.

Current cue types:

NarrationCue

Displays narration.

Reports:

Continue

↓

Director advances.

---

GroupDecision

Displays choices.

Reports:

Selected option

↓

Director decides what happens next.

---

Future Cue Types

ObservationCue

DiceCue

IndividualDecisionCue

GuardianCue

RelicReveal

GloryReveal

SecretPrompt

EndingCue

Every cue should have one responsibility.

---

# Sequence Flow

Current:

Narration

↓

Narration

↓

Narration

↓

Group Decision

↓

Outcome Narration

↓

Narration

↓

Chapter Complete

Future:

Narration

↓

Guardian Reveal

↓

Narration

↓

Group Decision

↓

Narration

↓

Observation

↓

Narration

↓

Individual Decision

↓

Dice

↓

Narration

↓

Relic Reveal

↓

Chapter Complete

---

# Architectural Rules

## Rule 1

The Stage never tells the story.

Only the Director does.

---

## Rule 2

Cue Components never advance chapters.

They only report user interaction.

---

## Rule 3

Chapter files contain story.

React components contain presentation.

Never mix them.

---

## Rule 4

New chapters should require almost zero React changes.

Adding Chapter 7 should mostly mean creating:

chapterSeven.js

with new assets and a new sequence.

---

## Rule 5

When adding a new gameplay mechanic:

DO NOT modify ChapterScene.

Create a new cue type.

Teach the Director how to render it.

---

# Long-Term Goal

Eventually every chapter should be playable by changing only data.

A chapter should feel like directing a play:

- choose the artwork
- choose the Guardian
- choose the atmosphere
- write the cue sequence

The engine performs it.
