import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { getMeta, useDataset } from '../data/DatasetContext';
import EntityLogo from '../components/EntityLogo';
import { getLearnChunks, pickQuestion } from '../utils/learn';
import { checkWinnerAnswer } from '../utils/answerMatch';
import { formatYear } from '../utils/format';
import type { Champion } from '../types';
import '../styles/Learn.css';

const CHUNK_SIZE = 6;

type Phase = 'study' | 'practice' | 'blockDone' | 'allDone';

export default function Learn() {
  const dataset = useDataset();
  const chunks = useMemo(() => getLearnChunks(dataset, CHUNK_SIZE), [dataset]);
  const storageKey = `vw-learn-${dataset.id}`;

  const [chunkIndex, setChunkIndex] = useState<number>(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const n = raw ? parseInt(raw, 10) : 0;
      if (Number.isNaN(n)) return 0;
      return Math.min(Math.max(0, n), chunks.length - 1);
    } catch {
      return 0;
    }
  });
  const [phase, setPhase] = useState<Phase>('study');
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState<Champion | null>(null);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'pending' | 'correct' | 'wrong'>('pending');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, String(chunkIndex));
    } catch {
      /* localStorage niet beschikbaar */
    }
  }, [chunkIndex, storageKey]);

  const chunk = chunks[chunkIndex] ?? [];
  const total = chunks.length;
  const masteredCount = chunk.filter((c) => mastered.has(c.id)).length;

  const beginBlock = () => {
    setMastered(new Set());
    setStatus('pending');
    setInput('');
    setCurrent(pickQuestion(chunk, new Set()));
    setPhase('practice');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!current || status !== 'pending' || !input.trim()) return;
    const check = checkWinnerAnswer(input, current.winner!, dataset.aliases);
    setStatus(check.result === 'wrong' ? 'wrong' : 'correct');
  };

  const handleNext = useCallback(() => {
    if (!current) return;
    const newMastered = new Set(mastered);
    if (status === 'correct') newMastered.add(current.id);
    setMastered(newMastered);

    const next = pickQuestion(chunk, newMastered);
    setInput('');
    setStatus('pending');

    if (!next) {
      setCurrent(null);
      setPhase(chunkIndex < total - 1 ? 'blockDone' : 'allDone');
    } else {
      setCurrent(next);
    }
  }, [current, mastered, status, chunk, chunkIndex, total]);

  // Focus het invoerveld zodra er een nieuwe vraag staat.
  useEffect(() => {
    if (phase === 'practice' && status === 'pending') {
      inputRef.current?.focus();
    }
  }, [phase, status, current]);

  // Goed → automatisch door na 1,2s. Beantwoord → Enter gaat ook door.
  useEffect(() => {
    if (phase !== 'practice' || status === 'pending') return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKey);

    const timer = status === 'correct' ? window.setTimeout(handleNext, 1200) : undefined;

    return () => {
      window.removeEventListener('keydown', onKey);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [phase, status, handleNext]);

  const goToBlock = (index: number) => {
    setChunkIndex(index);
    setMastered(new Set());
    setCurrent(null);
    setStatus('pending');
    setInput('');
    setPhase('study');
  };

  const blockRange = (c: Champion[]) =>
    c.length ? `${formatYear(c[0].year)}–${formatYear(c[c.length - 1].year)}` : '';

  return (
    <div className="learn-page">
      <div className="page-header">
        <h1>Oefenmodule — jaartallen leren</h1>
        <p>
          Leer telkens 6 {dataset.editionNounPlural} op rij: bekijk ze eerst, oefen ze
          daarna, en ga pas door naar de volgende 6 als je ze allemaal kent.
        </p>
      </div>

      <div className="learn-progress-bar-wrap">
        <div className="learn-progress-meta">
          <span>
            Blok {chunkIndex + 1} van {total} · {blockRange(chunk)}
          </span>
          <button className="learn-reset" onClick={() => goToBlock(0)}>
            Begin opnieuw
          </button>
        </div>
        <div className="learn-progress-bar">
          <div
            className="learn-progress-fill"
            style={{ width: `${total ? (chunkIndex / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {phase === 'study' && (
        <div className="learn-card">
          <h2>Bekijk deze 6 {dataset.editionNounPlural}</h2>
          <p className="learn-sub">Onthoud welke {dataset.entityNoun} bij welk jaar hoort.</p>
          <ul className="study-list">
            {chunk.map((c) => {
              const meta = getMeta(dataset, c.winner);
              return (
                <li key={c.id} className="study-item">
                  <span className="study-year">{formatYear(c.year)}</span>
                  <EntityLogo winner={c.winner} size={36} />
                  <span className="study-winner">{c.winner}</span>
                  {meta.mnemonic && (
                    <span className="study-mnemonic" title={meta.mnemonicDetail}>
                      {meta.mnemonic}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <button className="btn btn-primary btn-large learn-start" onClick={beginBlock}>
            Start overhoring ({chunk.length} jaren)
          </button>
        </div>
      )}

      {phase === 'practice' && current && (
        <div className="learn-card">
          <div className="learn-chips">
            {chunk.map((c) => (
              <span
                key={c.id}
                className={`learn-chip ${mastered.has(c.id) ? 'done' : ''} ${
                  c.id === current.id ? 'active' : ''
                }`}
              >
                {formatYear(c.year)}
                {mastered.has(c.id) ? ' ✓' : ''}
              </span>
            ))}
          </div>
          <p className="learn-counter">
            {masteredCount}/{chunk.length} gekend
          </p>

          <div className="learn-question">
            <h2>{dataset.questionWinner(formatYear(current.year))}</h2>
          </div>

          {status === 'pending' ? (
            <form className="vb-answer-form" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="answer-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={dataset.winnerInputPlaceholder}
                autoFocus
                autoComplete="off"
              />
              <button type="submit" className="submit-btn" disabled={!input.trim()}>
                Controleer
              </button>
            </form>
          ) : (
            <>
              <div className={`feedback-message ${status === 'correct' ? 'correct' : 'incorrect'}`}>
                {status === 'correct' ? (
                  <p>✓ Goed! {formatYear(current.year)} = {current.winner}</p>
                ) : (
                  <p className="vb-correct-answer-reveal">
                    ✗ Het juiste antwoord is:{' '}
                    <span className="correct-with-logo">
                      <EntityLogo winner={current.winner} size={24} />
                      <strong>{current.winner}</strong>
                    </span>
                  </p>
                )}
                {status === 'wrong' && getMeta(dataset, current.winner).mnemonic && (
                  <p className="mnemonic-hint">
                    {getMeta(dataset, current.winner).mnemonic}
                  </p>
                )}
              </div>
              <button className="next-btn" onClick={handleNext}>
                Volgende ⏎
              </button>
            </>
          )}
        </div>
      )}

      {phase === 'blockDone' && (
        <div className="learn-card learn-done">
          <h2>Blok voltooid</h2>
          <p>Je kent de jaren {blockRange(chunk)}. Klaar voor de volgende 6?</p>
          <div className="learn-done-actions">
            <button className="btn btn-outline" onClick={() => goToBlock(chunkIndex)}>
              Nog eens oefenen
            </button>
            <button
              className="btn btn-primary btn-large"
              onClick={() => goToBlock(chunkIndex + 1)}
            >
              Volgende 6 jaren →
            </button>
          </div>
        </div>
      )}

      {phase === 'allDone' && (
        <div className="learn-card learn-done">
          <h2>Alles afgerond</h2>
          <p>
            Je hebt alle {dataset.editionNounPlural} van {dataset.title} geoefend. Begin
            gerust opnieuw om alles scherp te houden.
          </p>
          <button className="btn btn-primary btn-large" onClick={() => goToBlock(0)}>
            Opnieuw beginnen
          </button>
        </div>
      )}
    </div>
  );
}
