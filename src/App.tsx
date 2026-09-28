import React, { useState, useEffect } from 'react';
import { GameState, Topic, Question } from './types/game';
import { getStoredQuestions, saveStoredQuestions } from './data/defaultQuestions';
import { MainMenu } from './components/MainMenu';
import { ContraGameCanvas } from './components/ContraGameCanvas';
import { QuestionManager } from './components/QuestionManager';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameState>('MENU');
  const [selectedTopic, setSelectedTopic] = useState<Topic>('Vật Lý 11');
  const [questions, setQuestions] = useState<Question[]>([]);

  // Load questions on initial mount from localStorage
  useEffect(() => {
    const loaded = getStoredQuestions();
    setQuestions(loaded);
  }, []);

  const handleUpdateQuestions = (updated: Question[]) => {
    setQuestions(updated);
    saveStoredQuestions(updated);
  };

  const handleStartGame = () => {
    setCurrentScreen('PLAYING');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('MENU');
  };

  const handleOpenQuestionManager = () => {
    setCurrentScreen('QUESTION_MANAGER');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Chakra_Petch']">
      {currentScreen === 'MENU' && (
        <MainMenu
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          onStartGame={handleStartGame}
          onOpenQuestionManager={handleOpenQuestionManager}
          questions={questions}
        />
      )}

      {currentScreen === 'QUESTION_MANAGER' && (
        <QuestionManager
          questions={questions}
          onUpdateQuestions={handleUpdateQuestions}
          onBackToMenu={handleBackToMenu}
        />
      )}

      {currentScreen === 'PLAYING' && (
        <ContraGameCanvas
          topic={selectedTopic}
          questions={questions}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}
