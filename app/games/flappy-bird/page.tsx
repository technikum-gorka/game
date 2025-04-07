'use client';

import { useEffect, useState } from 'react';
import { ShoppingBasket, Coins } from 'lucide-react';
import Cookies from 'js-cookie';
import './globals.css';

interface Pipe {
  id: number;
  x: number;
  height: number;
}

type Upgrades = {
  fastJump: boolean;
  smallBird: boolean;
  slowPipes: boolean;
  birdColor: string;
  ownedColors: string[];
};

export default function Home() {
  const [birdY, setBirdY] = useState(200);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [money, setMoney] = useState(0);
  const [healthUpgradeCount, setHealthUpgradeCount] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [showShop, setShowShop] = useState(false);
  const [hasRewarded, setHasRewarded] = useState(false);

  const [upgrades, setUpgrades] = useState({
    fastJump: false,
    smallBird: false,
    slowPipes: false,
    birdColor: 'yellow',
    ownedColors: ['yellow'],
  });

  useEffect(() => {
    const savedMoney = parseFloat(Cookies.get('money') || '0');
    const savedUpgrades = Cookies.get('upgrades');
    const savedHealthUpgrades = parseInt(Cookies.get('healthUpgrades') || '0');
    const savedMaxScore = parseFloat(Cookies.get('maxScore') || '0');

    setMoney(savedMoney);
    setHealthUpgradeCount(savedHealthUpgrades);
    setHealth(100 + savedHealthUpgrades * 10);
    setMaxScore(savedMaxScore);

    if (savedUpgrades) {
      const parsed = JSON.parse(savedUpgrades);
      if (!parsed.ownedColors) parsed.ownedColors = ['yellow'];
      setUpgrades(parsed);
    }
  }, []);

  const updateUpgrades = (newUp: Upgrades) => {
    setUpgrades(newUp);
    Cookies.set('upgrades', JSON.stringify(newUp));
  };

  const gravity = upgrades.fastJump ? 2.5 : 4;
  const pipeSpeed = upgrades.slowPipes ? 2 : 4;
  const jump = 50;
  const pipeGap = 150;
  const pipeWidth = 70;
  const gameWidth = 400;
  const gameHeight = 700;

  useEffect(() => {
    const handleJump = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRunning && !isGameOver) setIsRunning(true);
        setBirdY(prev => Math.max(prev - jump, 0));
      }
    };

    const handleTouch = () => {
      if (!isRunning && !isGameOver) setIsRunning(true);
      setBirdY(prev => Math.max(prev - jump, 0));
    };

    window.addEventListener('keydown', handleJump);
    window.addEventListener('touchstart', handleTouch);

    return () => {
      window.removeEventListener('keydown', handleJump);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [isRunning, isGameOver]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;
    const interval = setInterval(() => {
      setBirdY(prev => Math.min(prev + gravity, gameHeight - 30));
    }, 30);
    return () => clearInterval(interval);
  }, [isRunning, isGameOver, gravity]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;
    const interval = setInterval(() => {
      const height = Math.floor(Math.random() * 200) + 50;
      setPipes(prev => [...prev, { id: Date.now(), x: gameWidth, height }]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isRunning, isGameOver]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;
    const interval = setInterval(() => {
      setPipes(prev =>
        prev.map(pipe => {
          const newX = pipe.x - pipeSpeed;
          if (newX + pipeWidth === 50) {
            setScore(prevScore => prevScore + 1);
          }
          return { ...pipe, x: newX };
        }).filter(pipe => pipe.x + pipeWidth > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [isRunning, isGameOver, pipeSpeed]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;
    const interval = setInterval(() => {
      setHealth(prev => {
        const next = prev - 2;
        if (next <= 0) {
          setIsGameOver(true);
          setIsRunning(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isGameOver]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;
    pipes.forEach(pipe => {
      const withinPipe = pipe.x < 80 && pipe.x + pipeWidth > 50;
      const hitTop = birdY < pipe.height;
      const hitBottom = birdY > pipe.height + pipeGap;
      if (withinPipe && (hitTop || hitBottom)) {
        setIsGameOver(true);
        setIsRunning(false);
      }
    });
  }, [birdY, pipes, isRunning, isGameOver]);

  useEffect(() => {
    if (isGameOver && !hasRewarded) {
      const earned = Math.round(score * 0.2 * 10) / 10;
      const updatedMoney = parseFloat((money + earned).toFixed(1));
      const newMax = Math.max(score, maxScore);
  
      setMoney(updatedMoney);
      setMaxScore(newMax);
      setHasRewarded(true); // ✅ ustaw flagę
  
      Cookies.set('money', updatedMoney.toString());
      Cookies.set('maxScore', newMax.toString());
      Cookies.set('healthUpgrades', healthUpgradeCount.toString());
    }
  }, [isGameOver, hasRewarded]);

  const handleRestart = () => {
    setBirdY(200);
    setPipes([]);
    setScore(0);
    setHealth(100 + healthUpgradeCount * 10);
    setIsGameOver(false);
    setIsRunning(false);
    setHasRewarded(false);
  };

  const buyHealthUpgrade = () => {
    if (money >= 10 && healthUpgradeCount < 99) {
      const newCount = healthUpgradeCount + 1;
      const newMoney = money - 10;
      setHealthUpgradeCount(newCount);
      setMoney(newMoney);
      Cookies.set('healthUpgrades', newCount.toString());
      Cookies.set('money', newMoney.toString());
      setHealth(100 + newCount * 10);
    }
  };

  const availableColors = ['blue', 'red', 'green', 'purple'];

  const handleColorPurchase = (color: string) => {
    if (upgrades.ownedColors.includes(color)) {
      updateUpgrades({ ...upgrades, birdColor: color });
    } else if (money >= 50) {
      const newMoney = money - 50;
      const newUpgrades = {
        ...upgrades,
        ownedColors: [...upgrades.ownedColors, color],
        birdColor: color
      };
      setMoney(newMoney);
      Cookies.set('money', newMoney.toString());
      updateUpgrades(newUpgrades);
    }
  };

  return (
    <div className="game-container">
      <div className="top-left">
        <ShoppingBasket size={25} onClick={() => setShowShop(true)} />
      </div>

      <div className="top-right">
        <Coins size={25} color={'black'} />
        <span className="textt">{money.toFixed(1)}</span>
      </div>

      <div className="score">{score}</div>
      <div
        className="bird"
        style={{
          top: birdY,
          width: upgrades.smallBird ? 20 : 30,
          height: upgrades.smallBird ? 20 : 30,
          backgroundColor: upgrades.birdColor
        }}
      />

      {pipes.map(pipe => (
        <div key={pipe.id}>
          <div className="pipe" style={{ left: pipe.x, top: 0 }}>
            <div className="pipe-body" style={{ height: pipe.height }} />
          </div>
          <div className="pipe" style={{ left: pipe.x, top: pipe.height + pipeGap }}>
            <div className="pipe-body" style={{ height: gameHeight - pipe.height - pipeGap }} />
          </div>
        </div>
      ))}

      {!isRunning && !isGameOver && (
        <div className="start-text">Kliknij lub naciśnij spację, aby zacząć</div>
      )}

      {isGameOver && (
        <div className="game-over">
          <div className="game-over-text">Game Over</div>
          <div className="final-score">Wynik: {score}</div>
          <div className="final-score">Najwyższy wynik: {maxScore}</div>
          <button onClick={handleRestart}>Zagraj ponownie</button>
        </div>
      )}

      <div className="health-bar">
        <div className="health-fill" style={{ width: `${(health / (100 + healthUpgradeCount * 10)) * 100}%` }}></div>
        <div className="health-text">{health}%</div>
      </div>

      {showShop && (
        <div className="shop">
          <div className="shop-header">
            <h2><ShoppingBasket className="koszyk" />Sklep</h2>
            <div className="shop-money">
              <Coins size={20} color={'black'} />
              <span>{money.toFixed(1)} monet</span>
            </div>
          </div>

          <div className="shop-scroll">
            <div className="upgrade-item">
              <p>❤️ Ulepszenie życia (+10%)</p>
              <button disabled={healthUpgradeCount >= 99 || money < 10} onClick={buyHealthUpgrade}>
                Kup za 10 monet
              </button>
              <p>Kupiono: {healthUpgradeCount}/99</p>
            </div>

            <div className="upgrade-item">
              <p>⚡️ Szybszy skok</p>
              <button disabled={upgrades.fastJump || money < 50} onClick={() => {
                updateUpgrades({ ...upgrades, fastJump: true });
                setMoney(money - 50);
                Cookies.set('money', (money - 50).toString());
              }}>Kup za 50 monet</button>
            </div>

            <div className="upgrade-item">
              <p>🕹 Mniejsza kulka</p>
              <button disabled={upgrades.smallBird || money < 75} onClick={() => {
                updateUpgrades({ ...upgrades, smallBird: true });
                setMoney(money - 75);
                Cookies.set('money', (money - 75).toString());
              }}>Kup za 75 monet</button>
            </div>

            <div className="upgrade-item">
              <p>🐢 Wolniejsze rury</p>
              <button disabled={upgrades.slowPipes || money < 100} onClick={() => {
                updateUpgrades({ ...upgrades, slowPipes: true });
                setMoney(money - 100);
                Cookies.set('money', (money - 100).toString());
              }}>Kup za 100 monet</button>
            </div>

            <div className="upgrade-item">
              <p>🎨 Wybierz kolor kulki</p>
              {availableColors.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorPurchase(color)}
                  disabled={!upgrades.ownedColors.includes(color) && money < 50}
                  style={{
                    backgroundColor: color,
                    color: '#fff',
                    margin: '5px',
                    padding: '5px 10px',
                    border: upgrades.birdColor === color ? '2px solid black' : 'none'
                  }}
                >
                  {upgrades.ownedColors.includes(color) ? `Użyj (${color})` : `Kup kolor (${color}) - 50 monet`}
                </button>
              ))}
            </div>

            <button onClick={() => {
              const newMoney = parseFloat((money + 1000).toFixed(1));
              setMoney(newMoney);
              Cookies.set('money', newMoney.toString());
            }}>Dodaj monety 💰</button>
            <button onClick={() => {
            const newMoney = Math.max(0, parseFloat((money - 999999).toFixed(1)));
            setMoney(newMoney);
            Cookies.set('money', newMoney.toString());
          }}>
            Usuń monety 💸
          </button>
          <button onClick={() => {
            const resetUpgrades = {
              fastJump: false,
              smallBird: false,
              slowPipes: false,
              birdColor: 'yellow',
              ownedColors: ['yellow']
            };

            setMoney(0);
            setMaxScore(0);
            setScore(0);
            setHealthUpgradeCount(0);
            setHealth(100);
            setUpgrades(resetUpgrades);

            Cookies.set('money', '0');
            Cookies.set('maxScore', '0');
            Cookies.set('healthUpgrades', '0');
            Cookies.set('upgrades', JSON.stringify(resetUpgrades));
          }}>
            🔄 Zresetuj wszystko
          </button>
          </div>

          <button className="close-shop" onClick={() => setShowShop(false)}>Zamknij sklep</button>
        </div>
      )}
    </div>
  );
}