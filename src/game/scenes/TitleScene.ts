import Phaser from 'phaser';
import { GAME_W, GAME_H, C } from '../config';
import { GameAudio } from '../GameAudio';
import { drawPokeBox, drawRoom, drawCouch } from '../drawing';
import { getTopScore, getHighScores } from '../HighScores';
import { t } from '../i18n';

/**
 * TitleScene: Animated title screen with uncle walking, farting,
 * collapsing on couch, then menu with i18n support.
 */
export class TitleScene extends Phaser.Scene {
  private g!: Phaser.GameObjects.Graphics;
  private audio!: GameAudio;
  private titleCur = 0;
  private titleHS = false;
  private titleHow = false;

  // Menu has 5 items: START, HIGH SCORES, HOW TO PLAY, SETTINGS, CREDITS
  private menuOpts = ['start', 'highScores', 'howToPlay', 'settings', 'credits'];

  // Animation state
  private animTime = 0;
  private phase: 'walk' | 'fart' | 'resume' | 'collapse' | 'idle' = 'walk';
  private uncleX = 680;
  private fartCloud = { x: 0, y: 0, alpha: 0, size: 0 };
  private collapseT = 0;
  private collapseBounce = 0;
  private fartPlayed = false;
  private snorePlayed = false;
  private snoreTimer = 0;

  // Text objects
  private cursorText!: Phaser.GameObjects.Text;
  private menuTexts: Phaser.GameObjects.Text[] = [];

  constructor() { super('Title'); }

  create(): void {
    this.g = this.add.graphics();
    this.audio = new GameAudio();

    this.titleCur = 0;
    this.titleHS = false;
    this.titleHow = false;
    this.resetAnim();

    // Cursor
    this.cursorText = this.add.text(0, 0, '▶', { fontFamily: '"Press Start 2P"', fontSize: '10px', color: C.uiRed }).setVisible(false);

    this.input.keyboard!.on('keydown', (e: KeyboardEvent) => this.handleKey(e.key));
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.handleClick(pointer));
    this.input.keyboard!.once('keydown-ENTER', () => {
      this.audio.init();
    });

    this.audio.startBGMusic(0.045);
  }

  private resetAnim(): void {
    this.animTime = 0;
    this.phase = 'walk';
    this.uncleX = 680;
    this.fartPlayed = false;
    this.snorePlayed = false;
    this.fartCloud = { x: 0, y: 0, alpha: 0, size: 0 };
    this.collapseT = 0;
    this.collapseBounce = 0;
    this.snoreTimer = 0;
  }

  update(_time: number, delta: number): void {
    const dt = Math.min(delta, 50);
    this.audio.updateBGMusic();
    this.g.clear();

    if (this.titleHS) { this.renderTitleHS(); return; }
    if (this.titleHow) { this.renderTitleHow(); return; }

    this.animTime += dt;
    const t = this.animTime;

    // Music volume ramp
    if (t < 2000) this.audio.setBGMusicTargetVol(0.015);
    else if (t < 3000) this.audio.setBGMusicTargetVol(0.025);
    else if (t < 4000) this.audio.setBGMusicTargetVol(0.035);
    else this.audio.setBGMusicTargetVol(0.045);

    // Draw room
    drawRoom(this.g);

    // Draw couch at center-left
    const tcx = 180, tcy = 310;
    drawCouch(this.g, tcx, tcy, 140, 45);

    const uncleY = 350;
    const couchSeatY = tcy - 8;
    const fartTime = 2000;
    const resumeTime = 2600;
    const reachTime = 4000;

    // Animation phases
    if (this.phase === 'walk') {
      const prog = Math.min(1, t / fartTime);
      const eased = prog < 0.5 ? 2 * prog * prog : -1 + (4 - 2 * prog) * prog;
      this.uncleX = 680 - eased * 430;
      if (t >= fartTime) {
        this.phase = 'fart';
        this.animTime = 0;
        if (!this.fartPlayed) { this.audio.playFart('quick'); this.fartPlayed = true; }
      }
    }
    if (this.phase === 'fart') {
      this.fartCloud.x = this.uncleX - 20;
      this.fartCloud.y = uncleY + 10;
      const fp = Math.min(1, t / 600);
      this.fartCloud.size = 20 + fp * 30;
      this.fartCloud.alpha = fp < 0.5 ? fp * 2 : 2 - fp * 2;
      if (t >= 600) { this.phase = 'resume'; this.animTime = 0; }
    }
    if (this.phase === 'resume') {
      const prog2 = Math.min(1, t / (reachTime - resumeTime));
      const startX = 680 - 430;
      const eased2 = prog2 < 0.5 ? 2 * prog2 * prog2 : -1 + (4 - 2 * prog2) * prog2;
      this.uncleX = startX - eased2 * (startX - tcx - 40);
      if (t >= reachTime - resumeTime) { this.phase = 'collapse'; this.animTime = 0; this.collapseT = 0; }
    }
    if (this.phase === 'collapse') {
      this.uncleX = tcx + 40;
      this.collapseT += dt;
      const cp = Math.min(1, this.collapseT / 800);
      this.collapseBounce = Math.sin(cp * Math.PI * 2) * 10 * (1 - cp);
      if (this.collapseT >= 800) {
        this.phase = 'idle';
        this.animTime = 0;
        this.collapseBounce = 0;
        if (!this.snorePlayed) { this.audio.playSnore(); this.snorePlayed = true; }
      }
    }

    // Draw uncle
    const ux = this.uncleX | 0;
    const isWalking = this.phase === 'walk' || this.phase === 'resume';
    const isIdle = this.phase === 'idle';
    const isCollapse = this.phase === 'collapse';
    const isFarting = this.phase === 'fart';
    let uy = uncleY;
    if (isCollapse || isIdle) uy = couchSeatY + this.collapseBounce;

    const shaking = isFarting;
    const ox = shaking ? (Math.random() - 0.5) * 3 : 0;
    const sx = (ux + ox) | 0, sy = uy | 0;

    const skin = Phaser.Display.Color.HexStringToColor(C.skin).color;
    const skinDark = Phaser.Display.Color.HexStringToColor(C.skinDark).color;
    const hairBrown = Phaser.Display.Color.HexStringToColor(C.hairBrown).color;
    const shirt = Phaser.Display.Color.HexStringToColor(C.uncleShirt).color;
    const shirtLight = Phaser.Display.Color.HexStringToColor(C.uncleShirtLight).color;
    const pants = Phaser.Display.Color.HexStringToColor(C.pants).color;
    const mouthCol = Phaser.Display.Color.HexStringToColor(C.mouth).color;

    // Shadow
    this.g.fillStyle(0x000000, 0.2); this.g.fillRect(sx - 12, sy + 22, 28, 5);
    // Legs
    this.g.fillStyle(pants);
    if (isWalking) {
      const leg = Math.sin(this.animTime * 0.01) * 4;
      this.g.fillRect(sx - 4, sy + 14, 7, 10 + leg); this.g.fillRect(sx + 3, sy + 14, 7, 10 - leg);
    } else {
      this.g.fillRect(sx - 4, sy + 14, 7, 12); this.g.fillRect(sx + 3, sy + 14, 7, 12);
    }
    // Body
    this.g.fillStyle(shirt); this.g.fillRect(sx - 14, sy - 4, 32, 20);
    this.g.fillStyle(shirtLight); this.g.fillRect(sx - 12, sy, 28, 12);
    this.g.fillStyle(0xffffff); this.g.fillRect(sx - 6, sy + 2, 5, 5); this.g.fillRect(sx + 6, sy + 2, 5, 5);
    // Head
    this.g.fillStyle(skin); this.g.fillRect(sx - 8, sy - 18, 24, 16);
    this.g.fillStyle(hairBrown); this.g.fillRect(sx - 8, sy - 22, 22, 6); this.g.fillRect(sx - 12, sy - 18, 6, 8);
    // Eyes
    this.g.fillStyle(0x000000);
    if (isIdle || (isCollapse && this.collapseT > 400)) {
      this.g.fillRect(sx - 2, sy - 10, 6, 1); this.g.fillRect(sx + 6, sy - 10, 6, 1);
    } else {
      this.g.fillRect(sx - 2, sy - 12, 4, 4); this.g.fillRect(sx + 6, sy - 12, 4, 4);
    }
    // Nose
    this.g.fillStyle(skinDark); this.g.fillRect(sx + 14, sy - 10, 4, 4);
    // Mouth
    this.g.fillStyle(mouthCol);
    if (isIdle) {
      const mo = Math.sin(this.animTime * 0.005) * 2 + 2;
      this.g.fillRect(sx + 16, sy - 4, 5, (mo | 0) + 2);
    } else if (isCollapse && this.collapseT > 400) {
      this.g.fillRect(sx + 14, sy - 4, 7, 5);
    } else {
      this.g.fillRect(sx + 14, sy - 4, 5, 2);
    }

    // Fart cloud
    if (this.fartCloud.alpha > 0) {
      const fc = this.fartCloud;
      const green = Phaser.Display.Color.HexStringToColor(C.fartGreen).color;
      const greenDark = Phaser.Display.Color.HexStringToColor(C.fartGreenDark).color;
      this.g.fillStyle(green, this.fartCloud.alpha);
      this.g.fillRect(fc.x | 0, fc.y | 0, fc.size | 0, (fc.size * 0.6) | 0);
      this.g.fillStyle(greenDark, this.fartCloud.alpha);
      this.g.fillRect((fc.x - fc.size * 0.3) | 0, (fc.y + fc.size * 0.1) | 0, (fc.size * 0.4) | 0, (fc.size * 0.4) | 0);
    }

    // Z's when idle
    if (isIdle) {
      const white = Phaser.Display.Color.HexStringToColor(C.uiWhite).color;
      for (let i = 0; i < 4; i++) {
        const zt2 = (this.animTime + i * 600) % 3000;
        const za = Math.min(1, zt2 / 300) * Math.max(0, 1 - zt2 / 2500);
        const zx = sx + 20 + Math.sin(zt2 * 0.003 + i) * 8;
        const zy = sy - 20 - (zt2 * 0.04) - i * 10;
        const zs = 8 + i * 3;
        this.g.fillStyle(white, za * 0.8);
        const zxI = zx | 0, zyI = zy | 0;
        const s = Math.max(2, (zs / 4) | 0);
        this.g.fillRect(zxI, zyI, s * 3, s);
        this.g.fillRect(zxI + s * 2, zyI, s, s);
        this.g.fillRect(zxI + s, zyI + s, s, s);
        this.g.fillRect(zxI, zyI + s * 2, s, s);
        this.g.fillRect(zxI, zyI + s * 3, s * 3, s);
      }
    }

    // Ambient snoring
    if (isIdle) {
      this.snoreTimer += dt;
      if (this.snoreTimer > 3500) { this.audio.playSnore(); this.snoreTimer = 0; }
    }

    // Title box
    drawPokeBox(this.g, 60, 10, 520, 100);

    // Title text (we use Phaser text for proper font rendering)
    this.ensureTitleTexts();

    // Menu box
    if (!this.titleHS && !this.titleHow) {
      const menuH = 50 + this.menuOpts.length * 28;
      drawPokeBox(this.g, 380, 130, 240, menuH);
      for (let i = 0; i < this.menuOpts.length; i++) {
        const oy = 148 + i * 28;
        if (i === this.titleCur) {
          this.cursorText.setPosition(395, oy + 2).setVisible(true);
        }
      }
      if (this.menuTexts.length > 0) {
        this.menuTexts.forEach((mt, i) => {
          const oy = 148 + i * 28;
          mt.setPosition(410, oy).setVisible(true);
        });
      }
      // Hi-score text
      this.ensureHiScoreText();
    }
  }

  private titleTexts: Phaser.GameObjects.Text[] = [];
  private hiScoreText!: Phaser.GameObjects.Text;

  private ensureTitleTexts(): void {
    if (this.titleTexts.length > 0) return;
    const style: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: '"Press Start 2P"', color: C.uiText };
    this.titleTexts.push(this.add.text(320, 22, t('titleMain'), { ...style, fontSize: '24px', color: C.uiRed }).setOrigin(0.5, 0));
    this.titleTexts.push(this.add.text(320, 58, t('titleSub'), { ...style, fontSize: '18px' }).setOrigin(0.5, 0));
    this.titleTexts.push(this.add.text(320, 88, t('titleEdition'), { ...style, fontSize: '7px', color: C.uiTextLight }).setOrigin(0.5, 0));

    this.menuOpts.forEach((key) => {
      this.menuTexts.push(this.add.text(410, 0, t(key), { ...style, fontSize: '10px' }));
    });
    this.hiScoreText = this.add.text(320, 450, `${t('hiScore')}: ${getTopScore()}`, { ...style, fontSize: '7px', color: C.uiTextLight }).setOrigin(0.5, 0);
  }

  private ensureHiScoreText(): void {
    if (this.hiScoreText) this.hiScoreText.setText(`${t('hiScore')}: ${getTopScore()}`);
  }

  private renderTitleHS(): void {
    drawPokeBox(this.g, 100, 260, 440, 180);
    const scores = getHighScores();
    if (!this._hsTexts) this._hsTexts = [];
    if (this._hsTexts.length === 0) {
      const style: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: '"Press Start 2P"', fontSize: '9px', color: C.uiText };
      this._hsTexts.push(this.add.text(320, 278, t('highScores'), { ...style, fontSize: '12px', color: C.uiRed }).setOrigin(0.5, 0));
      this._hsTexts.push(this.add.text(320, 330, '', { ...style, color: C.uiTextLight }).setOrigin(0.5, 0));
      for (let i = 0; i < 5; i++) {
        this._hsTexts.push(this.add.text(130, 306 + i * 22, '', style));
      }
      this._hsTexts.push(this.add.text(320, 420, t('pressEnterBack'), { ...style, fontSize: '8px', color: C.uiTextLight }).setOrigin(0.5, 0));
    }
    this._hsTexts[0].setVisible(true);
    if (scores.length === 0) {
      this._hsTexts[1].setVisible(true).setText(t('noScores'));
      for (let i = 0; i < 5; i++) this._hsTexts[2 + i].setVisible(false);
    } else {
      this._hsTexts[1].setVisible(false);
      for (let i = 0; i < 5; i++) {
        if (i < scores.length) {
          const s = scores[i];
          const nm = (s.name || '???').padEnd(8);
          this._hsTexts[2 + i].setVisible(true).setText(`${i + 1}. ${nm} ${String(s.score).padStart(6, '0')} W${s.wave}`);
        } else {
          this._hsTexts[2 + i].setVisible(false);
        }
      }
    }
    this._hsTexts[this._hsTexts.length - 1].setVisible(true);
  }
  private _hsTexts: Phaser.GameObjects.Text[] = [];

  private renderTitleHow(): void {
    drawPokeBox(this.g, 60, 240, 520, 210);
    if (!this._howTexts) this._howTexts = [];
    if (this._howTexts.length === 0) {
      const style: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: '"Press Start 2P"', fontSize: '8px', color: C.uiText };
      this._howTexts.push(this.add.text(320, 258, t('howTitle'), { ...style, fontSize: '12px', color: C.uiRed }).setOrigin(0.5, 0));
      const lines = [
        t('how1'), t('how2'), t('how3'),
        t('how4'), t('how5'), t('how6'),
        t('how7'), t('how8'),
        '', t('pressEnterBack'),
      ];
      lines.forEach((l, i) => {
        const col = i === lines.length - 1 ? C.uiTextLight : C.uiText;
        this._howTexts.push(this.add.text(i < 8 ? 100 : 320, i < 8 ? 286 + i * 18 : 420, l, { ...style, color: col }).setOrigin(i >= 8 ? 0.5 : 0, 0));
      });
    }
  }
  private _howTexts: Phaser.GameObjects.Text[] = [];

  private handleKey(key: string): void {
    this.audio.init();
    if (this.titleHS) {
      if (key === 'Enter' || key === 'Escape') {
        this.titleHS = false;
        this._hsTexts.forEach(t => t.destroy());
        this._hsTexts = [];
        this.resetAnim();
        this.audio.playMenuNav();
      }
      return;
    }
    if (this.titleHow) {
      if (key === 'Enter' || key === 'Escape') {
        this.titleHow = false;
        this._howTexts.forEach(t => t.destroy());
        this._howTexts = [];
        this.resetAnim();
        this.audio.playMenuNav();
      }
      return;
    }
    const menuLen = this.menuOpts.length;
    if (key === 'ArrowUp') { this.titleCur = (this.titleCur + menuLen - 1) % menuLen; this.audio.playMenuNav(); }
    if (key === 'ArrowDown') { this.titleCur = (this.titleCur + 1) % menuLen; this.audio.playMenuNav(); }
    if (key === 'Enter') {
      this.audio.playMenuSelect();
      const opt = this.menuOpts[this.titleCur];
      if (opt === 'start') { this.audio.stopBGMusic(); this.scene.start('Name'); }
      else if (opt === 'highScores') this.titleHS = true;
      else if (opt === 'howToPlay') this.titleHow = true;
      else if (opt === 'settings') { this.audio.stopBGMusic(); this.scene.start('Settings'); }
      else if (opt === 'credits') { this.audio.stopBGMusic(); this.scene.start('Credits'); }
    }
  }

  private handleClick(pointer: Phaser.Input.Pointer): void {
    const mx = pointer.x;
    const my = pointer.y;
    // If HS or HowTo overlay is showing, dismiss it on any tap
    if (this.titleHS) {
      this.titleHS = false;
      this._hsTexts.forEach(t => t.destroy());
      this._hsTexts = [];
      this.resetAnim();
      this.audio.playMenuNav();
      return;
    }
    if (this.titleHow) {
      this.titleHow = false;
      this._howTexts.forEach(t => t.destroy());
      this._howTexts = [];
      this.resetAnim();
      this.audio.playMenuNav();
      return;
    }
    // Menu area touch detection
    if (mx > 380 && mx < 620 && my > 130 && my < 300) {
      // Determine which menu item was tapped
      const tapIdx = Math.floor((my - 148) / 28);
      if (tapIdx >= 0 && tapIdx < this.menuOpts.length) {
        this.titleCur = tapIdx;
        this.audio.playMenuSelect();
        const opt = this.menuOpts[tapIdx];
        if (opt === 'start') { this.audio.stopBGMusic(); this.scene.start('Name'); }
        else if (opt === 'highScores') this.titleHS = true;
        else if (opt === 'howToPlay') this.titleHow = true;
        else if (opt === 'settings') { this.audio.stopBGMusic(); this.scene.start('Settings'); }
        else if (opt === 'credits') { this.audio.stopBGMusic(); this.scene.start('Credits'); }
      }
    }
  }
}
