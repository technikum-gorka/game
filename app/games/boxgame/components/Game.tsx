"use client";
import { useState, useEffect, useRef } from 'react';
import Fighter from './Fighter';
import Enemy from './Enemy';
import Controls from './Controls';
import HealthBar from './HealthBar';
import LevelInfo from './LevelInfo';
import Shop from './Shop';
import { calculateDamage, checkHitSuccess, generateEnemy } from '../utils/GameLogic';
import styles from './Game.module.css';

type AnimationType = {
  type: string | null;
  direction: 'player' | 'enemy' | null;
};

type EnemyType = {
  name: string;
  defense: number;
  attackPower: number;
  level: number;
};

const Game = () => {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [level, setLevel] = useState(1);
  const [enemy, setEnemy] = useState<EnemyType | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState('');
  const [animation, setAnimation] = useState<AnimationType>({ type: null, direction: null });
  const [isHit, setIsHit] = useState(false);
  const [money, setMoney] = useState(0);
  const [damageBoost, setDamageBoost] = useState(0);
  const [accuracyBoost, setAccuracyBoost] = useState(0);
  const [maxHealthBoost, setMaxHealthBoost] = useState(0);
  const [painkillerUsed, setPainkillerUsed] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [highestLevel, setHighestLevel] = useState(1);

  const gameRef = useRef<HTMLDivElement>(null);
  
  // Wczytywanie zapisanych danych
  useEffect(() => {
    // Wczytaj zapisane dane
    const savedData = localStorage.getItem('boxingGameSave');
    if (savedData) {
      const data = JSON.parse(savedData);
      setMoney(data.money || 0);
      setDamageBoost(data.damageBoost || 0);
      setAccuracyBoost(data.accuracyBoost || 0);
      setMaxHealthBoost(data.maxHealthBoost || 0);
      setPainkillerUsed(data.painkillerUsed || false);
      setHighestLevel(data.highestLevel || 1);
    }
  }, []);

  // Zapisywanie postępów
  useEffect(() => {
    const gameData = {
      money,
      damageBoost,
      accuracyBoost,
      maxHealthBoost,
      painkillerUsed,
      highestLevel
    };
    localStorage.setItem('boxingGameSave', JSON.stringify(gameData));
  }, [money, damageBoost, accuracyBoost, maxHealthBoost, painkillerUsed, highestLevel]);
  
  // Inicjalizacja przeciwnika
  useEffect(() => {
    setEnemy(generateEnemy(level));
    setEnemyHealth(100);
    setMessage(`Poziom ${level}: Walcz!`);
  }, [level]);

  // Funkcje sklepu
  const openShop = () => {
    setShowShop(true);
  };

  const closeShop = () => {
    setShowShop(false);
  };

  const buyGym = () => {
    const price = 200 + (damageBoost * 100);
    if (money >= price) {
      setMoney(money - price);
      setDamageBoost(damageBoost + 1);
    }
  };

  const buyTrainer = () => {
    const price = 150 + (accuracyBoost * 75);
    if (money >= price) {
      setMoney(money - price);
      setAccuracyBoost(accuracyBoost + 1);
    }
  };

  const buyPainkiller = () => {
    const price = 300;
    if (money >= price && !painkillerUsed) {
      setMoney(money - price);
      setMaxHealthBoost(50);
      setPainkillerUsed(true);
      setPlayerHealth(prevHealth => Math.min(prevHealth + 50, 100 + 50)); // Dodaj zdrowie, ale nie przekraczaj nowego maksimum
    }
  };

  // Funkcja obsługująca atak gracza
  const handlePlayerAttack = (attackType: string) => {
    if (gameStatus !== 'playing') return;
    
    // Sprawdź czy atak trafił
    const hit = enemy ? checkHitSuccess(attackType, enemy.defense, accuracyBoost) : false;
    
    if (hit) {
      // Oblicz obrażenia
      const damage = calculateDamage(attackType, level, damageBoost);
      const newEnemyHealth = Math.max(0, enemyHealth - damage);
      
      // Animacja ataku i trafienia
      setAnimation({ type: attackType, direction: 'player' });
      setIsHit(true);
      
      // Resetowanie animacji po określonym czasie
      setTimeout(() => {
        setAnimation({ type: null, direction: null });
        setIsHit(false);
      }, 600);
      
      setEnemyHealth(newEnemyHealth);
      setMessage(`Trafiłeś! Zadałeś ${damage.toFixed(1)} obrażeń.`);
      
      // Sprawdź czy przeciwnik został pokonany
      if (newEnemyHealth === 0) {
        setGameStatus('won');
        
        // Nagroda pieniężna za wygraną walkę
        const reward = 100 + (level * 50);
        setMoney(prevMoney => prevMoney + reward);
        setMessage(`Wygrałeś! Zdobywasz ${reward} monet. Przygotuj się na następny poziom.`);
        
        // Dodatkowa nagroda za nowy poziom
        if (level + 1 > highestLevel) {
          const levelBonus = (level + 1) * 100;
          setMoney(prevMoney => prevMoney + levelBonus);
          setMessage(prevMessage => `${prevMessage} Bonus za nowy poziom: ${levelBonus} monet!`);
          setHighestLevel(level + 1);
        }
        
        setTimeout(() => {
          setLevel(level + 1);
          setPlayerHealth(100 + maxHealthBoost); // Uwzględnij boost zdrowia
          setGameStatus('playing');
        }, 2000);
      } else {
        // Atak przeciwnika po 1 sekundzie
        setTimeout(enemyAttack, 1000);
      }
    } else {
      setMessage('Chybiłeś! Przeciwnik uniknął twojego ciosu.');
      setAnimation({ type: attackType, direction: 'player' });
      setTimeout(() => {
        setAnimation({ type: null, direction: null });
      }, 600);
      setTimeout(enemyAttack, 1000);
    }
  };

  // Funkcja obsługująca atak przeciwnika
  const enemyAttack = () => {
    if (gameStatus !== 'playing' || !enemy) return;
    
    // Losowy atak przeciwnika
    const attackTypes = ['jab', 'cross', 'hook', 'uppercut', 'bodyShot', 'haymaker'];
    const enemyAttackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    
    // Sprawdź czy atak trafił
    const hit = Math.random() > 0.3; // 70% szans na trafienie
    
    if (hit) {
      // Oblicz obrażenia
      const damage = calculateDamage(enemyAttackType, level) * 0.8 * enemy.attackPower; // Przeciwnik zadaje obrażenia
      const newPlayerHealth = Math.max(0, playerHealth - damage);
      
      // Animacja ataku
      setAnimation({ type: enemyAttackType, direction: 'enemy' });
      
      // Resetowanie animacji po określonym czasie
      setTimeout(() => {
        setAnimation({ type: null, direction: null });
      }, 600);
      
      setPlayerHealth(newPlayerHealth);
      setMessage(`Przeciwnik trafił! Otrzymałeś ${damage.toFixed(1)} obrażeń.`);
      
      // Sprawdź czy gracz został pokonany
      if (newPlayerHealth === 0) {
        setGameStatus('lost');
        
        // Mniejsza nagroda za przegraną
        const consolationPrize = 20 + (level * 10);
        setMoney(prevMoney => prevMoney + consolationPrize);
        setMessage(`Przegrałeś! Zdobywasz ${consolationPrize} monet. Spróbuj jeszcze raz.`);
      }
    } else {
      setMessage('Przeciwnik chybił! Uniknąłeś jego ciosu.');
      setAnimation({ type: enemyAttackType, direction: 'enemy' });
      setTimeout(() => {
        setAnimation({ type: null, direction: null });
      }, 600);
    }
  };
  
  // Funkcja resetująca grę
  const resetGame = () => {
    setPlayerHealth(100 + maxHealthBoost);
    setEnemyHealth(100);
    setLevel(1);
    setGameStatus('playing');
    setMessage('Poziom 1: Walcz!');
    setEnemy(generateEnemy(1));
  };
  
  return (
    <div className={styles.gameContainer} ref={gameRef}>
      <div className={styles.gameInfo}>
        <div className={styles.topBar}>
          <LevelInfo level={level} />
          <div className={styles.moneyDisplay}>
            <span  style={{marginRight:'10px', fontSize:'25px'}} className={styles.moneyIcon}>💰</span>
            <span style={{marginRight:'10px'}}>{money}</span>
            <button 
              className={styles.shopButton} 
              onClick={openShop}
              style={{ fontFamily: 'inherit' , backgroundColor:' #ff5900',padding:'10px', borderRadius:'5px'}}
            >
              Sklep
            </button>
          </div>
        </div>
        <div className={styles.healthBars}>
          <HealthBar health={playerHealth} maxHealth={100 + maxHealthBoost} label="Twoje zdrowie" />
          <HealthBar health={enemyHealth} label="Zdrowie przeciwnika" isEnemy={true} />
        </div>
      </div>
      
      <div className={styles.arena}>
        <div className={styles.fighterWrapper}>
          <Fighter animation={animation.direction === 'player' ? animation.type : null} />
        </div>
        <div className={styles.enemyWrapper}>
          {enemy && (
            <Enemy 
              enemy={enemy} 
              animation={animation.direction === 'enemy' ? animation.type : null}
              isHit={isHit} 
            />
          )}
        </div>
      </div>
      
      <div className={styles.messageBox}>
        {message}
      </div>
      
      {gameStatus === 'playing' ? (
        <Controls onAttack={handlePlayerAttack} />
      ) : (
        <button 
          className={styles.resetButton} 
          onClick={resetGame}
          style={{ fontFamily: 'inherit' }}
        >
          {gameStatus === 'won' && level > 10 ? 'Gratulacje! Wygrałeś grę! Zagraj ponownie' : 'Zagraj ponownie'}
        </button>
      )}
      
      {showShop && (
        <Shop
          money={money}
          damageBoost={damageBoost}
          accuracyBoost={accuracyBoost}
          maxHealthBoost={maxHealthBoost}
          painkillerUsed={painkillerUsed}
          onBuyGym={buyGym}
          onBuyTrainer={buyTrainer}
          onBuyPainkiller={buyPainkiller}
          onClose={closeShop}
        />
      )}
    </div>
  );
};

export default Game;
