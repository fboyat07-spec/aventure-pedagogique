# KidAI Learning App V2 - Product Specification (Codex Ready)

## Summary
KidAI Learning is an AI-powered mobile learning platform for children ages 6-14. It combines adaptive learning, narrative progression, ethical gamification, and parent analytics while meeting child privacy requirements.

## Goals
- Deliver measurable learning progress in core skills via adaptive practice.
- Build sustainable engagement with safe, non-manipulative mechanics.
- Provide parents and teachers with clear, actionable progress insights.
- Support global access with offline learning packs and low bandwidth mode.

## Non-Goals
- No real-money rewards or gambling-like mechanics.
- No collection of sensitive data beyond what is required for learning.
- No data sharing with third parties without verified parental consent.

## Evidence-Backed Design Rationale
1) Autonomy and goal choice support motivation and persistence. [R1]
2) Challenge-skill balance is a robust contributor to flow and engagement. [R2]
3) Spaced practice improves long-term retention. [R3]
4) Habit formation follows gradual automaticity with high variance; missing a day does not erase progress. [R4]
5) Variable ratio reinforcement yields high, steady response rates, so use only safe, non-monetary surprises. [R5]
6) Microlearning modules can improve motivation and performance in basic education. [R6]
7) Notification timing and frequency influence engagement; test context-aware timing. [R7]
8) Child privacy codes recommend high privacy by default and avoiding privacy-weakening nudges. [R8]
9) COPPA updates emphasize parental consent, data minimization, and retention limits. [R9]
10) Offline access addresses connectivity constraints in education contexts. [R10]

## Target Users
- Primary: children ages 6-14 learning foundational skills.
- Secondary: parents and guardians monitoring progress.
- Optional: teachers or class administrators (future phase).

## Core Features
- Onboarding with quick win, goal choice, and parental consent.
- Adaptive diagnostic test and skill placement.
- Knowledge graph with skill dependencies and prerequisites.
- Learning gap detection and prioritized remediation.
- Adaptive difficulty engine based on challenge-skill balance.
- Spaced repetition scheduler and review prompts.
- AI tutor chat (OpenAI API) with safe, kid-friendly tone.
- Intervention timing engine for nudges and supportive micro-checkins.
- Emotion and frustration detection from interaction signals.
- Infinite exercise generator with content validation.
- Narrative learning quests and world map progression.
- XP, levels, badges, streaks with forgiveness.
- Evolving avatars with visual progression.
- Friend challenges and peer leaderboards (opt-in).
- Parent dashboard with weekly summaries and recommendations.
- Voice tutor and homework OCR/photo scanner.
- Push notifications with quiet hours and opt-in controls.
- Offline learning packs with sync on reconnect.
- Analytics instrumentation and A/B testing hooks.

## Advanced Systems (Ethical Engagement)
- Aha onboarding in first session: micro-quiz + instant reward.
- Goal selection: user picks a weekly goal or challenge.
- Micro-challenges: adaptive difficulty inside each session.
- Surprise rewards: non-monetary, mastery-focused and optional.
- Narrative progression: map and story unlocks as mastery grows.
- Smart nudges: context-aware notifications with pacing limits.
- Habit loop: streaks with recovery token and weekly reflection.
- Social: friend challenges, class leaderboards, team missions.
- Parent nudges: weekly digest and at-risk signals.

## Safety, Privacy, and Ethics
- High-privacy default settings for all child accounts.
- Avoid nudges that weaken privacy or push excessive usage.
- Explicit parental consent for child accounts and data use.
- Data minimization and retention limits by default.
- Explainable AI outputs and safe fallback responses.
- Content moderation for user-generated or AI-generated text.

## Architecture Overview
- Frontend: React Native app with offline-first data cache.
- Backend: Node.js + Express for API and orchestration.
- Database: Firebase Auth + Firestore + Storage.
- AI Engine: OpenAI API with safety filters and prompt templates.
- Gamification Engine: XP, badges, streaks, rewards, avatar evolution.
- Analytics: event schema + A/B testing hooks.

## Project Structure
- frontend/
- backend/
- ai-engine/
- gamification/
- analytics/
- database/
- shared/
- docs/

## Codex Prompt (Safe)
Build a full mobile educational application for children (6?14) with AI-driven personalization and ethical engagement.

Constraints:
- Avoid manipulative or addictive mechanics and gambling-like rewards.
- Prioritize autonomy, mastery, and well-being.
- Privacy by default and parental consent for child accounts.

Core features:
- onboarding with quick win + goal choice + consent flow
- adaptive diagnostic quiz
- knowledge graph learning model
- learning gap detection
- adaptive difficulty flow (challenge-skill balance)
- spaced repetition system
- AI tutor chat (OpenAI API) with safe, age-appropriate tone
- intervention timing engine
- emotion engagement detection from interaction signals only
- infinite exercise generator
- narrative learning quests and map
- XP, badges, levels, streaks with forgiveness
- evolving avatars
- friend challenges and peer leaderboards (opt-in)
- parent dashboard with weekly summaries & recommendations
- voice tutor and homework OCR/photo scanner
- smart notifications with quiet hours and opt-in
- offline sync capability
- analytics instrumentation + A/B testing hooks

Tech stack:
React Native frontend
Node.js + Express backend
Firebase (Auth, Firestore, Storage)
OpenAI API integration

## API Scope (REST)
- Auth: session, role verification.
- Users: parent profile management.
- Children: create, update, progress.
- Diagnostic: start, answer, finish.
- Skills: list, graph, prerequisites.
- Exercises: generate, submit, feedback.
- Adaptive: adjust difficulty, gap detection.
- Spaced: next review, schedule.
- Tutor: chat and intervention events.
- Emotion: frustration signals from interactions.
- Quests: active quests, completion.
- Gamification: XP, badges, streaks.
- Social: friends, challenges, leaderboards.
- Parents: weekly summary and recommendations.
- Analytics: event ingestion and cohort attribution.

## Data Model (Firestore)
- users
- children
- skills
- skillEdges
- diagnostics
- exercises
- exerciseAttempts
- learningSessions
- spacedReviews
- aiConversations
- gamificationProfiles
- quests
- questProgress
- avatarState
- friends
- challenges
- leaderboards
- parentReports
- events

## Analytics Events (Minimum)
- onboarding_started, onboarding_completed
- diagnostic_started, diagnostic_completed
- lesson_started, lesson_completed
- exercise_submitted, exercise_correct
- spaced_review_due, spaced_review_done
- streak_updated, streak_forgiven
- quest_started, quest_completed
- reward_granted, badge_unlocked
- tutor_message, tutor_escalation
- notification_sent, notification_opened
- offline_pack_downloaded, offline_pack_synced

## Performance and Scale Targets
- p95 API latency < 400ms for core endpoints.
- Offline lesson pack download < 30 seconds on 3G.
- Client cold start < 2.5 seconds on mid-range devices.

## QA and Experimentation
- A/B test onboarding flows, notification timing, reward cadence.
- Track retention by D1, D7, D30 cohorts.
- Track mastery velocity per skill and content type.

## Risks and Mitigations
- Over-engagement risks: apply pacing, quiet hours, limits.
- Model hallucinations: use safe prompts, filters, and fallback.
- Data privacy: strict access rules and minimal collection.

## References
[R1] Ryan, R.M., Deci, E.L. (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. American Psychologist. https://pubmed.ncbi.nlm.nih.gov/11392867/
[R2] Fong, C.J., Zaleski, D.J., Leach, J.K. (2014). The challenge-skill balance and antecedents of flow: A meta-analytic investigation. Summary page. https://instituteofcoaching.org/resources/challenge%E2%80%93skill-balance-and-antecedents-flow-meta-analytic-investigation
[R3] Cepeda, N.J., et al. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin. https://pubmed.ncbi.nlm.nih.gov/16719566/
[R4] Lally, P., et al. (2010). How are habits formed: Modelling habit formation in the real world. European Journal of Social Psychology. https://repositorio.ispa.pt/handle/10400.12/3364
[R5] OpenStax Psychology 2e, Operant Conditioning (variable ratio schedules). https://openstax.org/books/psychology-2e/pages/6-3-operant-conditioning
[R6] Silva, E.S., et al. (2025). Contribution of Microlearning in Basic Education: A Systematic Review. Education Sciences. https://www.mdpi.com/2227-7102/15/3/302
[R7] Morrison, L.G., et al. (2017). Timing and frequency of push notifications and usage in a smartphone intervention. PLOS ONE. https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0169162
[R8] ICO Age Appropriate Design Code. https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/
[R9] FTC COPPA Rule updates (2025). https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data
[R10] UNESCO offline learning access and connectivity constraints. https://www.unesco.org/en/articles/launch-first-offline-intranet-resource-center-kenya
