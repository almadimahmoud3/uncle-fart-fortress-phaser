import Phaser from 'phaser';
import { C } from './config';
/**
 * Shared drawing utility helpers that replicate the original canvas drawing
 * functions (pokeBox, pokeText, pokeCursor, etc.) using Phaser Graphics objects.
 */
/** Draw a Pokemon-style bordered box */
export function drawPokeBox(g, x, y, w, h) {
    g.fillStyle(Phaser.Display.Color.HexStringToColor(C.uiBorder).color);
    g.fillRect(x, y, w, h);
    g.fillStyle(Phaser.Display.Color.HexStringToColor(C.uiBorderLight).color);
    g.fillRect(x + 2, y + 2, w - 4, h - 4);
    g.fillStyle(Phaser.Display.Color.HexStringToColor(C.uiBg).color);
    g.fillRect(x + 4, y + 4, w - 8, h - 8);
    // Pokeball dots in corners
    const red = Phaser.Display.Color.HexStringToColor(C.uiRed).color;
    g.fillStyle(red);
    g.fillRect(x, y, 6, 3);
    g.fillRect(x + w - 6, y, 6, 3);
    g.fillRect(x, y + h - 3, 6, 3);
    g.fillRect(x + w - 6, y + h - 3, 6, 3);
}
/** Draw the room background (walls, floor, window, picture) */
export function drawRoom(g) {
    const wallTop = Phaser.Display.Color.HexStringToColor(C.wallTop).color;
    const wallAccent = Phaser.Display.Color.HexStringToColor(C.wallAccent).color;
    const wallBot = Phaser.Display.Color.HexStringToColor(C.wallBot).color;
    const floor = Phaser.Display.Color.HexStringToColor(C.floor).color;
    const floorLine = Phaser.Display.Color.HexStringToColor(C.floorLine).color;
    const floorTile = Phaser.Display.Color.HexStringToColor(C.floorTile).color;
    const windowFrame = Phaser.Display.Color.HexStringToColor(C.windowFrame).color;
    const skyLight = Phaser.Display.Color.HexStringToColor(C.skyLight).color;
    const sky = Phaser.Display.Color.HexStringToColor(C.sky).color;
    const curtain = Phaser.Display.Color.HexStringToColor(C.curtain).color;
    const curtainLight = Phaser.Display.Color.HexStringToColor(C.curtainLight).color;
    const grass1 = Phaser.Display.Color.HexStringToColor(C.grass1).color;
    const grass2 = Phaser.Display.Color.HexStringToColor(C.grass2).color;
    const trunk = Phaser.Display.Color.HexStringToColor(C.trunk).color;
    const tree1 = Phaser.Display.Color.HexStringToColor(C.tree1).color;
    const white = 0xffffff;
    // Walls
    g.fillStyle(wallTop);
    g.fillRect(0, 0, 640, 180);
    g.fillStyle(wallAccent);
    for (let y = 8; y < 180; y += 20) {
        for (let x = (y % 40 === 8 ? 0 : 16); x < 640; x += 32) {
            g.fillRect(x, y, 28, 16);
        }
    }
    g.fillStyle(wallBot);
    g.fillRect(0, 140, 640, 40);
    g.fillStyle(wallAccent);
    g.fillRect(0, 140, 640, 3);
    // Floor
    g.fillStyle(floor);
    g.fillRect(0, 180, 640, 300);
    for (let y = 180; y < 480; y += 32) {
        for (let x = 0; x < 640; x += 32) {
            g.fillStyle((x + y) % 64 === 0 ? floorTile : floor);
            g.fillRect(x, y, 32, 32);
            g.fillStyle(floorLine);
            g.fillRect(x, y, 32, 1);
            g.fillRect(x, y, 1, 32);
        }
    }
    // Window
    g.fillStyle(windowFrame);
    g.fillRect(40, 25, 90, 85);
    g.fillStyle(skyLight);
    g.fillRect(44, 29, 82, 77);
    g.fillStyle(sky);
    g.fillRect(48, 33, 36, 33);
    g.fillRect(88, 33, 36, 33);
    g.fillRect(48, 70, 36, 32);
    g.fillRect(88, 70, 36, 32);
    g.fillStyle(windowFrame);
    g.fillRect(84, 29, 4, 77);
    g.fillRect(44, 65, 82, 4);
    g.fillStyle(white);
    g.fillRect(52, 37, 12, 6);
    g.fillRect(56, 34, 8, 4);
    g.fillRect(92, 42, 10, 5);
    g.fillRect(95, 39, 6, 4);
    g.fillStyle(curtain);
    g.fillRect(28, 18, 16, 98);
    g.fillRect(126, 18, 16, 98);
    g.fillStyle(curtainLight);
    g.fillRect(32, 18, 4, 98);
    g.fillRect(130, 18, 4, 98);
    // Picture frame
    const border = Phaser.Display.Color.HexStringToColor(C.uiBorder).color;
    g.fillStyle(border);
    g.fillRect(500, 40, 60, 50);
    g.fillStyle(grass1);
    g.fillRect(504, 44, 52, 42);
    g.fillStyle(grass2);
    g.fillRect(504, 60, 52, 26);
    g.fillStyle(trunk);
    g.fillRect(528, 52, 6, 20);
    g.fillStyle(tree1);
    g.fillRect(520, 42, 22, 14);
}
/** Draw the couch */
export function drawCouch(g, cx, cy, cw, ch) {
    const dark = Phaser.Display.Color.HexStringToColor(C.couchDark).color;
    const body = Phaser.Display.Color.HexStringToColor(C.couchBody).color;
    const cushion = Phaser.Display.Color.HexStringToColor(C.couchCushion).color;
    // Shadow
    g.fillStyle(0x000000, 0.15);
    g.fillRect(cx + 3, cy + 3, cw, ch);
    // Back
    g.fillStyle(dark);
    g.fillRect(cx, cy - 18, cw, 22);
    g.fillStyle(body);
    g.fillRect(cx + 2, cy - 16, cw - 4, 18);
    // Arms
    g.fillStyle(dark);
    g.fillRect(cx - 10, cy - 12, 14, ch + 12);
    g.fillRect(cx + cw - 4, cy - 12, 14, ch + 12);
    g.fillStyle(body);
    g.fillRect(cx - 8, cy - 10, 10, ch + 8);
    g.fillRect(cx + cw - 2, cy - 10, 10, ch + 8);
    // Body
    g.fillStyle(body);
    g.fillRect(cx, cy, cw, ch);
    g.fillStyle(cushion);
    g.fillRect(cx + 6, cy + 4, cw - 12, ch - 14);
    // Cushion lines
    g.fillStyle(body);
    for (let i = cx + 14; i < cx + cw - 10; i += 18)
        g.fillRect(i, cy + 8, 2, ch - 22);
}
/** Draw the uncle sleeping sprite */
export function drawUncleSprite(g, x, y, snoring, shaking) {
    const ox = shaking ? (Math.random() - 0.5) * 3 : 0;
    const oy = shaking ? (Math.random() - 0.5) * 2 : 0;
    const sx = (x + ox) | 0, sy = (y + oy) | 0;
    const skin = Phaser.Display.Color.HexStringToColor(C.skin).color;
    const skinShadow = Phaser.Display.Color.HexStringToColor(C.skinShadow).color;
    const skinDark = Phaser.Display.Color.HexStringToColor(C.skinDark).color;
    const hairBrown = Phaser.Display.Color.HexStringToColor(C.hairBrown).color;
    const shirt = Phaser.Display.Color.HexStringToColor(C.uncleShirt).color;
    const shirtLight = Phaser.Display.Color.HexStringToColor(C.uncleShirtLight).color;
    const uiText = Phaser.Display.Color.HexStringToColor(C.uiText).color;
    const white = 0xffffff;
    // Body (pajamas)
    g.fillStyle(shirt);
    g.fillRect(sx - 28, sy + 8, 56, 24);
    g.fillStyle(shirtLight);
    g.fillRect(sx - 24, sy + 12, 48, 16);
    g.fillStyle(white);
    g.fillRect(sx - 16, sy + 14, 6, 6);
    g.fillRect(sx + 8, sy + 14, 6, 6);
    // Head
    g.fillStyle(skin);
    g.fillRect(sx - 20, sy - 14, 36, 28);
    g.fillStyle(skinShadow);
    g.fillRect(sx - 18, sy + 8, 32, 6);
    // Hair
    g.fillStyle(hairBrown);
    g.fillRect(sx - 20, sy - 18, 32, 8);
    g.fillRect(sx - 24, sy - 14, 8, 10);
    // Closed eyes
    g.fillStyle(uiText);
    g.fillRect(sx - 12, sy - 4, 6, 3);
    g.fillRect(sx + 4, sy - 4, 6, 3);
    // Nose
    g.fillStyle(skinDark);
    g.fillRect(sx + 14, sy - 2, 5, 5);
    // Mouth
    const mo = snoring ? Math.sin(Date.now() / 200) * 2 + 3 : 2;
    const mouth = Phaser.Display.Color.HexStringToColor(C.mouth).color;
    g.fillStyle(mouth);
    g.fillRect(sx + 16, sy + 6, 6, (mo | 0) + 2);
}
/** Draw a relative (enemy) sprite */
export function drawRelativeSprite(g, rel) {
    const x = rel.x | 0, y = rel.y | 0;
    const sz = 20;
    // Shadow
    g.fillStyle(0x000000, 0.2);
    g.fillRect(x - sz / 2, y + sz, sz, 4);
    // Body
    const col = Phaser.Display.Color.HexStringToColor(rel.type.col).color;
    g.fillStyle(col);
    g.fillRect(x - sz / 2, y - sz / 2, sz, sz);
    // Face
    const skin = Phaser.Display.Color.HexStringToColor(C.skin).color;
    g.fillStyle(skin);
    g.fillRect(x - sz / 2 + 3, y - sz / 2 + 3, sz - 6, sz - 6);
    // Eyes
    g.fillStyle(0x000000);
    g.fillRect(x - 5, y - 3, 3, 3);
    g.fillRect(x + 2, y - 3, 3, 3);
    // Eyebrows
    g.fillRect(x - 7, y - 7, 5, 2);
    g.fillRect(x + 2, y - 7, 5, 2);
    // Mouth
    g.fillRect(x - 3, y + 3, 6, 2);
    // HP bar
    if (rel.maxHp > 1) {
        g.fillStyle(0x000000);
        g.fillRect(x - 12, y - sz / 2 - 6, 24, 4);
        const hpCol = rel.poisoned
            ? Phaser.Display.Color.HexStringToColor(C.fartPoison).color
            : Phaser.Display.Color.HexStringToColor(C.grass1).color;
        g.fillStyle(hpCol);
        g.fillRect(x - 12, y - sz / 2 - 6, (24 * rel.hp / rel.maxHp) | 0, 4);
    }
    // Poisoned overlay
    if (rel.poisoned) {
        const poison = Phaser.Display.Color.HexStringToColor(C.fartPoison).color;
        g.fillStyle(poison, 0.25);
        g.fillRect(x - sz / 2 - 2, y - sz / 2 - 2, sz + 4, sz + 4);
    }
    // Hit flash
    if (rel.hitFlash > 0) {
        g.fillStyle(0xffffff, rel.hitFlash / 8);
        g.fillRect(x - sz / 2, y - sz / 2, sz, sz);
    }
}
/** Draw a fart cloud */
export function drawFart(g, f) {
    const age = Date.now() - f.createdAt;
    const alpha = 1 - age / f.lifetime;
    const r = f.radius;
    const isP = f.type === 'silent';
    const green = Phaser.Display.Color.HexStringToColor(isP ? C.fartPoison : C.fartGreen).color;
    const greenDark = Phaser.Display.Color.HexStringToColor(isP ? C.fartPoison : C.fartGreenDark).color;
    for (let i = 3; i >= 0; i--) {
        const ratio = i / 3;
        const sz = r * ratio * (1 - alpha * 0.3);
        const a = alpha * (0.3 + (1 - ratio) * 0.4);
        g.fillStyle(green, a);
        g.fillRect((f.x - sz) | 0, (f.y - sz) | 0, (sz * 2) | 0, (sz * 2) | 0);
    }
    // Stink particles
    g.fillStyle(greenDark, 1);
    for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2 + Date.now() / 400;
        const d = r * 0.4 + Math.sin(Date.now() / 200 + i) * 8;
        g.fillRect((f.x + Math.cos(ang) * d) | 0, (f.y + Math.sin(ang) * d) | 0, 4, 4);
    }
}
/** Draw a particle effect */
export function drawParticle(g, p) {
    const col = Phaser.Display.Color.HexStringToColor(p.col).color;
    g.fillStyle(col, p.a);
    g.fillRect(p.x | 0, p.y | 0, p.s | 0, p.s | 0);
}
//# sourceMappingURL=drawing.js.map