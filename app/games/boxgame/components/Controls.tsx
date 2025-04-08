"use client";
import { useState } from 'react';
import styles from './Controls.module.css';

interface ControlsProps {
  onAttack: (attackType: string) => void;
}

const Controls = ({ onAttack }: ControlsProps) => {
  const [cooldowns, setCooldowns] = useState<Record<string, boolean>>({
    jab: false,
    cross: false,
    hook: false,
    uppercut: false,
    bodyShot: false,
    haymaker: false
  });

  const attacks = [
    { name: 'Jab', type: 'jab', accuracy: 90, damage: 5, cooldown: 1000 },
    { name: 'Cross', type: 'cross', accuracy: 80, damage: 10, cooldown: 1500 },
    { name: 'Hook', type: 'hook', accuracy: 70, damage: 15, cooldown: 2000 },
    { name: 'Uppercut', type: 'uppercut', accuracy: 60, damage: 20, cooldown: 2500 },
    { name: 'Body Shot', type: 'bodyShot', accuracy: 75, damage: 12, cooldown: 1800 },
    { name: 'Haymaker', type: 'haymaker', accuracy: 40, damage: 30, cooldown: 3000 }
  ];

  const handleAttack = (attackType: string, cooldown: number) => {
    if (cooldowns[attackType]) return;
    
    onAttack(attackType);
    
    // Ustaw cooldown dla przycisku
    setCooldowns(prev => ({ ...prev, [attackType]: true }));
    setTimeout(() => {
      setCooldowns(prev => ({ ...prev, [attackType]: false }));
    }, cooldown);
  };

  return (
    <div className={styles.controls}>
      <div className={styles.attackButtons}>
        {attacks.map((attack) => (
          <button
            key={attack.type}
            className={`${styles.attackButton} ${cooldowns[attack.type] ? styles.cooldown : ''}`}
            onClick={() => handleAttack(attack.type, attack.cooldown)}
            disabled={cooldowns[attack.type]}
            style={{ fontFamily: 'inherit' }}
          >
            {attack.name}
            <div className={styles.attackInfo}>
              <span>Celność: {attack.accuracy}%</span>
              <span>Obrażenia: {attack.damage}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Controls;
