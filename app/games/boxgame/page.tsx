"use client";
import { useState } from 'react';
import Game from './components/Game';
import styles from './page.module.css';
import { Press_Start_2P } from 'next/font/google';

const retroFont = Press_Start_2P({
weight: '400',
subsets: ['latin'],
display: 'swap',
variable: '--font-retro',
});
export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className={`${styles.container} ${retroFont.variable}`}>
      <main className={styles.main}>
        <h1 className={`${styles.title} ${retroFont.variable}`}>
          Bokserski Mistrz
        </h1>

        {!gameStarted ? (
          <div className={styles.startScreen}>
            <p className={`${styles.description} ${retroFont.variable}`}>
              Pokaż swoje umiejętności bokserskie i zostań mistrzem!
            </p>
            <button 
              className={`${styles.startButton} ${retroFont.variable}`}
              onClick={() => setGameStarted(true)}
            >
              Rozpocznij Grę
            </button>
          </div>
        ) : (
          <Game />
        )}
      </main>

      <footer className={styles.footer}>
        <p className={retroFont.variable}>Bokserski Mistrz - Gra w stylu Shakes and Fidget</p>
      </footer>
    </div>
  );
}
