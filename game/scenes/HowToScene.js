import Phaser from 'phaser';
import { GAME_W, GAME_H, C } from '../config';
import { drawPokeBox } from '../drawing';
import { t } from '../i18n';
/**
 * HowToScene: Instructions screen.
 */
export class HowToScene extends Phaser.Scene {
    constructor() {
        super('HowTo');
        this.texts = [];
    }
    create() {
        this.g = this.add.graphics();
        this.texts.forEach(t => t.destroy());
        this.texts = [];
        const wallTop = Phaser.Display.Color.HexStringToColor(C.wallTop).color;
        this.g.fillStyle(wallTop);
        this.g.fillRect(0, 0, GAME_W, GAME_H);
        drawPokeBox(this.g, 60, 40, 520, 400);
        const style = { fontFamily: '"Press Start 2P"', color: C.uiText };
        this.texts.push(this.add.text(320, 60, t('howTitle'), { ...style, fontSize: '14px', color: C.uiRed }).setOrigin(0.5, 0));
        const lines = [
            t('how1'),
            t('how2'),
            t('how3'),
            t('how4'),
            t('how5'),
            t('how6'),
            t('how7'),
            '',
            t('how8'),
        ];
        lines.forEach((l, i) => {
            this.texts.push(this.add.text(100, 100 + i * 28, l, { ...style, fontSize: '9px' }));
        });
        this.texts.push(this.add.text(320, 400, t('pressEnterBack'), { ...style, fontSize: '8px', color: C.uiTextLight }).setOrigin(0.5, 0));
        this.input.keyboard.once('keydown-ENTER', () => this.scene.start('Title'));
        this.input.keyboard.once('keydown-ESCAPE', () => this.scene.start('Title'));
        this.input.on('pointerdown', () => this.scene.start('Title'));
    }
}
//# sourceMappingURL=HowToScene.js.map