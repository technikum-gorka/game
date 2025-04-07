"use client";
import { useRef, useEffect } from 'react';
import styles from './Fighter.module.css';

interface FighterProps {
  animation: string | null;
}

const Fighter = ({ animation }: FighterProps) => {
  const fighterRef = useRef<HTMLDivElement>(null);
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
        if (leftUpperArmRef.current) leftUpperArmRef.current.classList.add(styles.jabUpperArmAnimation);
        if (leftForeArmRef.current) leftForeArmRef.current.classList.add(styles.jabForeArmAnimation);
        if (leftGloveRef.current) leftGloveRef.current.classList.add(styles.jabGloveAnimation);
        if (fighterRef.current) fighterRef.current.classList.add(styles.punchingStance);
        break;
      case 'cross':
        if (rightUpperArmRef.current) rightUpperArmRef.current.classList.add(styles.crossUpperArmAnimation);
        if (rightForeArmRef.current) rightForeArmRef.current.classList.add(styles.crossForeArmAnimation);
        if (rightGloveRef.current) rightGloveRef.current.classList.add(styles.crossGloveAnimation);
        if (fighterRef.current) fighterRef.current.classList.add(styles.punchingStance);
        break;
      case 'hook':
        if (leftUpperArmRef.current) leftUpperArmRef.current.classList.add(styles.hookUpperArmAnimation);
        if (leftForeArmRef.current) leftForeArmRef.current.classList.add(styles.hookForeArmAnimation);
        if (leftGloveRef.current) leftGloveRef.current.classList.add(styles.hookGloveAnimation);
        if (fighterRef.current) fighterRef.current.classList.add(styles.punchingStance);
        break;
      case 'uppercut':
        if (rightUpperArmRef.current) rightUpperArmRef.current.classList.add(styles.uppercutUpperArmAnimation);
        if (rightForeArmRef.current) rightForeArmRef.current.classList.add(styles.uppercutForeArmAnimation);
        if (rightGloveRef.current) rightGloveRef.current.classList.add(styles.uppercutGloveAnimation);
        if (fighterRef.current) fighterRef.current.classList.add(styles.punchingStance);
        break;
      case 'bodyShot':
        if (leftUpperArmRef.current) leftUpperArmRef.current.classList.add(styles.bodyShotUpperArmAnimation);
        if (leftForeArmRef.current) leftForeArmRef.current.classList.add(styles.bodyShotForeArmAnimation);
        if (leftGloveRef.current) leftGloveRef.current.classList.add(styles.bodyShotGloveAnimation);
        if (fighterRef.current) fighterRef.current.classList.add(styles.punchingStance);
        break;
      case 'haymaker':
        if (rightUpperArmRef.current) rightUpperArmRef.current.classList.add(styles.haymakerUpperArmAnimation);
        if (rightForeArmRef.current) rightForeArmRef.current.classList.add(styles.haymakerForeArmAnimation);
        if (rightGloveRef.current) rightGloveRef.current.classList.add(styles.haymakerGloveAnimation);
        if (fighterRef.current) fighterRef.current.classList.add(styles.punchingStance);
        break;
      default:
        break;
    }

    // Usunięcie klasy po zakończeniu animacji
    const animationTimeout = setTimeout(() => {
      if (fighterRef.current) {
        fighterRef.current.classList.remove(styles.punchingStance);
      }
    }, 600);

    return () => {
      clearTimeout(animationTimeout);
    };
  }, [animation]);

  return (
    <div className={styles.fighter} ref={fighterRef}>
      <div className={styles.head} ref={headRef}>
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
        {/* Lewa ręka */}
        <div className={styles.armContainer} style={{ zIndex: 3 }}>
          <div className={styles.upperArm} ref={leftUpperArmRef}>
            <div className={styles.foreArm} ref={leftForeArmRef}>
              <div className={styles.glove} ref={leftGloveRef}></div>
            </div>
          </div>
        </div>
        {/* Prawa ręka */}
        <div className={styles.armContainer} style={{ zIndex: 2 }}>
          <div className={styles.upperArm} ref={rightUpperArmRef}>
            <div className={styles.foreArm} ref={rightForeArmRef}>
              <div className={styles.glove} ref={rightGloveRef}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fighter;
