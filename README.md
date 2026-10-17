# NPTEL Quiz

Small React + Vite quiz website designed for Vercel.

## Add your questions

Edit `src/questions.json`:

```json
[
  {
    "question": "Your question",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B"
  }
]
```

## Behavior

- Questions are shuffled once when the quiz starts.
- Every question is shown exactly once.
- No question repeats during a quiz.
- Supports both single-answer and multiple-correct-answer questions.
- Answers lock after selection.
- Score is shown at the end.
- Reloading starts a new randomized order.
- Fully responsive.

## Vercel

Push this folder to GitHub and import the repository into Vercel.

Build command: `npm run build`

Output directory: `dist`
