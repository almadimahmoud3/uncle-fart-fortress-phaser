import Phaser from 'phaser';
import './style.css';
import { BootScene } from './game/scenes/BootScene';
import { TitleScene } from './game/scenes/TitleScene';
import { NameScene } from './game/scenes/NameScene';
import { CinemaScene } from './game/scenes/CinemaScene';
import { GameScene } from './game/scenes/GameScene';
import { PauseScene } from './game/scenes/PauseScene';
import { GameOverScene } from './game/scenes/GameOverScene';
import { HighScoresScene } from './game/scenes/HighScoresScene';
import { HowToScene } from './game/scenes/HowToScene';
import { CreditsScene } from './game/scenes/CreditsScene';
import { SettingsScene } from './game/scenes/SettingsScene';
import { GAME_W, GAME_H } from './game/config';
import { initLang } from './game/i18n';
// Initialize saved language preference
initLang();
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_W,
    height: GAME_H,
    pixelArt: true,
    backgroundColor: '#1a1a2e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, TitleScene, NameScene, CinemaScene, GameScene, PauseScene, GameOverScene, HighScoresScene, HowToScene, CreditsScene, SettingsScene],
};
new Phaser.Game(config);
// Register service worker for PWA offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {
            // Service worker registration failed, game still works
        });
    });
}
//# sourceMappingURL=main.js.map