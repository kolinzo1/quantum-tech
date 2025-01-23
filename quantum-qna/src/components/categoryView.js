import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionList from "./questionList.js";
import AskQuestion from "./askQuestion.js";

function CategoryView({ categoryId }) {
  const [questions, setQuestions] = useState([]);
  const [showAskForm, setShowAskForm] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [categoryId]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/categories/${categoryId}/questions`
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  return (
    <div className="category-view">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Questions</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAskForm(!showAskForm)}
        >
          Ask a Question
        </button>
      </div>

      {showAskForm ? (
        <AskQuestion
          categoryId={categoryId}
          onQuestionSubmitted={() => {
            setShowAskForm(false);
            fetchQuestions();
          }}
        />
      ) : (
        <QuestionList
          questions={questions}
          onQuestionUpdated={fetchQuestions}
        />
      )}
    </div>
  );
}

export default CategoryView;
