import Phaser from 'phaser';
import { GAME_W, GAME_H, C } from '../config';
import { drawPokeBox } from '../drawing';
import { getHighScores } from '../HighScores';

/**
 * HighScoresScene: View top 5 scores.
 */
export class HighScoresScene extends Phaser.Scene {
  private g!: Phaser.GameObjects.Graphics;
  private texts: Phaser.GameObjects.Text[] = [];

  constructor() { super('HighScores'); }

  create(): void {
    this.g = this.add.graphics();
    this.texts.forEach(t => t.destroy());
    this.texts = [];

    const wallTop = Phaser.Display.Color.HexStringToColor(C.wallTop).color;
    this.g.fillStyle(wallTop); this.g.fillRect(0, 0, GAME_W, GAME_H);

    drawPokeBox(this.g, 100, 60, 440, 350);

    const style: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: '"Press Start 2P"', color: C.uiText };
    this.texts.push(this.add.text(320, 80, 'HIGH SCORES', { ...style, fontSize: '14px', color: C.uiRed }).setOrigin(0.5, 0));

    const scores = getHighScores();
    if (scores.length === 0) {
      this.texts.push(this.add.text(320, 200, 'NO SCORES YET', { ...style, fontSize: '10px', color: C.uiTextLight }).setOrigin(0.5, 0));
    } else {
      scores.forEach((s, i) => {
        const nm = (s.name || '???').padEnd(8);
        this.texts.push(this.add.text(140, 120 + i * 30, `${i + 1}. ${nm} ${String(s.score).padStart(6, '0')} W${s.wave}`, {
          ...style, fontSize: '10px',
        }));
      });
    }

    this.texts.push(this.add.text(320, 380, 'PRESS ENTER TO GO BACK', { ...style, fontSize: '8px', color: C.uiTextLight }).setOrigin(0.5, 0));

    this.input.keyboard!.once('keydown-ENTER', () => this.scene.start('Title'));
    this.input.keyboard!.once('keydown-ESCAPE', () => this.scene.start('Title'));
    this.input.on('pointerdown', () => this.scene.start('Title'));
  }
}
