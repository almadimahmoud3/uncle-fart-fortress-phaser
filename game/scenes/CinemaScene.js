import Phaser from 'phaser';
import { C } from '../config';
import { drawPokeBox, drawRoom } from '../drawing';
import { t as tKey } from '../i18n';
/**
 * CinemaScene: 4-scene intro cinematic (villa exterior, shirt removal, couch sink, Z sleep).
 * Fixed: Text objects created once in create(), reused by setting text/alpha.
 */
export class CinemaScene extends Phaser.Scene {
    constructor() {
        super('Cinema');
        this.timer = 0;
        this.sceneIdx = 0;
        this.sceneDur = 6500;
        this.fadeDur = 800;
    }
    create() {
        this.g = this.add.graphics();
        this.timer = 0;
        this.sceneIdx = 0;
        // Create reusable text objects once
        const style = { fontFamily: '"Press Start 2P"', color: C.uiText };
        this.skipTxt = this.add.text(320, 465, tKey('cinemaSkip'), { ...style, fontSize: '7px', color: C.uiTextLight }).setOrigin(0.5, 0);
        this.captionTxt = this.add.text(320, 396, '', { ...style, fontSize: '10px', color: C.uiRed }).setOrigin(0.5, 0);
        this.caption2Txt = this.add.text(320, 418, '', { ...style, fontSize: '8px', color: C.uiText }).setOrigin(0.5, 0);
        this.bigTxt = this.add.text(320, 200, '', { ...style, fontSize: '16px', color: C.uiRed }).setOrigin(0.5, 0);
        this.input.keyboard.on('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ')
                this.scene.start('Game');
        });
        this.input.on('pointerdown', () => this.scene.start('Game'));
    }
    update(_time, delta) {
        const dt = Math.min(delta, 50);
        this.timer += dt;
        const t = this.timer;
        this.g.clear();
        const fadeOut = Math.min(1, (this.sceneDur - t) / this.fadeDur);
        if (this.sceneIdx === 0)
            this.renderScene0(t, fadeOut);
        else if (this.sceneIdx === 1)
            this.renderScene1(t, fadeOut);
        else if (this.sceneIdx === 2)
            this.renderScene2(t, fadeOut);
        else if (this.sceneIdx === 3)
            this.renderScene3(t);
        // Skip prompt (reuse text object)
        if (this.sceneIdx < 3 || t < 2000) {
            const skipA = this.sceneIdx < 3 ? 0.4 + Math.sin(Date.now() / 300) * 0.3 : Math.max(0, 1 - t / 2000);
            this.skipTxt.setAlpha(skipA);
        }
        else {
            this.skipTxt.setAlpha(0);
        }
        if (t >= this.sceneDur && this.sceneIdx < 3) {
            this.sceneIdx++;
            this.timer = 0;
        }
        if (this.sceneIdx === 3 && t > 5500) {
            this.scene.start('Game');
        }
    }
    setCaption(line1, line2, alpha) {
        this.captionTxt.setText(line1).setAlpha(alpha);
        this.caption2Txt.setText(line2).setAlpha(alpha);
    }
    renderScene0(t, fadeOut) {
        const sky = Phaser.Display.Color.HexStringToColor(C.sky).color;
        const skyLight = Phaser.Display.Color.HexStringToColor(C.skyLight).color;
        const grass2 = Phaser.Display.Color.HexStringToColor(C.grass2).color;
        const grass1 = Phaser.Display.Color.HexStringToColor(C.grass1).color;
        const gray = Phaser.Display.Color.HexStringToColor(C.gray).color;
        const lightGray = Phaser.Display.Color.HexStringToColor(C.lightGray).color;
        const couchDark = Phaser.Display.Color.HexStringToColor(C.couchDark).color;
        const couchBody = Phaser.Display.Color.HexStringToColor(C.couchBody).color;
        const yellow = Phaser.Display.Color.HexStringToColor(C.yellow).color;
        const windowFrame = Phaser.Display.Color.HexStringToColor(C.windowFrame).color;
        const windowGlass = Phaser.Display.Color.HexStringToColor(C.windowGlass).color;
        const trunk = Phaser.Display.Color.HexStringToColor(C.trunk).color;
        const tree2 = Phaser.Display.Color.HexStringToColor(C.tree2).color;
        const tree1 = Phaser.Display.Color.HexStringToColor(C.tree1).color;
        const skin = Phaser.Display.Color.HexStringToColor(C.skin).color;
        const skinDark = Phaser.Display.Color.HexStringToColor(C.skinDark).color;
        const hairBrown = Phaser.Display.Color.HexStringToColor(C.hairBrown).color;
        const shirt = Phaser.Display.Color.HexStringToColor(C.uncleShirt).color;
        const shirtLight = Phaser.Display.Color.HexStringToColor(C.uncleShirtLight).color;
        const pants = Phaser.Display.Color.HexStringToColor(C.pants).color;
        this.g.fillStyle(sky);
        this.g.fillRect(0, 0, 640, 260);
        this.g.fillStyle(skyLight);
        this.g.fillRect(0, 200, 640, 60);
        this.g.fillStyle(0xffffff);
        const co = t * 0.025;
        this.g.fillRect(((80 + co) % 720 - 40) | 0, 30, 44, 14);
        this.g.fillRect(((300 + co * 0.6) % 720 - 40) | 0, 55, 38, 12);
        this.g.fillRect(((520 + co * 0.8) % 720 - 40) | 0, 22, 32, 10);
        this.g.fillStyle(grass2);
        this.g.fillRect(0, 260, 640, 220);
        this.g.fillStyle(grass1);
        for (let i = 0; i < 20; i++)
            this.g.fillRect(i * 34, 258, 20, 6);
        this.g.fillStyle(gray);
        this.g.fillRect(0, 330, 640, 60);
        this.g.fillStyle(lightGray);
        for (let i = 0; i < 16; i++)
            this.g.fillRect(20 + i * 40, 356, 20, 4);
        this.g.fillStyle(0xe8d5b7);
        this.g.fillRect(380, 150, 200, 110);
        this.g.fillStyle(couchDark);
        this.g.fillRect(370, 130, 220, 24);
        this.g.fillStyle(couchBody);
        this.g.fillRect(375, 132, 210, 18);
        this.g.fillStyle(couchDark);
        this.g.fillRect(460, 190, 40, 70);
        this.g.fillStyle(couchBody);
        this.g.fillRect(464, 194, 32, 62);
        this.g.fillStyle(yellow);
        this.g.fillRect(490, 228, 4, 4);
        this.g.fillStyle(windowFrame);
        this.g.fillRect(400, 175, 35, 30);
        this.g.fillStyle(windowGlass);
        this.g.fillRect(404, 179, 27, 22);
        this.g.fillStyle(trunk);
        this.g.fillRect(280, 190, 12, 70);
        this.g.fillStyle(tree2);
        this.g.fillRect(260, 160, 52, 40);
        this.g.fillStyle(tree1);
        this.g.fillRect(268, 148, 36, 20);
        const walkProg = Math.min(1, t / 4500);
        const eased = walkProg < 0.5 ? 2 * walkProg * walkProg : -1 + (4 - 2 * walkProg) * walkProg;
        const ux = (-30 + eased * 490) | 0, uy = 360;
        const leg = walkProg < 0.95 ? Math.sin(t * 0.008) * 5 : 0;
        this.g.fillStyle(0x000000, 0.2);
        this.g.fillRect(ux - 12, uy + 22, 28, 5);
        this.g.fillStyle(pants);
        this.g.fillRect(ux - 4, uy + 14, 7, 10 + leg);
        this.g.fillRect(ux + 3, uy + 14, 7, 10 - leg);
        this.g.fillStyle(shirt);
        this.g.fillRect(ux - 14, uy - 4, 32, 20);
        this.g.fillStyle(shirtLight);
        this.g.fillRect(ux - 12, uy, 28, 12);
        this.g.fillStyle(skin);
        this.g.fillRect(ux - 8, uy - 18, 24, 16);
        this.g.fillStyle(hairBrown);
        this.g.fillRect(ux - 8, uy - 22, 22, 6);
        this.g.fillStyle(0x000000);
        this.g.fillRect(ux - 2, uy - 12, 4, 4);
        this.g.fillRect(ux + 6, uy - 12, 4, 4);
        this.g.fillStyle(skinDark);
        this.g.fillRect(ux + 14, uy - 10, 4, 4);
        this.g.fillStyle(0xc62828);
        this.g.fillRect(ux + 14, uy - 4, 5, 2);
        if (t > 600 && t < 5500) {
            const ta = Math.min(1, (t - 600) / 600) * fadeOut;
            drawPokeBox(this.g, 60, 380, 520, 70);
            this.setCaption(tKey('cinema0Title'), tKey('cinema0Sub'), ta);
        }
        else {
            this.setCaption('', '', 0);
        }
    }
    renderScene1(t, alpha) {
        const wallTop = Phaser.Display.Color.HexStringToColor(C.wallTop).color;
        const wallAccent = Phaser.Display.Color.HexStringToColor(C.wallAccent).color;
        const wallBot = Phaser.Display.Color.HexStringToColor(C.wallBot).color;
        const floor = Phaser.Display.Color.HexStringToColor(C.floor).color;
        const floorTile = Phaser.Display.Color.HexStringToColor(C.floorTile).color;
        const couchDark = Phaser.Display.Color.HexStringToColor(C.couchDark).color;
        const couchBody = Phaser.Display.Color.HexStringToColor(C.couchBody).color;
        const yellow = Phaser.Display.Color.HexStringToColor(C.yellow).color;
        const skin = Phaser.Display.Color.HexStringToColor(C.skin).color;
        const skinDark = Phaser.Display.Color.HexStringToColor(C.skinDark).color;
        const skinShadow = Phaser.Display.Color.HexStringToColor(C.skinShadow).color;
        const hairBrown = Phaser.Display.Color.HexStringToColor(C.hairBrown).color;
        const shirt = Phaser.Display.Color.HexStringToColor(C.uncleShirt).color;
        const shirtLight = Phaser.Display.Color.HexStringToColor(C.uncleShirtLight).color;
        const pants = Phaser.Display.Color.HexStringToColor(C.pants).color;
        this.g.fillStyle(wallTop);
        this.g.fillRect(0, 0, 640, 260);
        this.g.fillStyle(wallAccent);
        for (let y = 8; y < 260; y += 20)
            for (let x = (y % 40 === 8 ? 0 : 16); x < 640; x += 32)
                this.g.fillRect(x, y, 28, 16);
        this.g.fillStyle(wallBot);
        this.g.fillRect(0, 220, 640, 40);
        this.g.fillStyle(wallAccent);
        this.g.fillRect(0, 220, 640, 3);
        this.g.fillStyle(floor);
        this.g.fillRect(0, 260, 640, 220);
        for (let y = 260; y < 480; y += 32)
            for (let x = 0; x < 640; x += 32) {
                this.g.fillStyle((x + y) % 64 === 0 ? floorTile : floor);
                this.g.fillRect(x, y, 32, 32);
            }
        this.g.fillStyle(couchDark);
        this.g.fillRect(480, 60, 60, 160);
        this.g.fillStyle(couchBody);
        this.g.fillRect(484, 64, 52, 152);
        this.g.fillStyle(yellow);
        this.g.fillRect(526, 140, 4, 4);
        this.g.fillStyle(couchDark);
        this.g.fillRect(540, 180, 80, 30);
        this.g.fillStyle(couchBody);
        this.g.fillRect(544, 184, 72, 22);
        const walkIn = Math.min(1, t / 2000);
        const ux = (480 - walkIn * 200) | 0, uy = 300;
        const removeStart = 2500, removeDur = 1500;
        const rp = Math.max(0, Math.min(1, (t - removeStart) / removeDur));
        this.g.fillStyle(pants);
        if (walkIn < 0.95) {
            const leg = Math.sin(t * 0.008) * 5;
            this.g.fillRect(ux - 4, uy + 14, 7, 12 + leg);
            this.g.fillRect(ux + 3, uy + 14, 7, 12 - leg);
        }
        else {
            this.g.fillRect(ux - 4, uy + 14, 7, 14);
            this.g.fillRect(ux + 3, uy + 14, 7, 14);
        }
        if (rp < 0.3) {
            this.g.fillStyle(shirt);
            this.g.fillRect(ux - 14, uy - 4, 32, 20);
            this.g.fillStyle(shirtLight);
            this.g.fillRect(ux - 12, uy, 28, 12);
        }
        else if (rp < 0.6) {
            const liftY = (rp - 0.3) / 0.3;
            this.g.fillStyle(shirt);
            this.g.fillRect(ux - 14, uy - 4 - liftY * 30, 32, 20);
            this.g.fillStyle(skin);
            this.g.fillRect(ux - 14, uy + 4, 32, 14);
        }
        else {
            const flyT = (rp - 0.6) / 0.4;
            const flyX = ux + flyT * 120, flyY = uy - 40 - Math.sin(flyT * Math.PI) * 50;
            this.g.fillStyle(shirt);
            this.g.fillRect((flyX - 14) | 0, (flyY - 8) | 0, 28, 16);
            this.g.fillStyle(skin);
            this.g.fillRect(ux - 14, uy - 4, 32, 20);
            this.g.fillStyle(skinShadow);
            this.g.fillRect(ux - 12, uy + 6, 28, 8);
        }
        this.g.fillStyle(skin);
        this.g.fillRect(ux - 8, uy - 18, 24, 16);
        this.g.fillStyle(hairBrown);
        this.g.fillRect(ux - 8, uy - 22, 22, 6);
        this.g.fillStyle(0x000000);
        this.g.fillRect(ux - 2, uy - 10, 4, 3);
        this.g.fillRect(ux + 6, uy - 10, 4, 3);
        this.g.fillStyle(skinDark);
        this.g.fillRect(ux + 14, uy - 10, 4, 4);
        this.g.fillStyle(0xc62828);
        this.g.fillRect(ux + 14, uy - 4, 5, 2);
        if (t > 600 && t < 5500) {
            const ta = Math.min(1, (t - 600) / 600) * alpha;
            drawPokeBox(this.g, 60, 380, 520, 70);
            this.setCaption(tKey('cinema1Title'), tKey('cinema1Sub'), ta);
        }
        else {
            this.setCaption('', '', 0);
        }
    }
    renderScene2(t, alpha) {
        drawRoom(this.g);
        const couchX = 250, couchY = 280;
        const couchDark = Phaser.Display.Color.HexStringToColor(C.couchDark).color;
        const couchBody = Phaser.Display.Color.HexStringToColor(C.couchBody).color;
        const couchCushion = Phaser.Display.Color.HexStringToColor(C.couchCushion).color;
        const skin = Phaser.Display.Color.HexStringToColor(C.skin).color;
        const skinShadow = Phaser.Display.Color.HexStringToColor(C.skinShadow).color;
        const skinDark = Phaser.Display.Color.HexStringToColor(C.skinDark).color;
        const hairBrown = Phaser.Display.Color.HexStringToColor(C.hairBrown).color;
        const pants = Phaser.Display.Color.HexStringToColor(C.pants).color;
        this.g.fillStyle(couchDark);
        this.g.fillRect(couchX, couchY - 18, 140, 22);
        this.g.fillStyle(couchBody);
        this.g.fillRect(couchX + 2, couchY - 16, 136, 18);
        this.g.fillStyle(couchDark);
        this.g.fillRect(couchX - 10, couchY - 12, 14, 57);
        this.g.fillRect(couchX + 136, couchY - 12, 14, 57);
        this.g.fillStyle(couchBody);
        this.g.fillRect(couchX, couchY, 140, 45);
        this.g.fillStyle(couchCushion);
        this.g.fillRect(couchX + 6, couchY + 4, 128, 31);
        const walkToCouch = Math.min(1, t / 2500);
        const sinkStart = 2500, sinkDur = 2000;
        const sinkProg = Math.max(0, Math.min(1, (t - sinkStart) / sinkDur));
        let ux, uy;
        if (walkToCouch < 1) {
            ux = (80 + walkToCouch * 240) | 0;
            uy = 310;
            const leg = Math.sin(t * 0.008) * 5;
            this.g.fillStyle(0x000000, 0.2);
            this.g.fillRect(ux - 12, uy + 22, 28, 5);
            this.g.fillStyle(pants);
            this.g.fillRect(ux - 4, uy + 14, 7, 10 + leg);
            this.g.fillRect(ux + 3, uy + 14, 7, 10 - leg);
            this.g.fillStyle(skin);
            this.g.fillRect(ux - 14, uy - 4, 32, 20);
            this.g.fillStyle(skinShadow);
            this.g.fillRect(ux - 12, uy + 6, 28, 8);
            this.g.fillStyle(skin);
            this.g.fillRect(ux - 8, uy - 18, 24, 16);
            this.g.fillStyle(hairBrown);
            this.g.fillRect(ux - 8, uy - 22, 22, 6);
            this.g.fillStyle(0x000000);
            this.g.fillRect(ux - 2, uy - 12, 4, 4);
            this.g.fillRect(ux + 6, uy - 12, 4, 4);
            this.g.fillStyle(skinDark);
            this.g.fillRect(ux + 14, uy - 10, 4, 4);
        }
        else {
            ux = 320;
            const bounce = Math.sin(sinkProg * Math.PI * 2) * 8 * (1 - sinkProg);
            uy = couchY - 8 + bounce;
            this.g.fillStyle(skin);
            this.g.fillRect(ux - 28, uy + 4, 56, 20);
            this.g.fillStyle(skinShadow);
            this.g.fillRect(ux - 24, uy + 10, 48, 12);
            this.g.fillStyle(pants);
            this.g.fillRect(ux - 20, uy + 20, 40, 14);
            this.g.fillStyle(skin);
            this.g.fillRect(ux - 18, uy - 12, 36, 20);
            this.g.fillStyle(hairBrown);
            this.g.fillRect(ux - 18, uy - 16, 32, 8);
            const eyeClose = Math.min(1, sinkProg * 2.5);
            this.g.fillStyle(0x000000);
            if (eyeClose < 0.6) {
                this.g.fillRect(ux - 10, uy - 4, 6, 3);
                this.g.fillRect(ux + 6, uy - 4, 6, 3);
            }
            else {
                this.g.fillRect(ux - 10, uy - 4, 6, 1);
                this.g.fillRect(ux + 6, uy - 4, 6, 1);
            }
            this.g.fillStyle(0xc62828);
            this.g.fillRect(ux + 14, uy - 2, 5, 3);
        }
        if (t > 600 && t < 5500) {
            const ta = Math.min(1, (t - 600) / 600) * alpha;
            drawPokeBox(this.g, 60, 380, 520, 70);
            this.setCaption(tKey('cinema2Title'), tKey('cinema2Sub'), ta);
        }
        else {
            this.setCaption('', '', 0);
        }
    }
    renderScene3(t) {
        drawRoom(this.g);
        const couchDark = Phaser.Display.Color.HexStringToColor(C.couchDark).color;
        const couchBody = Phaser.Display.Color.HexStringToColor(C.couchBody).color;
        const couchCushion = Phaser.Display.Color.HexStringToColor(C.couchCushion).color;
        this.g.fillStyle(couchDark);
        this.g.fillRect(250, 262, 140, 22);
        this.g.fillStyle(couchBody);
        this.g.fillRect(252, 264, 136, 18);
        this.g.fillStyle(couchDark);
        this.g.fillRect(240, 268, 14, 57);
        this.g.fillRect(386, 268, 14, 57);
        this.g.fillStyle(couchBody);
        this.g.fillRect(250, 280, 140, 45);
        this.g.fillStyle(couchCushion);
        this.g.fillRect(256, 284, 128, 31);
        const ux = 320, uy = 276;
        const skin = Phaser.Display.Color.HexStringToColor(C.skin).color;
        const skinShadow = Phaser.Display.Color.HexStringToColor(C.skinShadow).color;
        const hairBrown = Phaser.Display.Color.HexStringToColor(C.hairBrown).color;
        const pants = Phaser.Display.Color.HexStringToColor(C.pants).color;
        this.g.fillStyle(skin);
        this.g.fillRect(ux - 28, uy + 4, 56, 20);
        this.g.fillStyle(skinShadow);
        this.g.fillRect(ux - 24, uy + 10, 48, 12);
        this.g.fillStyle(pants);
        this.g.fillRect(ux - 20, uy + 20, 40, 14);
        this.g.fillStyle(skin);
        this.g.fillRect(ux - 18, uy - 12, 36, 20);
        this.g.fillStyle(hairBrown);
        this.g.fillRect(ux - 18, uy - 16, 32, 8);
        this.g.fillStyle(0x000000);
        this.g.fillRect(ux - 10, uy - 4, 6, 1);
        this.g.fillRect(ux + 6, uy - 4, 6, 1);
        const mo = Math.sin(t * 0.004) * 2 + 2;
        this.g.fillStyle(0xc62828);
        this.g.fillRect(ux + 14, uy - 2, 5, (mo | 0) + 2);
        const zProg = Math.min(1, t / 4000);
        const numZ = Math.floor(zProg * 15) + 2;
        const white = Phaser.Display.Color.HexStringToColor(C.uiWhite).color;
        for (let i = 0; i < numZ; i++) {
            const angle = (i / numZ) * Math.PI * 2 + t * 0.0008;
            const dist = 25 + zProg * 200 + Math.sin(t * 0.002 + i) * 20;
            const zx = (ux + 25 + Math.cos(angle) * dist * (0.3 + zProg * 0.7)) | 0;
            const zy = (uy - 15 + Math.sin(angle) * dist * 0.5 - t * 0.008) | 0;
            const s = Math.max(2, ((6 + i * 3 + zProg * 20) / 4) | 0);
            this.g.fillStyle(white, Math.max(0.1, 0.8 - zProg * 0.4));
            this.g.fillRect(zx, zy, s * 3, s);
            this.g.fillRect(zx + s * 2, zy, s, s);
            this.g.fillRect(zx + s, zy + s, s, s);
            this.g.fillRect(zx, zy + s * 2, s, s);
            this.g.fillRect(zx, zy + s * 3, s * 3, s);
        }
        if (zProg > 0.4) {
            const cp = (zProg - 0.4) / 0.6;
            const bg = Phaser.Display.Color.HexStringToColor(C.uiBg).color;
            this.g.fillStyle(bg, cp * 0.9);
            this.g.fillCircle(ux + 25, uy - 15, cp * 500);
        }
        if (t > 2000 && t < 4500) {
            const ta = Math.min(1, (t - 2000) / 500) * Math.max(0, 1 - (t - 3800) / 700);
            this.bigTxt.setText(tKey('cinema3Big')).setAlpha(ta);
        }
        else {
            this.bigTxt.setAlpha(0);
        }
        if (t > 4000) {
            const fp = Math.min(1, (t - 4000) / 1200);
            const bg = Phaser.Display.Color.HexStringToColor(C.uiBg).color;
            this.g.fillStyle(bg, fp);
            this.g.fillRect(0, 0, 640, 480);
        }
        this.setCaption('', '', 0);
    }
}
//# sourceMappingURL=CinemaScene.js.map