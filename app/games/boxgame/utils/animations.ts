// Typy animacji
export type AnimationType = 'jab' | 'cross' | 'hook' | 'uppercut' | 'bodyShot' | 'haymaker' | null;
export type AnimationDirection = 'player' | 'enemy' | null;

// Funkcja do generowania kluczowych klatek animacji CSS
export const generateKeyframes = () => {
  const keyframes = {
    jab: `
      @keyframes jab {
        0% { transform: translateX(0); }
        50% { transform: translateX(100px); }
        100% { transform: translateX(0); }
      }
    `,
    cross: `
      @keyframes cross {
        0% { transform: translateX(0) rotate(0deg); }
        50% { transform: translateX(120px) rotate(45deg); }
        100% { transform: translateX(0) rotate(0deg); }
      }
    `,
    hook: `
      @keyframes hook {
        0% { transform: translateX(0) translateY(0) rotate(0deg); }
        50% { transform: translateX(80px) translateY(-30px) rotate(90deg); }
        100% { transform: translateX(0) translateY(0) rotate(0deg); }
      }
    `,
    uppercut: `
      @keyframes uppercut {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-100px) rotate(-45deg); }
        100% { transform: translateY(0) rotate(0deg); }
      }
    `,
    bodyShot: `
      @keyframes bodyShot {
        0% { transform: translateX(0) translateY(0); }
        50% { transform: translateX(90px) translateY(50px); }
        100% { transform: translateX(0) translateY(0); }
      }
    `,
    haymaker: `
      @keyframes haymaker {
        0% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-30px) rotate(-45deg); }
        50% { transform: translateX(150px) rotate(90deg); }
        100% { transform: translateX(0) rotate(0deg); }
      }
    `
  };

  return keyframes;
};

// Funkcja do dodawania animacji do elementu DOM
export const applyAnimation = (
  element: HTMLElement | null, 
  animationType: AnimationType, 
  duration: number = 500
) => {
  if (!element || !animationType) return;
  
  const animations: Record<string, string> = {
    jab: 'jab 0.5s ease-in-out',
    cross: 'cross 0.5s ease-in-out',
    hook: 'hook 0.5s ease-in-out',
    uppercut: 'uppercut 0.5s ease-in-out',
    bodyShot: 'bodyShot 0.5s ease-in-out',
    haymaker: 'haymaker 0.7s ease-in-out'
  };
  
  element.style.animation = animations[animationType];
  
  // Usuń animację po zakończeniu
  setTimeout(() => {
    if (element) element.style.animation = '';
  }, duration);
};

// Funkcja do animacji otrzymywania obrażeń
export const applyDamageAnimation = (element: HTMLElement | null) => {
  if (!element) return;
  
  element.style.animation = 'damage 0.3s ease-in-out';
  
  setTimeout(() => {
    if (element) element.style.animation = '';
  }, 300);
};
