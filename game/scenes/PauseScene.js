import Phaser from 'phaser';
import { GAME_W, GAME_H, C } from '../config';
import { GameAudio } from '../GameAudio';
import { drawPokeBox } from '../drawing';
import { t } from '../i18n';
/**
 * PauseScene: Overlay pause menu launched on top of GameScene.
 */
export class PauseScene extends Phaser.Scene {
    constructor() {
        super('Pause');
        this.cur = 0;
        this.opts = ['RESUME', 'SOUND: ON', 'QUIT TO MENU'];
        this.soundOn = true;
        this.texts = [];
    }
    create() {
        this.g = this.add.graphics();
        this.audio = new GameAudio();
        this.cur = 0;
        this.soundOn = this.registry.get('soundOn') !== false;
        this.opts[1] = `${t('sound')}: ${this.soundOn ? 'ON' : 'OFF'}`;
        this.texts.forEach(tx => tx.destroy());
        this.texts = [];
        this.input.keyboard.on('keydown', (e) => this.handleKey(e.key));
        this.input.on('pointerdown', (pointer) => {
            const mx = pointer.x, my = pointer.y;
            if (mx > 160 && mx < 480) {
                if (my > 180 && my < 220)
                    this.doAction(0);
                if (my > 220 && my < 260)
                    this.doAction(1);
                if (my > 260 && my < 300)
                    this.doAction(2);
            }
        });
    }
    update() {
        this.g.clear();
        // Dim background
        this.g.fillStyle(0x000000, 0.6);
        this.g.fillRect(0, 0, GAME_W, GAME_H);
        drawPokeBox(this.g, 160, 130, 320, 210);
        const opts = [t('resume'), `${t('sound')}: ${this.soundOn ? 'ON' : 'OFF'}`, t('quitToMenu')];
        if (this.texts.length === 0) {
            this.texts.push(this.add.text(320, 148, t('paused'), { fontFamily: '"Press Start 2P"', fontSize: '16px', color: C.uiRed }).setOrigin(0.5, 0));
            opts.forEach((o, i) => {
                const t = this.add.text(200, 190 + i * 36, o, { fontFamily: '"Press Start 2P"', fontSize: '10px', color: C.uiText });
                this.texts.push(t);
            });
        }
        // Update text
        this.texts[2].setText(`${t('sound')}: ${this.soundOn ? 'ON' : 'OFF'}`);
        // Cursor
        const red = Phaser.Display.Color.HexStringToColor(C.uiRed).color;
        this.g.fillStyle(red);
        const cy = 192 + this.cur * 36;
        if (Math.floor(Date.now() / 250) % 2 === 0) {
            this.g.fillTriangle(180, cy, 190, cy + 5, 180, cy + 10);
        }
    }
    handleKey(key) {
        if (key === 'Escape') {
            this.scene.resume('Game');
            this.scene.stop();
        }
        if (key === 'ArrowUp') {
            this.cur = (this.cur + 2) % 3;
            this.audio.playMenuNav();
        }
        if (key === 'ArrowDown') {
            this.cur = (this.cur + 1) % 3;
            this.audio.playMenuNav();
        }
        if (key === 'Enter') {
            this.doAction(this.cur);
        }
    }
    doAction(idx) {
        this.audio.playMenuSelect();
        if (idx === 0) {
            this.scene.resume('Game');
            this.scene.stop();
        }
        if (idx === 1) {
            this.soundOn = !this.soundOn;
            this.registry.set('soundOn', this.soundOn);
            this.opts[1] = `SOUND: ${this.soundOn ? 'ON' : 'OFF'}`;
            if (this.texts[2])
                this.texts[2].setText(this.opts[1]);
        }
        if (idx === 2) {
            this.scene.stop('Game');
            this.scene.start('Title');
        }
    }
}
//# sourceMappingURL=PauseScene.js.map