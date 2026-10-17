import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import questions from "./questions.json";
import "./style.css";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function App() {
  const [quizKey, setQuizKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Make sure questions is actually an array
  const questionList = Array.isArray(questions) ? questions : [];

  const shuffledQuestions = useMemo(() => {
    return shuffle(questionList);
  }, [quizKey]);

  // Safety check
  if (questionList.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial",
          background: "#f5f7fb",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Questions could not be loaded</h2>
          <p>
            Please check that <b>src/questions.json</b> contains a JSON array.
          </p>
        </div>
      </div>
    );
  }

  const current = shuffledQuestions[currentIndex];

  // Extra safety
  if (!current) {
    return (
      <div className="app">
        <main className="result-container">
          <div className="result-card">
            <h1>Quiz Error</h1>
            <p>No question is available at this position.</p>

            <button className="restart-btn" onClick={() => setQuizKey((k) => k + 1)}>
              Restart Quiz
            </button>
          </div>
        </main>
      </div>
    );
  }

  const correctAnswers = Array.isArray(current.correctAnswer)
    ? current.correctAnswer
    : [current.correctAnswer];

  const progress =
    ((currentIndex + 1) / shuffledQuestions.length) * 100;

  const selectAnswer = (option) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(option);

    if (correctAnswers.includes(option)) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex >= shuffledQuestions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
  };

  const endQuiz = () => {
    const confirmed = window.confirm(
      "Are you sure you want to end the quiz?"
    );

    if (confirmed) {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuizKey((prev) => prev + 1);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.log("Fullscreen not available:", error);
    }
  };

  /* ================= RESULT SCREEN ================= */

  if (finished) {
    const percentage = Math.round(
      (score / shuffledQuestions.length) * 100
    );

    return (
      <div className="app">
        <div className="background-grid"></div>
        <div className="background-orb orb-one"></div>
        <div className="background-orb orb-two"></div>

        <main className="result-container">
          <div className="result-card">

            <div className="result-icon">
              ✓
            </div>

            <span className="result-label">
              QUIZ COMPLETED
            </span>

            <h1>
              {percentage >= 80
                ? "Excellent Work!"
                : percentage >= 50
                ? "Good Job!"
                : "Keep Practicing!"}
            </h1>

            <p className="result-subtitle">
              You have completed the NPTEL quiz.
            </p>

            <div
              className="score-circle"
              style={{
                "--score": `${percentage * 3.6}deg`,
              }}
            >
              <div>
                <strong>{percentage}%</strong>
                <span>Score</span>
              </div>
            </div>

            <div className="score-details">

              <div>
                <strong>{score}</strong>
                <span>Correct</span>
              </div>

              <div>
                <strong>
                  {shuffledQuestions.length - score}
                </strong>
                <span>Incorrect</span>
              </div>

              <div>
                <strong>
                  {shuffledQuestions.length}
                </strong>
                <span>Total</span>
              </div>

            </div>

            <button
              className="restart-btn"
              onClick={restartQuiz}
            >
              <span>↻</span>
              Start New Quiz
            </button>

          </div>
        </main>
      </div>
    );
  }

  /* ================= QUIZ SCREEN ================= */

  return (
    <div className="app">

      <div className="background-grid"></div>

      <div className="background-orb orb-one"></div>
      <div className="background-orb orb-two"></div>

      {/* TOP BAR */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-logo">
            N
          </div>

          <div>
            <h2>NPTEL Quiz</h2>
            <span>
              Practice • Learn • Improve
            </span>
          </div>

        </div>

        <div className="top-actions">

          <div className="question-counter">

            <span>QUESTION</span>

            <strong>
              {String(currentIndex + 1).padStart(2, "0")}

              <small>
                {" "}
                /{" "}
                {String(shuffledQuestions.length).padStart(
                  2,
                  "0"
                )}
              </small>
            </strong>

          </div>

          <button
            className="fullscreen-btn"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
          >
            ⛶
            <span>
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </button>

        </div>

      </header>

      {/* PROGRESS */}

      <div className="progress-wrapper">

        <div className="progress-info">
          <span>Quiz Progress</span>
          <strong>
            {Math.round(progress)}%
          </strong>
        </div>

        <div className="progress-track">

          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* MAIN */}

      <main className="quiz-container">

        <section className="quiz-card">

          {/* QUESTION HEADER */}

          <div className="question-header">

            <div className="question-number">
              Q{currentIndex + 1}
            </div>

            <div className="question-meta">

              <span className="pill">
                NPTEL
              </span>

              <span className="dot"></span>

              <span>
                Multiple Choice
              </span>

            </div>

          </div>

          {/* QUESTION */}

          <h1 className="question">
            {current.question}
          </h1>

          <p className="instruction">
            Select the best answer from the options below
          </p>

          {/* OPTIONS */}

          <div className="options">

            {current.options.map((option, index) => {

              const isSelected =
                selectedAnswer === option;

              const isCorrect =
                correctAnswers.includes(option);

              let optionClass = "option";

              if (selectedAnswer !== null) {

                if (isCorrect) {
                  optionClass += " correct";
                }

                if (isSelected && !isCorrect) {
                  optionClass += " incorrect";
                }
              }

              return (
                <button
                  key={`${currentIndex}-${index}`}
                  className={optionClass}
                  onClick={() => selectAnswer(option)}
                  disabled={selectedAnswer !== null}
                >

                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="option-text">
                    {option}
                  </span>

                  <span className="option-status">

                    {selectedAnswer !== null &&
                      isCorrect &&
                      "✓"}

                    {selectedAnswer !== null &&
                      isSelected &&
                      !isCorrect &&
                      "×"}

                  </span>

                </button>
              );
            })}

          </div>

          {/* FEEDBACK */}

          {selectedAnswer !== null && (

            <div
              className={`feedback ${
                correctAnswers.includes(selectedAnswer)
                  ? "feedback-correct"
                  : "feedback-wrong"
              }`}
            >

              <div className="feedback-icon">
                {correctAnswers.includes(selectedAnswer)
                  ? "✓"
                  : "×"}
              </div>

              <div>

                <strong>
                  {correctAnswers.includes(selectedAnswer)
                    ? "Correct Answer!"
                    : "Incorrect Answer"}
                </strong>

                <p>
                  Correct answer:{" "}
                  <b>
                    {correctAnswers.join(", ")}
                  </b>
                </p>

              </div>

            </div>
          )}

          {/* FOOTER */}

          <div className="quiz-footer">

            <button
              className="end-btn"
              onClick={endQuiz}
            >
              End Quiz
            </button>

            <button
              className="next-btn"
              onClick={nextQuestion}
              disabled={selectedAnswer === null}
            >

              {currentIndex === shuffledQuestions.length - 1
                ? "Finish Quiz"
                : "Next Question"}

              <span>
                →
              </span>

            </button>

          </div>

        </section>

        <div className="bottom-tip">
          <span>💡</span>
          Take your time and read each question carefully.
        </div>

      </main>

    </div>
  );
}

export default App;

createRoot(document.getElementById("root")).render(<App />);