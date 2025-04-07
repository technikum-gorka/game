"use client";
import styles from './LevelInfo.module.css';

interface LevelInfoProps {
  level: number;
}

const LevelInfo = ({ level }: LevelInfoProps) => {
  return (
    <div className={styles.levelInfo}>
      <div className={styles.levelTitle}>Poziom {level}</div>
      <div className={styles.levelDescription}>
        {level <= 3 && "Początkujący bokser"}
        {level > 3 && level <= 6 && "Doświadczony bokser"}
        {level > 6 && level <= 9 && "Profesjonalny bokser"}
        {level > 9 && "Mistrz boksu"}
      </div>
    </div>
  );
};

export default LevelInfo;
