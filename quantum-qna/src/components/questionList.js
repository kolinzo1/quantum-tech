function QuestionList({ questions }) {
  return (
    <div className="question-list">
      {questions.map((question) => (
        <div key={question.question_id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">
              <a href={`/question/${question.question_id}`}>{question.title}</a>
            </h5>
            <p className="card-text text-truncate">{question.content}</p>
            <div className="d-flex justify-content-between">
              <small className="text-muted">
                Asked by {question.username} on{" "}
                {new Date(question.created_at).toLocaleDateString()}
              </small>
              <small className="text-muted">
                {question.answer_count || 0} answers
              </small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuestionList;
