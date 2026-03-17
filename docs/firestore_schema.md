# Firestore Schema - KidAI Learning V2

## Overview
This schema supports adaptive learning, AI tutoring, gamification, social features, and parent analytics.
All child data is protected by parent ownership and role-based access.

## Conventions
- Document IDs: use UUID or deterministic ids where noted.
- Timestamps: use serverTimestamp for createdAt and updatedAt.
- Ownership: child documents include guardianId (parent user id).
- Soft delete: optional field deletedAt for privacy retention.
- Data minimization: avoid storing raw chat transcripts if not required.

## Collections

### users
Represents parent or admin accounts.
- id: string (doc id)
- email: string
- role: string (parent | admin)
- locale: string
- createdAt: timestamp
- updatedAt: timestamp

### children
Child profiles.
- id: string (doc id)
- guardianId: string (user id)
- name: string
- age: number
- grade: string
- preferences: map
- avatar: map
- createdAt: timestamp
- updatedAt: timestamp

### skills
Skill catalog.
- id: string
- domain: string (math | reading | etc)
- level: number
- title: string
- tags: array<string>
- prerequisites: array<string> (skill ids)

### skillEdges
Optional explicit knowledge graph edges.
- id: string
- fromSkillId: string
- toSkillId: string
- weight: number

### diagnostics
Diagnostic sessions.
- id: string
- childId: string
- status: string (active | completed)
- startedAt: timestamp
- completedAt: timestamp
- resultGraph: map

### exercises
Generated or curated exercises.
- id: string
- skillId: string
- difficulty: number
- prompt: string
- choices: array<string>
- answer: string (store only if needed for evaluation)
- meta: map

### exerciseAttempts
Attempts by children.
- id: string
- childId: string
- exerciseId: string
- answer: string
- isCorrect: boolean
- timeMs: number
- createdAt: timestamp

### learningSessions
Session tracking.
- id: string
- childId: string
- startedAt: timestamp
- endedAt: timestamp
- focusSkills: array<string>

### spacedReviews
Spaced repetition queue.
- id: string
- childId: string
- skillId: string
- nextReviewAt: timestamp
- intervalDays: number

### aiConversations
Optional AI tutor chat logs (minimize retention).
- id: string
- childId: string
- messages: array<map>
- context: map
- createdAt: timestamp

### gamificationProfiles
One doc per child (use childId as doc id).
- childId: string
- xp: number
- level: number
- streak: number
- badges: array<string>
- updatedAt: timestamp

### quests
Narrative quests.
- id: string
- skillId: string
- narrative: string
- steps: array<string>
- rewards: map

### questProgress
Progress per child.
- id: string
- childId: string
- questId: string
- step: number
- status: string (active | completed)
- updatedAt: timestamp

### avatarState
Avatar evolution.
- id: string
- childId: string
- appearance: map
- evolutionStage: string
- updatedAt: timestamp

### friends
Friend relationships.
- id: string
- childId: string
- friendId: string
- status: string (pending | accepted | blocked)
- createdAt: timestamp

### challenges
Social challenges.
- id: string
- creatorId: string
- participants: array<string>
- skillId: string
- status: string
- createdAt: timestamp

### leaderboards
Cached leaderboards.
- id: string
- scope: string (friends | class | global)
- entries: array<map>
- updatedAt: timestamp

### parentReports
Weekly parent summaries.
- id: string
- childId: string
- weekStart: date
- summary: string
- recommendations: array<string>

### events
Analytics events (use TTL policy).
- id: string
- childId: string
- type: string
- payload: map
- createdAt: timestamp
- appVersion: string
- device: string

### offlinePacks
Offline content packs for sync.
- id: string
- childId: string
- skillIds: array<string>
- version: string
- downloadedAt: timestamp
- syncedAt: timestamp

## Indexes (recommended)
- children: guardianId
- diagnostics: childId, startedAt desc
- exerciseAttempts: childId, createdAt desc
- spacedReviews: childId, nextReviewAt asc
- questProgress: childId, status
- challenges: participants (array-contains), createdAt desc
- events: childId, createdAt desc

## Security Rules (high-level)
- Allow access only to authenticated users.
- Parent can read/write own user profile.
- Parent can read/write child data where guardianId == request.auth.uid.
- Admin can read/write all data.
- AI tutor and analytics writes should be server-side only.
- Enforce minimal data collection for child accounts.

## Retention and Privacy
- Apply TTL to events and aiConversations where allowed.
- Mask or avoid sensitive content in logs.
- Store only what is needed for learning outcomes and safety.

## Notes
- For high-volume tables, consider subcollections under children/{childId}/... to reduce global query load.
- Use Cloud Functions to compute leaderboards and weekly parent reports.
