# Strategy Upgrade Map (FastAPI plan -> Current Node backend)

## Context
The running app uses `Node.js + Express` in `backend/src`.
We keep this stack and apply the same IA strategy modules without rebuilding from scratch.

## Added modules
- `backend/src/ai/missionGenerator.js`
- `backend/src/ai/userProfile.js`
- `backend/src/ai/learningGraph.json`

## Existing equivalent module
- Gap detector already exists: `backend/src/ai/gapDetector.js`

## New API endpoints (Express)
- `GET /v1/adaptive/gap?skill=division`
- `GET /v1/adaptive/mission?skill=multiplication`
- `POST /v1/adaptive/weak-skills`
- `GET /v1/adaptive/learning-graph`

## Example responses
### `/v1/adaptive/gap?skill=division`
```json
{
  "ok": true,
  "skill": "division",
  "lacunes": ["multiplication"]
}
```

### `/v1/adaptive/mission?skill=multiplication`
```json
{
  "mission": "Ameliorer multiplication",
  "tasks": ["lecon", "exercice", "quiz"],
  "reward": "50XP"
}
```
