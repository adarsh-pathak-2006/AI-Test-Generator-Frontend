"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Question {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const pk = id as string;

  const [questionIds, setQuestionIds] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  
  const [feedback, setFeedback] = useState<{ message: string, correct: boolean } | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    fetchQuizMeta();
  }, []);

  useEffect(() => {
    if (questionIds.length > 0 && currentIndex < questionIds.length) {
      fetchQuestion(questionIds[currentIndex]);
    } else if (questionIds.length > 0 && currentIndex >= questionIds.length) {
      setQuizFinished(true);
    }
  }, [currentIndex, questionIds]);

  const fetchQuizMeta = async () => {
    const token = localStorage.getItem('access');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        if(res.status === 401) router.push('/login');
        return;
      }
      const data = await res.json();
      let currentQuiz = null;
      if (Array.isArray(data)) {
        currentQuiz = data.find((q: any) => q.id.toString() === pk);
      }
      
      if (currentQuiz && currentQuiz.questionsanswers) {
        const ids = currentQuiz.questionsanswers.map((qa: any) => qa.id);
        setQuestionIds(ids);
      } else {
        // Quiz not found or no questions
        setQuizFinished(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuestion = async (ck: number) => {
    const token = localStorage.getItem('access');
    setLoading(true);
    setFeedback(null);
    setSelectedOption('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${pk}/${ck}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentQuestion(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedOption) return;
    setSubmitting(true);
    const token = localStorage.getItem('access');
    const ck = questionIds[currentIndex];

    // Map selection to A,B,C,D
    let letter = 'A';
    if (selectedOption === currentQuestion?.option2) letter = 'B';
    if (selectedOption === currentQuestion?.option3) letter = 'C';
    if (selectedOption === currentQuestion?.option4) letter = 'D';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${pk}/${ck}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: letter })
      });
      
      const data = await res.json();
      const isCorrect = data.message === 'correct answer';
      setFeedback({ message: data.message, correct: isCorrect });
      if (isCorrect) setScore(s => s + 1);

    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    setCurrentIndex(i => i + 1);
  };

  if (quizFinished) {
    return (
      <div className="layout-container flex-center" style={{ minHeight: '80vh' }}>
        <div className="glass glass-card animate-fade-in" style={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}>
          <h2>Quiz Completed!</h2>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '2rem 0' }} className="text-gradient">
            {score} / {questionIds.length}
          </div>
          <button className="btn-primary" onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (loading || !currentQuestion) {
    return <div className="layout-container flex-center" style={{ minHeight: '80vh' }}>Loading Question...</div>;
  }

  const options = [currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4];

  return (
    <div className="layout-container flex-center" style={{ minHeight: '80vh', padding: '2rem 0' }}>
      <div className="glass glass-card animate-fade-in" style={{ width: '100%', maxWidth: '700px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#94a3b8' }}>
          <span>Question {currentIndex + 1} of {questionIds.length}</span>
          <span>Score: {score}</span>
        </div>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{currentQuestion.question}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const letter = ['A', 'B', 'C', 'D'][i];
            let borderStyle = isSelected ? '1px solid var(--primary)' : '1px solid var(--card-border)';
            let bgStyle = isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(15, 23, 42, 0.4)';
            
            return (
              <div 
                key={i} 
                onClick={() => !feedback && setSelectedOption(opt)}
                style={{
                  padding: '1rem',
                  border: borderStyle,
                  background: bgStyle,
                  borderRadius: '8px',
                  cursor: feedback ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '30px', 
                  height: '30px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>{letter}</span>
                {opt}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {feedback ? (
            <div style={{ color: feedback.correct ? 'var(--success)' : 'var(--error)', fontWeight: 'bold' }}>
              {feedback.correct ? 'Correct! 🎉' : 'Incorrect.'}
            </div>
          ) : (
            <div></div> // Spacer
          )}

          {feedback ? (
            <button className="btn-primary" onClick={nextQuestion}>
              {currentIndex === questionIds.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          ) : (
            <button className="btn-primary" onClick={submitAnswer} disabled={!selectedOption || submitting}>
              {submitting ? 'Checking...' : 'Submit Answer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
