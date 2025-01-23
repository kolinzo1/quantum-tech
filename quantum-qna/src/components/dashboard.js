import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showAskForm, setShowAskForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "" });
  const [newAnswer, setNewAnswer] = useState("");
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setSelectedQuestion(null);
    setShowAskForm(false);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/categories/${category.category_id}/questions`
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const handleQuestionClick = async (question) => {
    setSelectedQuestion(question);
    setShowAnswerForm(false);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/questions/${question.question_id}/answers`
      );
      setAnswers(response.data);
    } catch (error) {
      console.error("Failed to fetch answers:", error);
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/questions", {
        categoryId: selectedCategory.category_id,
        userId: localStorage.getItem("userId"),
        ...newQuestion,
      });
      setShowAskForm(false);
      setNewQuestion({ title: "", content: "" });
      // Refresh questions list
      handleCategoryClick(selectedCategory);
    } catch (error) {
      console.error("Failed to submit question:", error);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:3001/api/questions/${selectedQuestion.question_id}/answers`,
        {
          content: newAnswer,
          userId: localStorage.getItem("userId"),
        }
      );
      setNewAnswer("");
      setShowAnswerForm(false);
      // Refresh answers
      handleQuestionClick(selectedQuestion);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  const renderAskQuestionForm = () => (
    <div className="card mb-3">
      <div className="card-body">
        <h3>Ask a Question</h3>
        <form onSubmit={handleSubmitQuestion}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Question Title"
              value={newQuestion.title}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, title: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Question Details"
              value={newQuestion.content}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, content: e.target.value })
              }
              rows="4"
              required
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary">
              Submit Question
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => setShowAskForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderQuestionAndAnswers = () => (
    <div>
      <div className="card mb-3">
        <div className="card-body">
          <h3>{selectedQuestion.title}</h3>
          <p>{selectedQuestion.content}</p>
          <small className="text-muted">
            Posted by {selectedQuestion.username} on{" "}
            {new Date(selectedQuestion.created_at).toLocaleDateString()}
          </small>
        </div>
      </div>

      <h4>Answers ({answers.length})</h4>
      {answers.map((answer) => (
        <div key={answer.answer_id} className="card mb-3">
          <div className="card-body">
            <p>{answer.content}</p>
            <small className="text-muted">
              Answered by {answer.username} on{" "}
              {new Date(answer.created_at).toLocaleDateString()}
            </small>
          </div>
        </div>
      ))}

      {showAnswerForm ? (
        <div className="card mb-3">
          <div className="card-body">
            <h5>Your Answer</h5>
            <form onSubmit={handleSubmitAnswer}>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Write your answer..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows="4"
                  required
                />
              </div>
              <div>
                <button type="submit" className="btn btn-primary">
                  Submit Answer
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => setShowAnswerForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowAnswerForm(true)}
        >
          Add Answer
        </button>
      )}
    </div>
  );

  const renderQuestionsList = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{selectedCategory.name}</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAskForm(true)}
        >
          Ask a Question
        </button>
      </div>

      {questions.map((question) => (
        <div
          key={question.question_id}
          className="card mb-3 cursor-pointer"
          onClick={() => handleQuestionClick(question)}
        >
          <div className="card-body">
            <h5 className="card-title">{question.title}</h5>
            <p className="card-text text-truncate">{question.content}</p>
            <div className="d-flex justify-content-between">
              <small className="text-muted">
                Posted by {question.username} on{" "}
                {new Date(question.created_at).toLocaleDateString()}
              </small>
              <span className="badge bg-secondary">
                {question.answer_count || 0} answers
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-light bg-light mb-3">
        <span className="navbar-brand mb-0 h1">Quantum Q&A</span>
        <span className="navbar-text">
          Welcome, {localStorage.getItem("username")}
          <a href="/" className="btn btn-link">
            Logout
          </a>
        </span>
      </nav>

      <div className="row">
        <div className="col-3">
          <div className="list-group">
            {categories.map((category) => (
              <button
                key={category.category_id}
                className={`list-group-item list-group-item-action ${
                  selectedCategory?.category_id === category.category_id
                    ? "active"
                    : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="col-9">
          {!selectedCategory ? (
            <div className="alert alert-info">
              Select a category to view its questions.
            </div>
          ) : showAskForm ? (
            renderAskQuestionForm()
          ) : selectedQuestion ? (
            renderQuestionAndAnswers()
          ) : (
            renderQuestionsList()
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
