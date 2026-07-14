"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Quiz {
  id: number;
  document: string;
  created_at: string;
  questionsanswers: { id: number }[];
}

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [document, setDocument] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        localStorage.removeItem('access');
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setQuizzes(data);
      } else {
        console.error('API did not return an array:', data);
        setQuizzes([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document.trim()) return;
    
    setGenerating(true);
    const token = localStorage.getItem('access');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ document })
      });

      const data = await res.json();
      if (res.ok && data.quiz_id) {
        router.push(`/quiz/${data.quiz_id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="layout-container flex-center" style={{ minHeight: '80vh' }}>Loading...</div>;
  }

  return (
    <div className="layout-container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Your Dashboard</h2>
        <button className="btn-secondary" onClick={() => {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          router.push('/login');
        }}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass glass-card animate-fade-in">
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Create New Quiz</h3>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Paste Document or Notes</label>
              <textarea 
                className="form-input" 
                rows={8}
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="Paste your study material here and our AI will generate questions for you..."
                required
                style={{ resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={generating}>
              {generating ? 'Generating via AI...' : 'Generate Quiz'}
            </button>
          </form>
        </div>

        <div className="glass glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 style={{ marginBottom: '1rem' }}>Previous Quizzes</h3>
          {quizzes.length === 0 ? (
            <p>You haven't generated any quizzes yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {quizzes.map((quiz) => (
                <div key={quiz.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {quiz.document}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{quiz.questionsanswers.length} Questions</span>
                    <Link href={`/quiz/${quiz.id}`} className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                      Take Quiz
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
