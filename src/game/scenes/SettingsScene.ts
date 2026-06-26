import Phaser from 'phaser';
import { GAME_W, GAME_H, C } from '../config';
import { GameAudio } from '../GameAudio';
import { drawPokeBox, drawRoom } from '../drawing';
import { t, setLang, getLang } from '../i18n';

/**
 * SettingsScene: Language toggle and settings.
 */
export class SettingsScene extends Phaser.Scene {
  private g!: Phaser.GameObjects.Graphics;
  private curGfx!: Phaser.GameObjects.Graphics;
  private audio!: GameAudio;
  private cur = 0;
  private titleTxt!: Phaser.GameObjects.Text;
  private langTxt!: Phaser.GameObjects.Text;
  private langLabelTxt!: Phaser.GameObjects.Text;
  private hintTxt!: Phaser.GameObjects.Text;
  private _backTxt?: Phaser.GameObjects.Text;

  constructor() { super('Settings'); }

  create(): void {
    this.g = this.add.graphics().setDepth(0);
    this.curGfx = this.add.graphics().setDepth(5);
    this.audio = new GameAudio();
    this.cur = 0;
    if (this._backTxt) { this._backTxt.destroy(); this._backTxt = undefined; }

    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Press Start 2P"', color: C.uiText,
    };

    this.titleTxt = this.add.text(320, 100, t('settingsTitle'), {
      ...style, fontSize: '16px', color: C.uiRed,
    }).setOrigin(0.5, 0).setDepth(10);

    this.langTxt = this.add.text(320, 155, t('language'), {
      ...style, fontSize: '10px', color: C.uiTextLight,
    }).setOrigin(0.5, 0).setDepth(10);

    this.langLabelTxt = this.add.text(320, 210, '', {
      ...style, fontSize: '12px', color: C.uiText,
    }).setOrigin(0.5, 0).setDepth(10);

    this.hintTxt = this.add.text(320, 275, t('pressEnterBack'), {
      ...style, fontSize: '8px', color: C.uiTextLight,
    }).setOrigin(0.5, 0).setDepth(10);

    this.input.keyboard!.on('keydown', (e: KeyboardEvent) => this.handleKey(e.key));
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const mx = pointer.x, my = pointer.y;
      // Back arrow area (top-left)
      if (mx < 60 && my < 60) { this.goBack(); return; }
      // Language toggle area
      if (mx > 160 && mx < 480) {
        if (my > 190 && my < 240) this.toggleLang();
      }
    });
  }

  update(): void {
    this.g.clear();
    drawRoom(this.g);

    // Dim overlay
    this.g.fillStyle(0x000000, 0.5);
    this.g.fillRect(0, 0, GAME_W, GAME_H);

    drawPokeBox(this.g, 100, 80, 440, 280);

    // Back arrow (top-left corner)
    if (!this._backTxt) {
      this._backTxt = this.add.text(25, 25, '◀', {
        fontFamily: '"Press Start 2P"', fontSize: '14px', color: C.uiTextLight,
      }).setOrigin(0.5, 0.5).setDepth(11);
    }

    // Update lang label text (only this one changes dynamically)
    const lang = getLang();
    const langLabel = lang === 'en' ? 'ENGLISH  ▸  日本語' : 'English  ▸  日本語';
    this.langLabelTxt.setText(langLabel);

    // Cursor + highlight (separate graphics at depth 5 — below texts)
    this.curGfx.clear();
    const red = Phaser.Display.Color.HexStringToColor(C.uiRed).color;
    this.curGfx.fillStyle(red);
    const cy = 208;
    if (Math.floor(Date.now() / 250) % 2 === 0) {
      this.curGfx.fillTriangle(170, cy, 180, cy + 5, 170, cy + 10);
    }

    const highlightAlpha = 0.3 + Math.sin(Date.now() / 300) * 0.1;
    this.curGfx.lineStyle(2, red, highlightAlpha);
    this.curGfx.strokeRect(180, 195, 280, 30);
  }

  private toggleLang(): void {
    const current = getLang();
    const newLang = current === 'en' ? 'ja' : 'en';
    setLang(newLang);
    this.audio.playMenuSelect();
    // Update text content in place — never destroy/recreate
    this.titleTxt.setText(t('settingsTitle'));
    this.langTxt.setText(t('language'));
    this.hintTxt.setText(t('pressEnterBack'));
  }

  private goBack(): void {
    this.audio.playMenuNav();
    // Destroy audio before leaving
    this.audio.destroy();
    this.scene.start('Title');
  }

  shutdown(): void {
    // Clean up keyboard listener
    this.input.keyboard?.removeAllListeners();
    this.input.removeAllListeners();
  }

  private handleKey(key: string): void {
    if (key === 'Escape' || key === 'Enter') this.goBack();
    if (key === ' ' || key === 'ArrowLeft' || key === 'ArrowRight') this.toggleLang();
  }
}
