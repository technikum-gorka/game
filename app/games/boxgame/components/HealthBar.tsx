"use client";
import styles from './HealthBar.module.css';

interface HealthBarProps {
  health: number;
  maxHealth?: number; // Opcjonalny parametr dla maksymalnego zdrowia
  label: string;
  isEnemy?: boolean;
}

const HealthBar = ({ health, maxHealth = 100, label, isEnemy = false }: HealthBarProps) => {
  // Oblicz procent zdrowia
  const healthPercent = (health / maxHealth) * 100;
  
  // Określenie koloru paska zdrowia w zależności od jego poziomu
  const getHealthColor = () => {
    if (healthPercent > 70) return '#4caf50'; // zielony
    if (healthPercent > 30) return '#ff9800'; // pomarańczowy
    return '#f44336'; // czerwony
  };

  return (
    <div className={`${styles.healthBarContainer} ${isEnemy ? styles.enemy : ''}`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.healthBarOuter}>
        <div 
          className={styles.healthBarInner} 
          style={{ 
            width: `${healthPercent}%`,
            backgroundColor: getHealthColor()
          }}
        ></div>
      </div>
      <div className={styles.healthValue}>
        {health.toFixed(1)}/{maxHealth.toFixed(1)}
      </div>
    </div>
  );
};

export default HealthBar;
