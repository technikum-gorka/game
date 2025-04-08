"use client";
import React from 'react';
import styles from './Shop.module.css';

interface ShopProps {
  money: number;
  damageBoost: number;
  accuracyBoost: number;
  maxHealthBoost: number;
  painkillerUsed: boolean;
  onBuyGym: () => void;
  onBuyTrainer: () => void;
  onBuyPainkiller: () => void;
  onClose: () => void;
}

const Shop = ({
  money,
  damageBoost,
  accuracyBoost,
  maxHealthBoost,
  painkillerUsed,
  onBuyGym,
  onBuyTrainer,
  onBuyPainkiller,
  onClose
}: ShopProps) => {
  // Ceny ulepszeń
  const gymPrice = 200 + (damageBoost * 100);
  const trainerPrice = 150 + (accuracyBoost * 75);
  const painkillerPrice = 300;

  return (
    <div className={styles.shopOverlay}>
      <div className={styles.shopContainer}>
        <h2>Sklep Bokserski</h2>
        <div className={styles.balance}>Twoje monety: {money}</div>
        
        <div className={styles.shopItems}>
          <div className={styles.shopItem}>
            <h3>Siłownia</h3>
            <p>Zwiększa obrażenia zadawane przez twoje ciosy.</p>
            <p>Aktualny poziom: {damageBoost}</p>
            <p>Cena: {gymPrice} monet</p>
            <button 
              onClick={onBuyGym} 
              disabled={money < gymPrice}
              className={money < gymPrice ? styles.disabledButton : ''}
              style={{ fontFamily: 'inherit' }}
            >
              Kup ulepszenie
            </button>
          </div>
          
          <div className={styles.shopItem}>
            <h3>Trener</h3>
            <p>Zwiększa prawdopodobieństwo trafienia przeciwnika.</p>
            <p>Aktualny poziom: {accuracyBoost}</p>
            <p>Cena: {trainerPrice} monet</p>
            <button 
              onClick={onBuyTrainer} 
              disabled={money < trainerPrice}
              className={money < trainerPrice ? styles.disabledButton : ''}
              style={{ fontFamily: 'inherit' }}
            >
              Kup ulepszenie
            </button>
          </div>
          
          <div className={styles.shopItem}>
            <h3>Leki przeciwbólowe</h3>
            <p>Zwiększa twoje maksymalne zdrowie o 50 punktów.</p>
            <p>Status: {painkillerUsed ? 'Wykorzystane' : 'Dostępne'}</p>
            <p>Cena: {painkillerPrice} monet</p>
            <button 
              onClick={onBuyPainkiller} 
              disabled={money < painkillerPrice || painkillerUsed}
              className={(money < painkillerPrice || painkillerUsed) ? styles.disabledButton : ''}
              style={{ fontFamily: 'inherit' }}
            >
              {painkillerUsed ? 'Wykorzystane' : 'Kup leki'}
            </button>
          </div>
        </div>
        
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          style={{ fontFamily: 'inherit' }}
        >
          Wróć do gry
        </button>
      </div>
    </div>
  );
};

export default Shop;
