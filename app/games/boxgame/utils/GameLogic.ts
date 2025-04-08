// Typy dla przeciwnika
export interface Enemy {
  name: string;
  defense: number;
  attackPower: number;
  level: number;
}

// Funkcja generująca przeciwnika na podstawie poziomu
export const generateEnemy = (level: number): Enemy => {
  const names = [
    'Rookie Rocky', 'Punching Paul', 'Knockout Ken', 'Bashing Barry',
    'Mighty Mike', 'Dangerous Dave', 'Furious Fred', 'Titan Tony',
    'Champion Charlie', 'Brutal Bob', 'Lethal Larry', 'Master Max'
  ];
  
  // Wybierz losowe imię z listy
  const name = names[Math.floor(Math.random() * names.length)];
  
  // Zwiększaj trudność przeciwnika wraz z poziomem
  const defense = 0.1 + (level * 0.05); // Od 0.15 do 0.6 dla poziomów 1-10
  const attackPower = 1 + (level * 0.2); // Od 1.2 do 3.0 dla poziomów 1-10
  
  return {
    name,
    defense,
    attackPower,
    level
  };
};

// Funkcja sprawdzająca czy atak trafił
export const checkHitSuccess = (attackType: string, enemyDefense: number, accuracyBoost: number = 0): boolean => {
  // Różne prawdopodobieństwa trafienia dla różnych ataków
  const baseAccuracy: Record<string, number> = {
    jab: 0.9,       // 90% szans na trafienie
    cross: 0.8,     // 80% szans na trafienie
    hook: 0.7,      // 70% szans na trafienie
    uppercut: 0.6,  // 60% szans na trafienie
    bodyShot: 0.75, // 75% szans na trafienie
    haymaker: 0.4   // 40% szans na trafienie
  };
  
  // Oblicz prawdopodobieństwo trafienia z uwzględnieniem obrony przeciwnika i boosta od trenera
  const accuracy = baseAccuracy[attackType] - enemyDefense + (accuracyBoost * 0.05);
  
  // Losuj czy atak trafił
  return Math.random() < accuracy;
};

// Funkcja obliczająca obrażenia
export const calculateDamage = (attackType: string, level: number, damageBoost: number = 0): number => {
  // Bazowe obrażenia dla różnych ataków
  const baseDamage: Record<string, number> = {
    jab: 5,       // Słaby, ale szybki cios
    cross: 10,    // Średni cios
    hook: 15,     // Silny cios
    uppercut: 20, // Bardzo silny cios
    bodyShot: 12, // Średni cios w korpus
    haymaker: 30  // Najsilniejszy cios, ale trudny do trafienia
  };
  
  // Dodaj losowy czynnik do obrażeń (±20%)
  const randomFactor = 0.8 + (Math.random() * 0.4);
  
  // Zwiększaj obrażenia wraz z poziomem (10% na poziom) i uwzględnij boost z siłowni (15% na poziom)
  const levelBonus = 1 + (level * 0.1);
  const boostMultiplier = 1 + (damageBoost * 0.15);
  
  return baseDamage[attackType] * randomFactor * levelBonus * boostMultiplier;
};
