import Phaser from 'phaser';
import { GAME_W, GAME_H, C, REL_TYPES, SPAWNS, FART_TYPES, COUCH } from '../config';
import { GameAudio } from '../GameAudio';
import { getTopScore, saveHighScore } from '../HighScores';
import { drawPokeBox, drawRoom, drawCouch, drawUncleSprite, drawRelativeSprite, drawFart } from '../drawing';
import { t } from '../i18n';
/**
 * GameScene: Main gameplay — relatives approach, uncle farts to stop them.
 */
export class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        this.score = 0;
        this.wave = 1;
        this.sleepLvl = 100;
        this.relatives = [];
        this.farts = [];
        this.particles = [];
        this.floats = [];
        this.snoring = false;
        this.snoreTmr = 0;
        this.spawnTmr = 0;
        this.relsInWave = 0;
        this.relsSpawned = 0;
        this.waveStarted = false;
        this.wakeCd = 0;
        this.waveAnnTmr = 0;
        this.fartAnimActive = false;
        this.fartAnimTimer = 0;
        this.fCD = { quick: 0, mega: 0, silent: 0 };
        this.uiTexts = [];
        // Emoji rendering
        this.relEmojis = new Map();
        // Mobile touch controls
        this.swipeStartX = 0;
        this.swipeStartY = 0;
        this.swipeStart_time = 0;
        this.SWIPE_THRESHOLD = 30;
        this.SWIPE_MAX_TIME = 400;
        this.touchRipples = [];
        this.touchActive = false;
        this.touchX = 0;
        this.touchY = 0;
        this.isMobile = false;
        this.startTime = 0;
        this._fbtnTexts = [];
        this._sideBtnTexts = {};
    }
    create() {
        this.g = this.add.graphics();
        this.audio = new GameAudio();
        this.score = 0;
        this.wave = 1;
        this.sleepLvl = 100;
        this.relatives = [];
        this.farts = [];
        this.particles = [];
        this.floats = [];
        this.snoring = false;
        this.snoreTmr = 0;
        this.spawnTmr = 0;
        this.relsInWave = 0;
        this.relsSpawned = 0;
        this.waveStarted = false;
        this.wakeCd = 0;
        this.waveAnnTmr = 0;
        this.fartAnimActive = false;
        this.fartAnimTimer = 0;
        this.fCD = { quick: 0, mega: 0, silent: 0 };
        // Clear old emojis, texts, and button labels
        this.relEmojis.forEach(e => e.destroy());
        this.relEmojis.clear();
        this.uiTexts.forEach(tx => tx.destroy());
        this.uiTexts = [];
        this._fbtnTexts.forEach(tx => { if (tx)
            tx.destroy(); });
        this._fbtnTexts = [];
        Object.values(this._sideBtnTexts).forEach(tx => tx.destroy());
        this._sideBtnTexts = {};
        if (this.hintTxt) {
            this.hintTxt.destroy();
            this.hintTxt = undefined;
        }
        if (this.waveAnnText) {
            this.waveAnnText.destroy();
            this.waveAnnText = undefined;
        }
        this.audio.playTitleJingle();
        this.audio.init();
        this.startTime = Date.now();
        // Keyboard input
        this.input.keyboard.on('keydown', (e) => {
            if (e.key === 'Escape') {
                this.scene.launch('Pause');
                this.scene.pause();
            }
            if (e.key === '1')
                this.useFart('quick');
            if (e.key === '2')
                this.useFart('mega');
            if (e.key === '3')
                this.useFart('silent');
        });
        // Detect mobile/touch device
        this.isMobile = !this.input.keyboard || this.sys.game.device.input.touch;
        // Deferred tap tracking — don't fire quick fart on pointerdown,
        // only on pointerup if no swipe was detected (prevents double-fire).
        let pendingTapX = 0;
        let pendingTapY = 0;
        let pendingTapActive = false;
        let pendingFartType = null;
        // Touch/click input
        this.input.on('pointerdown', (pointer) => {
            this.touchActive = true;
            this.touchX = pointer.x;
            this.touchY = pointer.y;
            this.swipeStartX = pointer.x;
            this.swipeStartY = pointer.y;
            this.swipeStart_time = Date.now();
            pendingTapX = pointer.x;
            pendingTapY = pointer.y;
            pendingTapActive = true;
            pendingFartType = null;
            const mx = pointer.x, my = pointer.y;
            // Fart button hit zones (larger for mobile — 80px tall)
            if (my >= 400 && my <= 480) {
                if (mx >= 20 && mx <= 190) {
                    this.useFart('quick');
                    this.addRipple(mx, my, C.grass1);
                    pendingTapActive = false;
                }
                else if (mx >= 200 && mx <= 370) {
                    this.useFart('mega');
                    this.addRipple(mx, my, C.orange);
                    pendingTapActive = false;
                }
                else if (mx >= 380 && mx <= 560) {
                    this.useFart('silent');
                    this.addRipple(mx, my, C.fartPoison);
                    pendingTapActive = false;
                }
                return;
            }
            // Side pause button (right top)
            if (mx > 570 && my < 40) {
                this.scene.launch('Pause');
                this.scene.pause();
                pendingTapActive = false;
                return;
            }
            // Side fart buttons (left side)
            if (mx >= 0 && mx <= 60) {
                if (my >= 140 && my < 200) {
                    this.useFart('quick');
                    this.addRipple(mx, my, C.grass1);
                    pendingTapActive = false;
                    return;
                }
                if (my >= 220 && my < 280) {
                    this.useFart('mega');
                    this.addRipple(mx, my, C.orange);
                    pendingTapActive = false;
                    return;
                }
                if (my >= 300 && my < 360) {
                    this.useFart('silent');
                    this.addRipple(mx, my, C.fartPoison);
                    pendingTapActive = false;
                    return;
                }
            }
            // Pause area (wider zone for mobile)
            if (mx > 540 && my < 60) {
                this.scene.launch('Pause');
                this.scene.pause();
                pendingTapActive = false;
                return;
            }
            // On mobile: defer quick fart to pointerup (only if no swipe)
            if (this.isMobile) {
                pendingFartType = 'quick';
            }
        });
        this.input.on('pointermove', (pointer) => {
            if (this.touchActive) {
                this.touchX = pointer.x;
                this.touchY = pointer.y;
            }
        });
        this.input.on('pointerup', (pointer) => {
            this.touchActive = false;
            const dx = pointer.x - this.swipeStartX;
            const dy = pointer.y - this.swipeStartY;
            const dist = Math.hypot(dx, dy);
            const elapsed = Date.now() - this.swipeStart_time;
            let wasSwipe = false;
            // Only register as swipe if fast enough and long enough
            if (elapsed < this.SWIPE_MAX_TIME && dist > this.SWIPE_THRESHOLD) {
                wasSwipe = true;
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0)
                        this.useFart('silent'); // swipe right = poison
                    else
                        this.useFart('mega'); // swipe left = mega
                }
                else {
                    if (dy < 0)
                        this.useFart('mega'); // swipe up = mega
                    else
                        this.useFart('quick'); // swipe down = tiny
                }
                this.addRipple(pointer.x, pointer.y, C.uiRed);
            }
            // Deferred quick fart: only fire if no swipe occurred
            if (pendingTapActive && pendingFartType && !wasSwipe) {
                this.useFart(pendingFartType);
                this.addRipple(pendingTapX, pendingTapY, C.fartGreen);
            }
            pendingTapActive = false;
            pendingFartType = null;
        });
    }
    update(_time, delta) {
        const dt = Math.min(delta, 50);
        this.g.clear();
        // Update cooldowns
        for (const k of ['quick', 'mega', 'silent']) {
            if (this.fCD[k] > 0)
                this.fCD[k] -= dt;
        }
        if (this.wakeCd > 0)
            this.wakeCd -= dt;
        if (this.fartAnimActive) {
            this.fartAnimTimer -= dt;
            if (this.fartAnimTimer <= 0)
                this.fartAnimActive = false;
        }
        if (this.waveAnnTmr > 0)
            this.waveAnnTmr -= dt;
        // Snoring toggle
        this.snoreTmr += dt;
        if (this.snoreTmr > 4000) {
            this.snoring = !this.snoring;
            this.snoreTmr = 0;
            if (this.snoring)
                this.audio.playSnore();
        }
        // Wave management
        if (!this.waveStarted) {
            this.relsInWave = 5 + this.wave * 2;
            this.relsSpawned = 0;
            this.spawnTmr = 0;
            this.waveStarted = true;
            this.waveAnnTmr = 1500;
        }
        const interval = Math.max(500, 1600 - this.wave * 70);
        this.spawnTmr += dt;
        if (this.spawnTmr > interval && this.relsSpawned < this.relsInWave) {
            this.spawnRel();
            this.relsSpawned++;
            this.spawnTmr = 0;
        }
        // Wave complete (only if all spawned and all dead)
        if (this.relsSpawned >= this.relsInWave && this.relatives.length === 0 && this.waveStarted) {
            this.waveStarted = false;
            try {
                this.audio.playWaveComplete();
            }
            catch { /* ignore */ }
            this.wave++;
            const bonus = 50 * this.wave;
            this.score += bonus;
            this.addFloat(320, 200, `${t('wave')} ${this.wave}! +${bonus}`, C.uiText, 14);
        }
        // Update relatives
        for (const r of [...this.relatives]) {
            if (r.hitFlash > 0)
                r.hitFlash -= 1;
            if (r.poisoned) {
                r.poisonTimer -= dt;
                if (r.poisonTimer <= 0) {
                    r.poisoned = false;
                    r.hp -= 2;
                    if (r.hp <= 0) {
                        const pts = r.type.pts * this.wave;
                        this.score += pts;
                        this.addFloat(r.x, r.y - 16, `+${pts}`, C.fartPoison, 10);
                    }
                }
            }
            const dx = COUCH.x + COUCH.w / 2 - r.x;
            const dy = COUCH.y - r.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 18) {
                r.wobble += 0.1;
                r.x += (dx / dist) * r.speed + Math.sin(r.wobble) * 0.3;
                r.y += (dy / dist) * r.speed;
            }
            else {
                if (this.wakeCd <= 0) {
                    this.audio.playWakeUp();
                    this.wakeCd = 500;
                }
                this.sleepLvl -= 20;
                if (this.sleepLvl <= 0)
                    this.gameOver();
            }
        }
        this.relatives = this.relatives.filter(r => r.hp > 0);
        // Update farts
        const now = Date.now();
        this.farts = this.farts.filter(f => now - f.createdAt < f.lifetime);
        // Update particles
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.a -= p.decay;
            p.s = Math.max(1, p.s * 0.97);
        }
        this.particles = this.particles.filter(p => p.a > 0);
        // Update floats
        for (const f of this.floats) {
            f.y += f.vy;
            f.a -= f.decay;
            if (f.textObj) {
                f.textObj.setPosition(f.x, f.y).setAlpha(Math.max(0, f.a));
            }
        }
        // Destroy text objects for expired floats
        const expiredFloats = this.floats.filter(f => f.a <= 0);
        for (const f of expiredFloats) {
            if (f.textObj) {
                f.textObj.destroy();
                f.textObj = undefined;
            }
        }
        this.floats = this.floats.filter(f => f.a > 0);
        // Natural sleep regen
        this.sleepLvl = Math.min(100, this.sleepLvl + 0.06);
        // --- DRAW ---
        drawRoom(this.g);
        drawCouch(this.g, COUCH.x, COUCH.y, COUCH.w, COUCH.h);
        // Farts
        for (const f of this.farts)
            drawFart(this.g, f);
        // Uncle
        drawUncleSprite(this.g, COUCH.x + COUCH.w / 2, COUCH.y - 8, this.snoring, this.fartAnimActive);
        // Relatives
        for (const r of this.relatives) {
            drawRelativeSprite(this.g, r);
            // Update or create emoji text
            let emojiT = this.relEmojis.get(r);
            if (!emojiT) {
                emojiT = this.add.text(r.x, r.y + 4, r.type.emoji, {
                    fontFamily: 'Arial', fontSize: '12px',
                }).setOrigin(0.5, 0.5);
                this.relEmojis.set(r, emojiT);
            }
            emojiT.setPosition(r.x, r.y + 4).setAlpha(1);
        }
        // Clean up emojis for dead relatives
        this.relEmojis.forEach((t, r) => {
            if (!this.relatives.includes(r)) {
                t.destroy();
                this.relEmojis.delete(r);
            }
        });
        // Particles
        for (const p of this.particles) {
            const col = Phaser.Display.Color.HexStringToColor(p.col).color;
            this.g.fillStyle(col, p.a);
            this.g.fillRect(p.x | 0, p.y | 0, p.s | 0, p.s | 0);
        }
        // UI
        this.drawUI();
        // Touch ripples
        for (const rip of this.touchRipples) {
            const col = Phaser.Display.Color.HexStringToColor(rip.col).color;
            this.g.fillStyle(col, rip.alpha * 0.4);
            this.g.fillCircle(rip.x, rip.y, rip.r);
            this.g.lineStyle(2, col, rip.alpha * 0.6);
            this.g.strokeCircle(rip.x, rip.y, rip.r);
            rip.r += 1.5;
            rip.alpha -= 0.04;
        }
        this.touchRipples = this.touchRipples.filter(r => r.alpha > 0);
        // Draw swipe hint overlay on mobile (first 4 seconds)
        if (this.isMobile && this.wave === 1 && this.score === 0) {
            const hintAlpha = Math.max(0, 1 - (Date.now() - this.startTime) / 4000);
            if (hintAlpha > 0) {
                this.g.fillStyle(0x000000, hintAlpha * 0.6);
                this.g.fillRect(0, 0, GAME_W, GAME_H);
                const hx = GAME_W / 2, hy = GAME_H / 2;
                // Background box (taller to fit text)
                this.g.fillStyle(0x000000, hintAlpha * 0.8);
                this.g.fillRect(hx - 200, hy - 100, 400, 200);
                // Border
                const uiRed = Phaser.Display.Color.HexStringToColor(C.uiRed).color;
                this.g.lineStyle(3, uiRed, hintAlpha);
                this.g.strokeRect(hx - 200, hy - 100, 400, 200);
                // Create or reuse hint text
                if (!this.hintTxt) {
                    const tStyle = {
                        fontFamily: '"Press Start 2P"', fontSize: '9px', color: C.uiWhite,
                        wordWrap: { width: 360 }, align: 'center', lineSpacing: 10,
                    };
                    this.hintTxt = this.add.text(hx, hy - 80, [
                        t('mobileControls'),
                        '',
                        t('tapQuick'),
                        t('swipeMega'),
                        t('swipeTiny'),
                        t('swipePoison'),
                        '',
                        t('tapBelow'),
                    ].join('\n'), tStyle).setOrigin(0.5, 0);
                }
                this.hintTxt.setAlpha(hintAlpha);
            }
            else if (this.hintTxt) {
                this.hintTxt.setAlpha(0);
            }
        }
        else if (this.hintTxt) {
            this.hintTxt.setAlpha(0);
        }
    }
    spawnRel() {
        const type = REL_TYPES[Math.floor(Math.random() * REL_TYPES.length)];
        const sp = SPAWNS[Math.floor(Math.random() * SPAWNS.length)];
        this.relatives.push({
            x: sp.x, y: sp.y, type,
            hp: type.hp + Math.floor(this.wave / 3),
            maxHp: type.hp + Math.floor(this.wave / 3),
            speed: type.spd + this.wave * 0.05,
            poisoned: false, poisonTimer: 0,
            wobble: Math.random() * Math.PI * 2, hitFlash: 0,
        });
    }
    useFart(type) {
        if (this.fCD[type] > 0)
            return;
        this.fCD[type] = FART_TYPES[type].maxCd;
        this.audio.playFart(type);
        this.farts.push({
            x: COUCH.x + COUCH.w / 2, y: COUCH.y + 20,
            radius: FART_TYPES[type].radius,
            lifetime: FART_TYPES[type].lifetime,
            createdAt: Date.now(), type,
        });
        this.fartAnimActive = true;
        this.fartAnimTimer = 400;
        // Particles
        const green = type === 'silent' ? C.fartPoison : C.fartGreen;
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: COUCH.x + COUCH.w / 2, y: COUCH.y + 20,
                vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
                s: (Math.random() * 4 + 2) | 0, col: green, a: 1, decay: 0.03,
            });
        }
        // Hit relatives
        const fr = FART_TYPES[type].radius;
        for (const r of this.relatives) {
            if (Math.hypot(r.x - (COUCH.x + COUCH.w / 2), r.y - COUCH.y) < fr) {
                r.hp--;
                r.hitFlash = 8;
                this.audio.playHit();
                for (let i = 0; i < 3; i++) {
                    this.particles.push({
                        x: r.x + (Math.random() - 0.5) * 14, y: r.y + (Math.random() - 0.5) * 14,
                        vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                        s: (Math.random() * 3 + 2) | 0, col: C.fartGreen, a: 1, decay: 0.06,
                    });
                }
                if (type === 'silent' && !r.poisoned) {
                    r.poisoned = true;
                    r.poisonTimer = 3000;
                    this.audio.playPoison();
                }
                if (r.hp <= 0) {
                    const pts = r.type.pts * this.wave;
                    this.score += pts;
                    this.addFloat(r.x, r.y - 16, `+${pts}`, C.uiText, 10);
                    for (let i = 0; i < 6; i++) {
                        this.particles.push({
                            x: r.x, y: r.y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
                            s: (Math.random() * 4 + 2) | 0, col: r.type.col, a: 1, decay: 0.05,
                        });
                    }
                }
            }
        }
        this.relatives = this.relatives.filter(r => r.hp > 0);
    }
    addRipple(x, y, col) {
        this.touchRipples.push({ x, y, r: 8, alpha: 1, col });
    }
    addFloat(x, y, t, col, sz) {
        const textObj = this.add.text(x, y, t, {
            fontFamily: '"Press Start 2P"',
            fontSize: `${sz}px`,
            color: col,
        }).setOrigin(0.5, 0.5);
        this.floats.push({ x, y, t, col, sz, vy: -1.2, a: 1, decay: 0.02, textObj });
    }
    drawUI() {
        const red = Phaser.Display.Color.HexStringToColor(C.uiRed).color;
        const black = 0x000000;
        // Sleep bar
        drawPokeBox(this.g, 8, 8, 160, 34);
        this.g.fillStyle(black);
        this.g.fillRect(16, 28, 136, 8);
        const sleepCol = this.sleepLvl > 60 ? Phaser.Display.Color.HexStringToColor(C.grass1).color
            : this.sleepLvl > 30 ? Phaser.Display.Color.HexStringToColor(C.yellow).color
                : Phaser.Display.Color.HexStringToColor(C.red).color;
        this.g.fillStyle(sleepCol);
        this.g.fillRect(16, 28, (136 * this.sleepLvl / 100) | 0, 8);
        // Wave & Score
        drawPokeBox(this.g, 180, 8, 200, 34);
        drawPokeBox(this.g, 390, 8, 242, 34);
        // Fart buttons (bottom)
        this.drawFBtn(40, 420, '1', t('btnTiny'), this.fCD.quick, FART_TYPES.quick.maxCd, C.grass1);
        this.drawFBtn(210, 420, '2', t('btnMega'), this.fCD.mega, FART_TYPES.mega.maxCd, C.orange);
        this.drawFBtn(380, 420, '3', t('btnPoison'), this.fCD.silent, FART_TYPES.silent.maxCd, C.fartPoison);
        // Mobile side controller buttons
        this.drawSideBtn(8, 140, t('btnTiny'), this.fCD.quick, FART_TYPES.quick.maxCd, C.grass1);
        this.drawSideBtn(8, 220, t('btnMega'), this.fCD.mega, FART_TYPES.mega.maxCd, C.orange);
        this.drawSideBtn(8, 300, t('btnPoison'), this.fCD.silent, FART_TYPES.silent.maxCd, C.fartPoison);
        // Pause button on right side
        this.drawPauseBtn(590, 8);
        // Wave announcement
        if (this.waveAnnTmr > 0) {
            const a = Math.min(1, this.waveAnnTmr / 500);
            drawPokeBox(this.g, 180, 190, 280, 60);
            if (!this.waveAnnText) {
                this.waveAnnText = this.add.text(320, 208, '', {
                    fontFamily: '"Press Start 2P"', fontSize: '18px', color: C.uiRed,
                }).setOrigin(0.5, 0);
            }
            this.waveAnnText.setText(`${t('wave')} ${this.wave}!`).setAlpha(a);
        }
        else if (this.waveAnnText) {
            this.waveAnnText.setAlpha(0);
        }
        // Ensure UI texts exist
        if (this.uiTexts.length === 0) {
            const style = { fontFamily: '"Press Start 2P"', color: C.uiText };
            this.uiTexts.push(this.add.text(16, 14, t('sleep'), { ...style, fontSize: '8px' }));
            this.uiTexts.push(this.add.text(190, 14, '', { ...style, fontSize: '10px' }));
            this.uiTexts.push(this.add.text(190, 28, '', { ...style, fontSize: '8px' }));
            this.uiTexts.push(this.add.text(400, 14, '', { ...style, fontSize: '10px' }));
            this.uiTexts.push(this.add.text(400, 28, '', { ...style, fontSize: '8px', color: C.uiTextLight }));
        }
        this.uiTexts[1].setText(`${t('wave')} ${this.wave}`);
        this.uiTexts[2].setText(`${t('score')} ${this.score}`);
        this.uiTexts[3].setText(`${t('hi')} ${getTopScore()}`);
        this.uiTexts[4].setText(this.registry.get('playerName') || 'RED');
    }
    drawFBtn(x, y, key, label, cd, maxCd, col) {
        const w = 130, h = 50;
        const ready = cd <= 0;
        const prog = ready ? 1 : 1 - cd / maxCd;
        drawPokeBox(this.g, x, y, w, h);
        this.g.fillStyle(0x000000);
        this.g.fillRect(x + 8, y + 36, w - 16, 8);
        const colHex = Phaser.Display.Color.HexStringToColor(col).color;
        this.g.fillStyle(colHex);
        this.g.fillRect(x + 8, y + 36, ((w - 16) * prog) | 0, 8);
        this.g.fillStyle(0xffffff);
        this.g.fillRect(x + 8, y + 36, ((w - 16) * prog) | 0, 2);
        if (ready && Math.floor(Date.now() / 400) % 2 === 0) {
            this.g.fillStyle(0xffffff);
            this.g.fillRect(x + 8, y + 36, w - 16, 2);
        }
        // Button text (create once per button via static tracking)
        const btnIdx = key === '1' ? 0 : key === '2' ? 1 : 2;
        const existingIdx = btnIdx * 2;
        if (!this._fbtnTexts[existingIdx]) {
            const tStyle = { fontFamily: '"Press Start 2P"', fontSize: '8px', color: C.uiText };
            this._fbtnTexts[existingIdx] = this.add.text(x + w / 2, y + 12, `[${key}]`, tStyle).setOrigin(0.5, 0);
            this._fbtnTexts[existingIdx + 1] = this.add.text(x + w / 2, y + 24, label, tStyle).setOrigin(0.5, 0);
        }
    }
    drawPauseBtn(x, y) {
        const size = 28;
        const uiRed = Phaser.Display.Color.HexStringToColor(C.uiRed).color;
        this.g.fillStyle(uiRed, 0.7);
        this.g.fillCircle(x, y + size / 2, size / 2);
        this.g.fillStyle(0xffffff, 0.9);
        this.g.fillRect(x - 4, y + 6, 3, size - 12);
        this.g.fillRect(x + 2, y + 6, 3, size - 12);
    }
    drawSideBtn(x, y, label, cd, maxCd, col) {
        const w = 50, h = 60;
        const ready = cd <= 0;
        const prog = ready ? 1 : 1 - cd / maxCd;
        const uiBg = Phaser.Display.Color.HexStringToColor(C.uiBg).color;
        const uiBorder = Phaser.Display.Color.HexStringToColor(C.uiBorder).color;
        // Button background
        this.g.fillStyle(uiBorder);
        this.g.fillRoundedRect(x, y, w, h, 4);
        this.g.fillStyle(uiBg, 0.85);
        this.g.fillRoundedRect(x + 2, y + 2, w - 4, h - 4, 3);
        // Cooldown bar
        this.g.fillStyle(0x000000, 0.3);
        this.g.fillRect(x + 4, y + h - 12, w - 8, 6);
        const colHex = Phaser.Display.Color.HexStringToColor(col).color;
        this.g.fillStyle(colHex);
        this.g.fillRect(x + 4, y + h - 12, ((w - 8) * prog) | 0, 6);
        // Ready flash
        if (ready && Math.floor(Date.now() / 400) % 2 === 0) {
            this.g.fillStyle(colHex, 0.3);
            this.g.fillRoundedRect(x + 2, y + 2, w - 4, h - 4, 3);
        }
        // Label text (create once)
        const sideKey = 'side_' + label;
        if (!this._sideBtnTexts[sideKey]) {
            const tStyle = { fontFamily: '"Press Start 2P"', fontSize: '6px', color: C.uiText };
            this._sideBtnTexts[sideKey] = this.add.text(x + w / 2, y + h / 2 - 6, label, tStyle).setOrigin(0.5, 0);
        }
    }
    gameOver() {
        this.audio.playGameOver();
        const playerName = this.registry.get('playerName') || 'RED';
        saveHighScore(this.score, this.wave, playerName);
        this.scene.start('GameOver', { score: this.score, wave: this.wave, name: playerName });
    }
}
//# sourceMappingURL=GameScene.js.map