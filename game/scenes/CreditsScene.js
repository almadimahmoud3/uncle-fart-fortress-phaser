import Phaser from 'phaser';
import { C } from '../config';
import { drawPokeBox, drawRoom } from '../drawing';
import { t } from '../i18n';
/**
 * CreditsScene: Mini story + creator credits (Moga & Yuri).
 */
export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('Credits');
        this.texts = [];
        this.timer = 0;
    }
    create() {
        this.g = this.add.graphics();
        this.timer = 0;
        this.texts.forEach(tx => tx.destroy());
        this.texts = [];
        this.input.keyboard.on('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ')
                this.scene.start('Title');
        });
        this.input.on('pointerdown', () => this.scene.start('Title'));
    }
    update(_time, delta) {
        const dt = Math.min(delta, 50);
        this.timer += dt;
        this.g.clear();
        drawRoom(this.g);
        // Title box
        drawPokeBox(this.g, 80, 20, 480, 50);
        const style = {
            fontFamily: '"Press Start 2P"', color: C.uiText,
        };
        // Create texts once
        if (this.texts.length === 0) {
            // Title
            this.texts.push(this.add.text(320, 34, t('creditsTitle'), {
                ...style, fontSize: '14px', color: C.uiRed,
            }).setOrigin(0.5, 0));
            // Story lines
            const storyLines = [
                t('creditsStory1'),
                t('creditsStory2'),
                t('creditsStory3'),
                t('creditsStory4'),
                t('creditsStory5'),
                t('creditsStory6'),
                t('creditsStory7'),
                t('creditsStory8'),
            ];
            storyLines.forEach((line, i) => {
                this.texts.push(this.add.text(320, 100 + i * 28, line, {
                    ...style, fontSize: '9px', color: C.uiText,
                }).setOrigin(0.5, 0));
            });
            // Divider
            this.texts.push(this.add.text(320, 340, '━━━━━━━━━━━━━━━━━━━━', {
                ...style, fontSize: '8px', color: C.uiBorder,
            }).setOrigin(0.5, 0));
            // Credits
            this.texts.push(this.add.text(320, 370, t('creditsStory9'), {
                ...style, fontSize: '10px', color: C.uiTextLight,
            }).setOrigin(0.5, 0));
            this.texts.push(this.add.text(320, 400, t('creditsNames'), {
                ...style, fontSize: '16px', color: C.uiRed,
            }).setOrigin(0.5, 0));
            this.texts.push(this.add.text(320, 440, t('creditsThanks'), {
                ...style, fontSize: '10px', color: C.uiText,
            }).setOrigin(0.5, 0));
            this.texts.push(this.add.text(320, 465, t('pressEnterBack'), {
                ...style, fontSize: '7px', color: C.uiTextLight,
            }).setOrigin(0.5, 0));
        }
        // Fade in all text elements
        const alpha = Math.min(1, this.timer / 500);
        for (let i = 1; i < this.texts.length; i++) {
            this.texts[i].setAlpha(alpha);
        }
        // Pokeball decorations
        const pokeRed = Phaser.Display.Color.HexStringToColor(C.pokeRed).color;
        const pokeWhite = Phaser.Display.Color.HexStringToColor(C.pokeWhite).color;
        for (let i = 0; i < 3; i++) {
            const bx = 140 + i * 180;
            const by = 335;
            const bounce = Math.sin(this.timer / 300 + i * 1.5) * 4;
            this.g.fillStyle(pokeWhite);
            this.g.fillCircle(bx, by + bounce, 8);
            this.g.fillStyle(pokeRed);
            this.g.fillRect(bx - 8, by + bounce - 8, 16, 8);
            this.g.fillStyle(Phaser.Display.Color.HexStringToColor(C.pokeCenter).color);
            this.g.fillCircle(bx, by + bounce, 3);
        }
        // Back prompt
        const blinkA = 0.5 + Math.sin(this.timer / 200) * 0.5;
        this.texts[this.texts.length - 1].setAlpha(blinkA);
    }
}
//# sourceMappingURL=CreditsScene.js.map