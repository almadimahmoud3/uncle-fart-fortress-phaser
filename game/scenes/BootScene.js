import Phaser from 'phaser';
import { GAME_W, GAME_H, C } from '../config';
/**
 * BootScene: Preload assets, load web font, then transition to Title.
 */
export class BootScene extends Phaser.Scene {
    constructor() { super('Boot'); }
    preload() {
        // We draw everything procedurally — no sprite sheets needed.
        // But we do need the Press Start 2P font loaded before we draw text.
        const loadText = this.add.text(GAME_W / 2, GAME_H / 2, 'LOADING...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: C.uiWhite,
        }).setOrigin(0.5);
        // The font is loaded via <link> in index.html; give it a moment.
        this.time.delayedCall(500, () => loadText.destroy());
    }
    create() {
        // Initialize shared audio on the registry so all scenes can access it
        this.registry.set('soundOn', true);
        this.registry.set('playerName', 'RED');
        this.registry.set('score', 0);
        this.registry.set('wave', 1);
        this.registry.set('sleepLvl', 100);
        this.scene.start('Title');
    }
}
//# sourceMappingURL=BootScene.js.map