"use client";
import { useRef, useEffect } from 'react';
import styles from './Enemy.module.css';

interface EnemyProps {
  enemy: {
    name: string;
    defense: number;
    attackPower: number;
    level: number;
  };
  animation: string | null;
  isHit: boolean;
}

const Enemy = ({ enemy, animation, isHit }: EnemyProps) => {
  const enemyRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const leftUpperArmRef = useRef<HTMLDivElement>(null);
  const leftForeArmRef = useRef<HTMLDivElement>(null);
  const leftGloveRef = useRef<HTMLDivElement>(null);
  const rightUpperArmRef = useRef<HTMLDivElement>(null);
  const rightForeArmRef = useRef<HTMLDivElement>(null);
  const rightGloveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animation) return;

    // Resetowanie klas animacji
    const elements = [
      leftUpperArmRef.current,
      leftForeArmRef.current,
      leftGloveRef.current,
      rightUpperArmRef.current,
      rightForeArmRef.current,
      rightGloveRef.current
    ];

    elements.forEach(el => {
      if (!el) return;
      el.classList.remove(
        styles.jabUpperArmAnimation,
        styles.jabForeArmAnimation,
        styles.jabGloveAnimation,
        styles.crossUpperArmAnimation,
        styles.crossForeArmAnimation,
        styles.crossGloveAnimation,
        styles.hookUpperArmAnimation,
        styles.hookForeArmAnimation,
        styles.hookGloveAnimation,
        styles.uppercutUpperArmAnimation,
        styles.uppercutForeArmAnimation,
        styles.uppercutGloveAnimation,
        styles.bodyShotUpperArmAnimation,
        styles.bodyShotForeArmAnimation,
        styles.bodyShotGloveAnimation,
        styles.haymakerUpperArmAnimation,
        styles.haymakerForeArmAnimation,
        styles.haymakerGloveAnimation
      );
    });

    // Dodanie odpowiedniej klasy animacji w zależności od typu ciosu
    switch (animation) {
      case 'jab':
        if (rightUpperArmRef.current) rightUpperArmRef.current.classList.add(styles.jabUpperArmAnimation);
        if (rightForeArmRef.current) rightForeArmRef.current.classList.add(styles.jabForeArmAnimation);
        if (rightGloveRef.current) rightGloveRef.current.classList.add(styles.jabGloveAnimation);
        if (enemyRef.current) enemyRef.current.classList.add(styles.punchingStance);
        break;
      case 'cross':
        if (leftUpperArmRef.current) leftUpperArmRef.current.classList.add(styles.crossUpperArmAnimation);
        if (leftForeArmRef.current) leftForeArmRef.current.classList.add(styles.crossForeArmAnimation);
        if (leftGloveRef.current) leftGloveRef.current.classList.add(styles.crossGloveAnimation);
        if (enemyRef.current) enemyRef.current.classList.add(styles.punchingStance);
        break;
      case 'hook':
        if (rightUpperArmRef.current) rightUpperArmRef.current.classList.add(styles.hookUpperArmAnimation);
        if (rightForeArmRef.current) rightForeArmRef.current.classList.add(styles.hookForeArmAnimation);
        if (rightGloveRef.current) rightGloveRef.current.classList.add(styles.hookGloveAnimation);
        if (enemyRef.current) enemyRef.current.classList.add(styles.punchingStance);
        break;
      case 'uppercut':
        if (leftUpperArmRef.current) leftUpperArmRef.current.classList.add(styles.uppercutUpperArmAnimation);
        if (leftForeArmRef.current) leftForeArmRef.current.classList.add(styles.uppercutForeArmAnimation);
        if (leftGloveRef.current) leftGloveRef.current.classList.add(styles.uppercutGloveAnimation);
        if (enemyRef.current) enemyRef.current.classList.add(styles.punchingStance);
        break;
      case 'bodyShot':
        if (rightUpperArmRef.current) rightUpperArmRef.current.classList.add(styles.bodyShotUpperArmAnimation);
        if (rightForeArmRef.current) rightForeArmRef.current.classList.add(styles.bodyShotForeArmAnimation);
        if (rightGloveRef.current) rightGloveRef.current.classList.add(styles.bodyShotGloveAnimation);
        if (enemyRef.current) enemyRef.current.classList.add(styles.punchingStance);
        break;
      case 'haymaker':
        if (leftUpperArmRef.current) leftUpperArmRef.current.classList.add(styles.haymakerUpperArmAnimation);
        if (leftForeArmRef.current) leftForeArmRef.current.classList.add(styles.haymakerForeArmAnimation);
        if (leftGloveRef.current) leftGloveRef.current.classList.add(styles.haymakerGloveAnimation);
        if (enemyRef.current) enemyRef.current.classList.add(styles.punchingStance);
        break;
      default:
        break;
    }

    // Usunięcie klasy po zakończeniu animacji
    const animationTimeout = setTimeout(() => {
      if (enemyRef.current) {
        enemyRef.current.classList.remove(styles.punchingStance);
      }
    }, 600);

    return () => {
      clearTimeout(animationTimeout);
    };
  }, [animation]);

  // Efekt dla animacji trafienia
  useEffect(() => {
    if (isHit && headRef.current) {
      headRef.current.classList.add(styles.headHit);
      
      const hitTimeout = setTimeout(() => {
        if (headRef.current) {
          headRef.current.classList.remove(styles.headHit);
        }
      }, 300);
      
      return () => {
        clearTimeout(hitTimeout);
      };
    }
  }, [isHit]);

  // Zmiana koloru przeciwnika w zależności od poziomu
  const getEnemyColor = () => {
    const level = enemy.level;
    if (level <= 3) return '#4682b4'; // SteelBlue
    if (level <= 6) return '#8b0000'; // DarkRed
    if (level <= 9) return '#4b0082'; // Indigo
    return '#000000'; // Black dla najwyższych poziomów
  };

  const enemyStyle = {
    '--enemy-color': getEnemyColor(),
  } as React.CSSProperties;

  return (
    <div className={styles.enemy} ref={enemyRef} style={enemyStyle}>
      <div className={`${styles.head} ${isHit ? styles.headHit : ''}`} ref={headRef}>
        <div className={styles.face}>
          <div className={styles.eyes}>
            <div className={styles.eye}></div>
            <div className={styles.eye}></div>
          </div>
          <div className={styles.mouth}></div>
        </div>
      </div>
      <div className={styles.body}></div>
      <div className={styles.arms}>
        {/* Lewa ręka (z perspektywy przeciwnika) */}
        <div className={styles.armContainer} style={{ zIndex: 3 }}>
          <div className={styles.upperArm} ref={leftUpperArmRef}>
            <div className={styles.foreArm} ref={leftForeArmRef}>
              <div className={styles.glove} ref={leftGloveRef}></div>
            </div>
          </div>
        </div>
        {/* Prawa ręka (z perspektywy przeciwnika) */}
        <div className={styles.armContainer} style={{ zIndex: 2 }}>
          <div className={styles.upperArm} ref={rightUpperArmRef}>
            <div className={styles.foreArm} ref={rightForeArmRef}>
              <div className={styles.glove} ref={rightGloveRef}></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.enemyName}>
        {enemy.name} (Poziom {enemy.level})
      </div>
    </div>
  );
};

export default Enemy;
