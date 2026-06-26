import Phaser from 'phaser';
import { GAME_W, GAME_H, C } from '../config';
import { GameAudio } from '../GameAudio';
import { drawPokeBox, drawRoom } from '../drawing';
import { t } from '../i18n';
import { getHighScores } from '../HighScores';

/**
 * GameOverScene: Score display, high scores, retry/menu.
 */
export class GameOverScene extends Phaser.Scene {
  private g!: Phaser.GameObjects.Graphics;
  private curGfx!: Phaser.GameObjects.Graphics;
  private audio!: GameAudio;
  private cur = 0;
  private score = 0;
  private wave = 1;
  private name = 'RED';
  private texts: Phaser.GameObjects.Text[] = [];

  constructor() { super('GameOver'); }

  init(data: { score: number; wave: number; name: string }): void {
    this.score = data.score || 0;
    this.wave = data.wave || 1;
    this.name = data.name || 'RED';
  }

  create(): void {
    this.g = this.add.graphics().setDepth(0);
    this.curGfx = this.add.graphics().setDepth(15);
    this.audio = new GameAudio();
    this.cur = 0;
    this.texts.forEach(t => t.destroy());
    this.texts = [];

    this.input.keyboard!.on('keydown', (e: KeyboardEvent) => this.handleKey(e.key));
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const mx = pointer.x, my = pointer.y;
      if (mx > 160 && mx < 480) {
        if (my > 400 && my < 430) this.doAction(0);
        if (my > 430 && my < 460) this.doAction(1);
      }
    });
  }

  update(): void {
    this.g.clear();
    drawRoom(this.g);

    drawPokeBox(this.g, 80, 30, 480, 90);
    drawPokeBox(this.g, 80, 140, 480, 90);
    drawPokeBox(this.g, 80, 250, 480, 130);
    drawPokeBox(this.g, 160, 400, 320, 60);

    // Cursor indicator (separate graphics at higher depth)
    this.curGfx.clear();
    const red = Phaser.Display.Color.HexStringToColor(C.uiRed).color;
    this.curGfx.fillStyle(red);
    const cy = 408 + this.cur * 24;
    if (Math.floor(Date.now() / 250) % 2 === 0) {
      this.curGfx.fillTriangle(170, cy, 180, cy + 5, 170, cy + 10);
    }

    if (this.texts.length === 0) {
      const style: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: '"Press Start 2P"', color: C.uiText };
      this.texts.push(this.add.text(320, 48, t('gameOver'), { ...style, fontSize: '22px', color: C.uiRed }).setOrigin(0.5, 0).setDepth(10));
      this.texts.push(this.add.text(320, 82, t('uncleWoke'), { ...style, fontSize: '10px', color: C.uiTextLight }).setOrigin(0.5, 0).setDepth(10));
      this.texts.push(this.add.text(320, 158, `${t('scoreLabel')}: ${this.score}`, { ...style, fontSize: '16px' }).setOrigin(0.5, 0).setDepth(10));
      this.texts.push(this.add.text(320, 185, `${t('waveLabel')}: ${this.wave}  ${t('playerLabel')}: ${this.name}`, { ...style, fontSize: '9px', color: C.uiTextLight }).setOrigin(0.5, 0).setDepth(10));
      this.texts.push(this.add.text(100, 265, t('topScores'), { ...style, fontSize: '9px', color: C.uiRed }).setDepth(10));

      const scores = getHighScores();
      scores.forEach((s, i) => {
        const nm = (s.name || '???').padEnd(8);
        const cur = s.score === this.score && s.name === this.name;
        this.texts.push(this.add.text(100, 288 + i * 18, `${i + 1}. ${nm} ${String(s.score).padStart(6, '0')} W${s.wave}`, {
          ...style, fontSize: '8px', color: cur ? C.uiRed : C.uiText,
        }).setDepth(10));
      });

      this.texts.push(this.add.text(200, 412, t('tryAgain'), { ...style, fontSize: '10px' }).setDepth(10));
      this.texts.push(this.add.text(200, 436, t('mainMenu'), { ...style, fontSize: '10px' }).setDepth(10));
    }
  }

  private handleKey(key: string): void {
    if (key === 'ArrowUp') { this.cur = (this.cur + 1) % 2; this.audio.playMenuNav(); }
    if (key === 'ArrowDown') { this.cur = (this.cur + 1) % 2; this.audio.playMenuNav(); }
    if (key === 'Enter') this.doAction(this.cur);
    if (key === 'Escape') this.scene.start('Title');
  }

  private doAction(idx: number): void {
    this.audio.playMenuSelect();
    if (idx === 0) this.scene.start('Game');
    if (idx === 1) { this.scene.start('Title'); }
  }
}
