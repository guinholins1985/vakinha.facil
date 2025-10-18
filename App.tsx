// Fix: Replaced invalid file content with a functional React component.
// This new component provides a basic UI for interacting with the Gemini API,
// resolving the module error in `index.tsx` and all errors within this file.
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResult('');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setResult(response.text);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gemini API Text Generation</h1>
      <p>Enter a prompt below and click "Generate" to get a response from the Gemini API.</p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., why is the sky blue?"
        rows={5}
        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt}
        style={{ marginTop: '10px', padding: '10px 15px', fontSize: '1rem', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', opacity: (loading || !prompt) ? 0.5 : 1 }}
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {error && <div style={{ color: 'red', marginTop: '10px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>Error: {error}</div>}

      {result && (
        <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', border: '1px solid #eee', padding: '15px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
          <h2>Response:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;
