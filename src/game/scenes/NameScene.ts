import Phaser from 'phaser';
import { GAME_W, GAME_H, C, CHAR_GRID } from '../config';
import { GameAudio } from '../GameAudio';
import { drawPokeBox } from '../drawing';

/**
 * NameScene: Pokemon-style name entry grid.
 */
export class NameScene extends Phaser.Scene {
  private g!: Phaser.GameObjects.Graphics;
  private audio!: GameAudio;
  private cursor = 0;
  private name: string[] = [];
  private texts: Phaser.GameObjects.Text[] = [];
  private nameText!: Phaser.GameObjects.Text;

  constructor() { super('Name'); }

  create(): void {
    this.g = this.add.graphics().setDepth(0);
    this.audio = new GameAudio();
    this.cursor = 0;
    this.name = [];
    // Reset scene state for clean restart
    this._gridDrawn = false;
    this._gridTexts.forEach(t => t.destroy());
    this._gridTexts = [];
    this._touchBtns.forEach(t => t.destroy());
    this._touchBtns = [];
    if (this._titleTxt) { this._titleTxt.destroy(); this._titleTxt = undefined; }
    if (this._instrTxt) { this._instrTxt.destroy(); this._instrTxt = undefined; }
    if (this.nameText) { this.nameText.destroy(); this.nameText = undefined as any; }

    this.input.keyboard!.on('keydown', (e: KeyboardEvent) => this.handleKey(e.key));

    // Touch input: detect grid taps, nav buttons, and bottom bar buttons
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const mx = pointer.x, my = pointer.y;
      this.handleTap(mx, my);
    });
  }

  update(): void {
    this.g.clear();
    const wallTop = Phaser.Display.Color.HexStringToColor(C.wallTop).color;
    this.g.fillStyle(wallTop); this.g.fillRect(0, 0, GAME_W, GAME_H);

    drawPokeBox(this.g, 40, 20, 560, 70);
    drawPokeBox(this.g, 140, 100, 360, 50);
    drawPokeBox(this.g, 60, 170, 520, 220);
    drawPokeBox(this.g, 80, 405, 480, 60);

    // Title text
    if (!this._titleTxt) {
      this._titleTxt = this.add.text(320, 35, "WHAT'S YOUR NAME?", {
        fontFamily: '"Press Start 2P"', fontSize: '14px', color: C.uiRed
      }).setOrigin(0.5, 0).setDepth(10);
    }

    // Name display
    let nm = '';
    for (let i = 0; i < 7; i++) nm += (this.name[i] || '_') + ' ';
    if (!this.nameText) {
      this.nameText = this.add.text(320, 118, nm, {
        fontFamily: '"Press Start 2P"', fontSize: '14px', color: C.uiText
      }).setOrigin(0.5, 0).setDepth(10);
    }
    this.nameText.setText(nm);

    // Blink cursor under name
    if (Math.floor(Date.now() / 400) % 2 === 0) {
      const red = Phaser.Display.Color.HexStringToColor(C.uiRed).color;
      this.g.fillStyle(red);
      this.g.fillRect(155 + this.cursor * 22, 140, 14, 3);
    }

    // Character grid
    if (!this._gridDrawn) {
      this._gridTexts = [];
      CHAR_GRID.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) {
          const ch = row[rx];
          const gx = 90 + rx * 46, gy = 186 + ry * 38;
          const txt = this.add.text(gx + 15, gy + 18, ch, {
            fontFamily: '"Press Start 2P"', fontSize: '14px',
            color: ch === ' ' ? C.uiTextLight : C.uiText
          }).setOrigin(0.5, 0.5);
          this._gridTexts.push(txt);
        }
      });
      this._gridDrawn = true;
    }

    // Highlight selected character
    this._gridTexts.forEach((t, idx) => {
      const ry = Math.floor(idx / 10), rx = idx % 10;
      const gx = 90 + rx * 46, gy = 186 + ry * 38;
      if (idx === this.cursor) {
        const red = Phaser.Display.Color.HexStringToColor(C.uiRed).color;
        this.g.fillStyle(red); this.g.fillRect(gx - 4, gy - 2, 38, 28);
        t.setColor(C.uiWhite);
      } else {
        const ch = CHAR_GRID[Math.floor(idx / 10)][idx % 10];
        t.setColor(ch === ' ' ? C.uiTextLight : C.uiText);
      }
    });

    // Instructions + touch buttons
    if (!this._instrTxt) {
      this._instrTxt = this.add.text(100, 418, 'ARROWS:MOVE  ENTER:SEL  BKSP:DEL', {
        fontFamily: '"Press Start 2P"', fontSize: '7px', color: C.uiText
      }).setDepth(10);
      this.add.text(100, 436, 'ENTER (EMPTY): DONE', {
        fontFamily: '"Press Start 2P"', fontSize: '7px', color: C.uiTextLight
      }).setDepth(10);
    }
    // Touch buttons: DEL and DONE in the bottom bar
    if (this._touchBtns.length === 0) {
      const style: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: '"Press Start 2P"', fontSize: '10px' };
      this._touchBtns.push(this.add.text(150, 420, 'DEL', { ...style, color: C.uiRed }).setOrigin(0.5, 0.5).setDepth(11));
      this._touchBtns.push(this.add.text(380, 420, 'DONE', { ...style, color: C.uiRed }).setOrigin(0.5, 0.5).setDepth(11));
    }
    // Back arrow indicator (top-left)
    if (!this._backTxt) {
      this._backTxt = this.add.text(25, 25, '◀', { fontFamily: '"Press Start 2P"', fontSize: '12px', color: C.uiTextLight }).setOrigin(0.5, 0.5).setDepth(11);
    }
    // Draw touch button outlines
    const red = Phaser.Display.Color.HexStringToColor(C.uiRed).color;
    this.g.lineStyle(2, red, 0.6);
    this.g.strokeRect(120, 408, 60, 30);
    this.g.strokeRect(345, 408, 70, 30);
  }

  private _titleTxt?: Phaser.GameObjects.Text;
  private _instrTxt?: Phaser.GameObjects.Text;
  private _gridTexts: Phaser.GameObjects.Text[] = [];
  private _gridDrawn = false;
  private _touchBtns: Phaser.GameObjects.Text[] = [];
  private _backTxt?: Phaser.GameObjects.Text;

  private handleTap(mx: number, my: number): void {
    // Grid area: x=90..570, y=170..370 (5 rows x 10 cols, 46px wide, 38px tall)
    if (mx >= 90 && mx <= 570 && my >= 170 && my <= 370) {
      const rx = Math.floor((mx - 90) / 46);
      const ry = Math.floor((my - 170) / 38);
      if (rx >= 0 && rx < 10 && ry >= 0 && ry < 5) {
        const idx = ry * 10 + rx;
        const ch = CHAR_GRID[ry]?.[rx] || ' ';
        if (ch !== ' ' && this.name.length < 7) {
          this.name.push(ch);
          this.cursor = idx;
          this.audio.playMenuSelect();
        }
        return;
      }
    }
    // DEL button: x=120..180, y=408..438
    if (mx >= 120 && mx <= 180 && my >= 408 && my <= 438) {
      if (this.name.length > 0) { this.name.pop(); this.audio.playMenuNav(); }
      return;
    }
    // DONE button: x=345..415, y=408..438
    if (mx >= 345 && mx <= 415 && my >= 408 && my <= 438) {
      this.registry.set('playerName', this.name.length > 0 ? this.name.join('') : 'RED');
      this.audio.playMenuSelect();
      this.scene.start('Cinema');
      return;
    }
    // Back arrow (top-left): x=0..50, y=0..50 — go back to title
    if (mx < 50 && my < 50) {
      this.scene.start('Title');
      this.audio.playMenuNav();
    }
  }

  private handleKey(key: string): void {
    this.audio.init();
    if (key === 'ArrowLeft') { this.cursor = Math.max(0, this.cursor - 1); this.audio.playMenuNav(); }
    if (key === 'ArrowRight') { this.cursor = Math.min(49, this.cursor + 1); this.audio.playMenuNav(); }
    if (key === 'ArrowUp') { this.cursor = Math.max(0, this.cursor - 10); this.audio.playMenuNav(); }
    if (key === 'ArrowDown') { this.cursor = Math.min(49, this.cursor + 10); this.audio.playMenuNav(); }
    if (key === 'Enter' || key === ' ') {
      const row = Math.floor(this.cursor / 10), col = this.cursor % 10;
      const ch = CHAR_GRID[row]?.[col] || ' ';
      if (ch !== ' ' && this.name.length < 7) {
        this.name.push(ch);
        this.audio.playMenuSelect();
      } else if (this.name.length > 0) {
        this.registry.set('playerName', this.name.join(''));
        this.scene.start('Cinema');
      }
    }
    if (key === 'Backspace') {
      if (this.name.length > 0) { this.name.pop(); this.audio.playMenuNav(); }
    }
    if (key === 'Escape') { this.scene.start('Title'); this.audio.playMenuNav(); }
  }
}
