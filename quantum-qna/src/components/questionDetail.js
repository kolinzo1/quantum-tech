function QuestionDetail({ questionId }) {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [questionId]);

  const fetchQuestionAndAnswers = async () => {
    try {
      const [questionRes, answersRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/questions/${questionId}`),
        axios.get(`http://localhost:3001/api/questions/${questionId}/answers`),
      ]);
      setQuestion(questionRes.data);
      setAnswers(answersRes.data);
    } catch (error) {
      console.error("Failed to fetch question details:", error);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:3001/api/questions/${questionId}/answers`,
        {
          content: newAnswer,
          userId: localStorage.getItem("userId"),
        }
      );
      setNewAnswer("");
      fetchQuestionAndAnswers();
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="question-detail">
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{question.title}</h3>
          <p className="card-text">{question.content}</p>
          <small className="text-muted">
            Asked by {question.username} on{" "}
            {new Date(question.created_at).toLocaleDateString()}
          </small>
        </div>
      </div>

      <h4>{answers.length} Answers</h4>

      {answers.map((answer) => (
        <div key={answer.answer_id} className="card mb-3">
          <div className="card-body">
            <p className="card-text">{answer.content}</p>
            <small className="text-muted">
              Answered by {answer.username} on{" "}
              {new Date(answer.created_at).toLocaleDateString()}
            </small>
          </div>
        </div>
      ))}

      <div className="submit-answer mt-4">
        <h5>Your Answer</h5>
        <form onSubmit={handleSubmitAnswer}>
          <div className="form-group">
            <textarea
              className="form-control"
              rows="5"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Post Answer
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuestionDetail;
