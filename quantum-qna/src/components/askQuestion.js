function AskQuestion({ categoryId, onQuestionSubmitted }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3001/api/questions`, {
        categoryId,
        ...formData,
        userId: localStorage.getItem("userId"),
      });
      onQuestionSubmitted();
    } catch (error) {
      console.error("Failed to submit question:", error);
    }
  };

  return (
    <div className="ask-question-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Question Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            placeholder="Describe your question in detail..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows="5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Question
        </button>
      </form>
    </div>
  );
}

export default AskQuestion;
