#!/usr/bin/env python3
"""Static UI mockups for the Chapter 1 detailed spec.
Composites the existing pixel sprites (characters/monsters/backdrops) into
combat, analysis and reunion screens. Output: docs/spec/assets/mockups/.
"""
from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # docs/spec/assets, relative to this script
OUT  = os.path.join(ROOT, "mockups")
os.makedirs(OUT, exist_ok=True)

W, H = 960, 600
SIDEBAR_W = 208          # ~22%
BOTTOM_H  = 120          # 20%
STAGE_W = W - SIDEBAR_W
STAGE_H = H - BOTTOM_H

# Palette (from charaktere-visuals.md + UI additions)
INK    = (24,27,34)
PANEL  = (34,39,49)
PANEL2 = (44,51,63)
LINE   = (70,80,96)
TEXT   = (223,233,244)
DIM    = (140,152,170)
GOLD   = (231,193,75)
GREEN  = (100,207,135)
RED    = (210,75,75)
BLUE   = (90,150,230)
ORANGE = (240,150,60)
GOLD   = (255,204,51)     # active shock
AMBER  = (224,165,46)     # shock buildup
CYAN   = (90,200,210)

def font(sz, bold=False):
    p = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono%s.ttf" % ("-Bold" if bold else "")
    return ImageFont.truetype(p, sz)

F9  = font(11); F9B = font(11, True)
F11 = font(13); F11B= font(13, True)
F14 = font(16, True); F20 = font(23, True); F26 = font(30, True)

def load(path, scale):
    im = Image.open(path).convert("RGBA")
    return im.resize((im.width*scale, im.height*scale), Image.NEAREST)

def backdrop(name, align=0.5):
    im = Image.open(os.path.join(ROOT,"regions",f"{name}_480.png")).convert("RGBA")
    # scale to stage height, crop to stage width via align (focal motif stays
    # out of the sidebar zone -> align < 0.5 shifts crop to the left)
    s = STAGE_H / im.height
    im = im.resize((int(im.width*s), STAGE_H), Image.NEAREST)
    if im.width < STAGE_W:
        im = im.resize((STAGE_W, STAGE_H), Image.NEAREST)
    x0 = int((im.width - STAGE_W)*align)
    return im.crop((x0,0,x0+STAGE_W,STAGE_H))

def bar(d, x, y, w, h, frac, col, bg=(20,22,28), border=LINE, label=None, lf=F9):
    d.rectangle([x,y,x+w,y+h], fill=bg, outline=border)
    fw = max(0, min(w-2, int((w-2)*frac)))
    if fw>0: d.rectangle([x+1,y+1,x+1+fw,y+h-1], fill=col)
    if label:
        d.text((x+3,y+h//2-6), label, font=lf, fill=TEXT)

def panel(d, box, fill=PANEL, outline=LINE, r=6):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline)

def shadow(base, x, y, w):
    ov = Image.new("RGBA", base.size, (0,0,0,0))
    od = ImageDraw.Draw(ov)
    od.ellipse([x-w//2, y-6, x+w//2, y+6], fill=(0,0,0,90))
    base.alpha_composite(ov)

def sprite(base, path, cx, ground_y, scale=1, flip=False):
    im = load(path, scale)
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    shadow(base, cx, ground_y, int(im.width*0.7))
    base.alpha_composite(im, (cx-im.width//2, ground_y-im.height+4))
    return im

def enemy_head_ui(d, cx, top_y, name, hp_frac, shock=None, telegraph=None):
    w=70
    d.text((cx-w//2, top_y-2), name, font=F9B, fill=TEXT)
    bar(d, cx-w//2, top_y+12, w, 7, hp_frac, RED)
    if telegraph:
        d.text((cx-w//2-6, top_y-16), telegraph, font=F9B, fill=ORANGE)

def glow(base, cx, cy, rr, col, a=80):
    gl=Image.new("RGBA", base.size,(0,0,0,0))
    ImageDraw.Draw(gl).ellipse([cx-rr,cy-rr,cx+rr,cy+rr], fill=col+(a,))
    base.alpha_composite(gl)

def spark(d, cx, cy, s=7, col=(255,236,170)):
    d.line([(cx-s,cy),(cx+s,cy)], fill=col, width=2)
    d.line([(cx,cy-s),(cx,cy+s)], fill=col, width=2)
    d.line([(cx-s+2,cy-s+2),(cx+s-2,cy+s-2)], fill=col, width=1)
    d.line([(cx-s+2,cy+s-2),(cx+s-2,cy-s+2)], fill=col, width=1)

def shock_ring(base, cx, cy, r, frac, active=False):
    """Shock ring (gold/amber). Buildup: fills symmetrically from the bottom
    (6 o'clock). Active: nearly closed with a break gap at the top (12
    o'clock) + spark; countdown empties from the top."""
    if active: glow(base, cx, cy, r+9, GOLD, 70)
    d=ImageDraw.Draw(base); bb=[cx-r,cy-r,cx+r,cy+r]
    d.arc(bb, 0, 360, fill=(60,50,25), width=2)              # track
    if active:
        d.arc(bb, 288, 612, fill=GOLD, width=5)             # closed, break at top
        spark(d, cx, cy-r)                                  # spark at the break point
    else:
        half=frac*180
        d.arc(bb, 90, 90+half, fill=AMBER, width=5)         # left side, rising
        d.arc(bb, 90-half, 90, fill=AMBER, width=5)         # right side, rising

def sidebar(base, region, zone, gil, exp_frac, clvl, prestige_locked=True):
    d = ImageDraw.Draw(base)
    x0 = STAGE_W
    d.rectangle([x0,0,W,H], fill=PANEL)
    d.line([x0,0,x0,H], fill=LINE, width=2)
    pad=x0+12
    d.text((pad,12), "IncrementalFantasy", font=F11B, fill=GOLD)
    d.text((pad,30), f"Chapter 1 – The Grid", font=F9, fill=DIM)
    d.text((pad,46), f"{region}", font=F11B, fill=TEXT)
    d.text((pad,64), f"Zone {zone}", font=F9, fill=DIM)
    # currencies
    yy=88
    d.text((pad,yy), "Gil", font=F9, fill=DIM); d.text((W-70,yy), f"{gil}", font=F9B, fill=GOLD)
    yy+=18
    d.text((pad,yy), f"Claude  Lv {clvl}", font=F9, fill=TEXT)
    bar(d, pad, yy+14, SIDEBAR_W-24, 8, exp_frac, GREEN);
    d.text((pad, yy+24), "EXP", font=F9, fill=DIM)
    # menu
    items=[("Team", True),("Equipment / Shop", True),("Bestiary", True),
           ("Stats", True),("Materia", False),("Prestige / Reunion", not prestige_locked),
           ("Gambits", not prestige_locked)]
    my=yy+52
    for name,active in items:
        col = TEXT if active else (90,98,112)
        d.rounded_rectangle([pad-4,my,W-12,my+24], radius=5,
                            fill=PANEL2 if active else PANEL, outline=LINE)
        d.text((pad+4,my+6), name, font=F9B if active else F9, fill=col)
        if not active:
            d.text((W-30,my+6), "🔒" if False else "×", font=F9, fill=(90,98,112))
            d.text((W-64,my+6), "Ch.2" if name=="Materia" else "Reun.", font=F9, fill=(90,98,112))
        my+=30

def bottombar(base, chars, note=None, show_mode=True):
    d = ImageDraw.Draw(base)
    d.rectangle([0,STAGE_H,STAGE_W,H], fill=INK)
    d.line([0,STAGE_H,STAGE_W,STAGE_H], fill=LINE, width=2)
    pw = STAGE_W//4 - 10
    for i,c in enumerate(chars):
        x = 8 + i*(pw+8); y=STAGE_H+8
        panel(d,[x,y,x+pw,H-8], fill=PANEL2)
        d.text((x+8,y+6), c["name"], font=F9B, fill=TEXT)
        # Auto/Manual switch per character (only visible once the first automation unlocks)
        if show_mode:
            man = c.get("mode","auto")=="manual"
            cw=54
            d.rounded_rectangle([x+pw-cw-6,y+5,x+pw-6,y+20], radius=8,
                fill=(18,40,54) if man else PANEL, outline=CYAN if man else LINE)
            d.text((x+pw-cw-1,y+6), "Manual" if man else "Auto",
                font=F9B if man else F9, fill=CYAN if man else DIM)
        bar(d,x+8,y+24,pw-16,7,c["hp"],GREEN)
        bar(d,x+8,y+33,pw-16,6,c["mp"],BLUE)
        bar(d,x+8,y+42,pw-16,6,c["atb"],GOLD)
        full = c["limit"]>=1.0
        bcol = ORANGE if full else PANEL
        d.rounded_rectangle([x+8,y+52,x+pw-8,y+72], radius=5,
                            fill=bcol, outline=ORANGE if full else LINE)
        d.text((x+14,y+56), "LIMIT!" if full else "Limit", font=F9B, fill=INK if full else DIM)
        bar(d,x+8,y+74,pw-16,5,c["limit"],ORANGE,bg=(20,22,28))
    if note:
        d.text((10,H-16), note, font=F9, fill=DIM)

# ---------------------------------------------------------------------------
def screen_region1():
    base = Image.new("RGBA",(W,H),INK)
    base.alpha_composite(backdrop("reactor_row"),(0,0))
    d = ImageDraw.Draw(base)
    gy = STAGE_H-24
    # Claude solo on the left
    sprite(base,f"{ROOT}/characters/claude_64.png", 150, gy, scale=2)
    d = ImageDraw.Draw(base)
    d.text((150-30, gy-150), "Claude", font=F9B, fill=TEXT)
    bar(d,150-35,gy-136,70,7,1.0,GREEN)
    bar(d,150-35,gy-127,70,6,0.55,BLUE,label=None)
    d.text((150-35,gy-118),"MP 11/20", font=F9, fill=CYAN)
    # 1 Blando on the right (early shock buildup, ring from the bottom)
    sprite(base,f"{ROOT}/monsters/blando_64.png", 560, gy, scale=2, flip=True)
    shock_ring(base, 560, gy-60, 58, 0.15)
    d = ImageDraw.Draw(base)
    enemy_head_ui(d,560,gy-150,"Blando",0.5)
    # Clicker-intro banner
    panel(d,[STAGE_W//2-190, 20, STAGE_W//2+190, 58], fill=(30,34,44), outline=GOLD)
    d.text((STAGE_W//2-176,28), "CLICKER INTRO: Tap 'Attack' to trigger Claude's ATB action", font=F9B, fill=GOLD)
    sidebar(base,"R1 · Reactor Row",3,42,0.30,3)
    bottombar(base,[dict(name="Claude",lv=3,hp=1.0,mp=0.55,atb=0.8,limit=0.62)],
              note="Clicker intro: no Auto/Manual switch yet · Attack refunds MP · Special costs 8 MP · Limit charges via damage",
              show_mode=False)
    base.convert("RGB").save(f"{OUT}/01_region1_klicker.png")
    print("01 ok")

def screen_region3():
    base = Image.new("RGBA",(W,H),INK)
    base.alpha_composite(backdrop("megacorp_tower", align=0.30),(0,0))
    d = ImageDraw.Draw(base)
    gy = STAGE_H-20
    party=[("claude","Claude",1.0),("barrel","Barrel",0.85),("tofa","Tofa",0.7),("arris","Arris",0.9)]
    xs=[100,190,280,370]
    for (key,nm,hpf),x in zip(party,xs):
        sprite(base,f"{ROOT}/characters/{key}_64.png", x, gy, scale=1)
    d=ImageDraw.Draw(base)
    for (key,nm,hpf),x in zip(party,xs):
        d.text((x-24,gy-92),nm,font=F9B,fill=TEXT)
        bar(d,x-28,gy-80,56,6,hpf,GREEN)
    # Enemies on the right: Funkus (shock buildup), Shortfuse (telegraph), Blando (active shock)
    en=[("funkus","Funkus",0.6,0.55,None),
        ("shortfuse","Shortfuse",0.8,None,"! DETONATING"),
        ("blando","Blando",0.35,1.0,None)]
    exs=[500,590,680]
    for (key,nm,hpf,sh,tel),x in zip(en,exs):
        sprite(base,f"{ROOT}/monsters/{key}_64.png", x, gy, scale=1, flip=True)
    # Shock rings (buildup from below vs. active closed + break)
    for (key,nm,hpf,sh,tel),x in zip(en,exs):
        if sh is not None:
            shock_ring(base, x, gy-30, 33, sh, active=(sh>=1.0))
    d=ImageDraw.Draw(base)
    for (key,nm,hpf,sh,tel),x in zip(en,exs):
        enemy_head_ui(d,x,gy-96,nm,hpf,telegraph=tel)
    d.text((680-22,gy-112),"SHOCK!",font=F9B,fill=GOLD)     # active shock (Blando)
    d.text((500-30,gy-112),"Building",font=F9,fill=AMBER)   # shock buildup (Funkus)
    panel(d,[STAGE_W//2-224,18,STAGE_W//2+224,52], fill=(30,34,44), outline=GOLD)
    d.text((STAGE_W//2-212,26),"SHOCK WINDOW (ring closed): DEF ignored · x2 damage · enemy slowed",font=F9B,fill=GOLD)
    sidebar(base,"R3 · MegaCorp Tower",27,318,0.62,15)
    bottombar(base,[
        dict(name="Claude",hp=1.0,mp=0.5,atb=0.9,limit=0.4,mode="auto"),
        dict(name="Barrel",hp=0.85,mp=0.7,atb=0.3,limit=0.5,mode="auto"),
        dict(name="Tofa",hp=0.7,mp=0.6,atb=1.0,limit=1.0,mode="auto"),
        dict(name="Arris",hp=0.9,mp=0.4,atb=0.6,limit=0.3,mode="auto")],
        note="Tofa's Limit is full → trigger it into the Shock window now for max damage · Arris heals at HP<45%")
    base.convert("RGB").save(f"{OUT}/02_region3_shock.png")
    print("02 ok")

def screen_analyse():
    base = Image.new("RGBA",(W,H),INK)
    base.alpha_composite(backdrop("bargain_bazaar"),(0,0))
    # darken
    ov=Image.new("RGBA",base.size,(0,0,0,120)); base.alpha_composite(ov)
    d=ImageDraw.Draw(base)
    # card
    cx0,cy0,cx1,cy1 = 250,90,710,470
    panel(d,[cx0,cy0,cx1,cy1], fill=PANEL, outline=GOLD, r=10)
    d.text((cx0+20,cy0+14),"BESTIARY", font=F11B, fill=GOLD)
    d.text((cx1-140,cy0+14),"Entry 02 / 10", font=F9, fill=DIM)
    d.line([cx0+16,cy0+38,cx1-16,cy0+38], fill=LINE)
    # large sprite
    im=load(f"{ROOT}/monsters/kindlebale_64.png",3)
    base.alpha_composite(im,(cx0+40,cy0+70))
    d=ImageDraw.Draw(base)
    d.text((cx0+40,cy0+66+200),"Kindlebale", font=F14, fill=TEXT)
    d.text((cx0+40,cy0+66+224),"Inspired by: Hedgehog Pie", font=F9, fill=DIM)
    # stats on the right
    sx=cx0+250; sy=cy0+80
    stats=[("HP",55),("ATK",8),("DEF",3),("SPD",90)]
    for i,(k,v) in enumerate(stats):
        d.text((sx,sy+i*30),k,font=F11B,fill=DIM)
        bar(d,sx+50,sy+i*30,150,12,min(1,v/120),CYAN)
        d.text((sx+210,sy+i*30),str(v),font=F11B,fill=TEXT)
    d.text((sx,sy+130),"Weakness:", font=F11B, fill=TEXT)
    d.rounded_rectangle([sx+95,sy+128,sx+185,sy+150],radius=5,fill=(60,40,30),outline=ORANGE)
    d.text((sx+104,sy+131),"FIRE", font=F9B, fill=ORANGE)
    d.text((sx,sy+160),"! Usable from Chapter 2", font=F9, fill=(200,150,90))
    d.text((sx,sy+176),"  (Fire Materia → Shock-affine)", font=F9, fill=DIM)
    d.text((cx0+20,cy1-42),"Auto-analysis on 1st win · knowledge persists through Reunion",
           font=F9, fill=DIM)
    base.convert("RGB").save(f"{OUT}/03_analyse_bestiarium.png")
    print("03 ok")

def screen_reunion():
    base = Image.new("RGBA",(W,H),INK)
    base.alpha_composite(backdrop("megacorp_tower"),(0,0))
    ov=Image.new("RGBA",base.size,(8,10,20,175)); base.alpha_composite(ov)
    d=ImageDraw.Draw(base)
    d.text((W//2-150,40),"REUNION", font=F26, fill=CYAN)
    d.text((W//2-250,84),"Lifestream rebirth · Chapter 1 complete", font=F11, fill=DIM)
    # yield
    panel(d,[W//2-160,120,W//2+160,175], fill=(20,40,50), outline=CYAN, r=8)
    d.text((W//2-140,130),"Yield: Reunion Essence", font=F11B, fill=CYAN)
    d.text((W//2+70,130),"+3", font=F20, fill=CYAN)
    # two columns: reset / persist
    lx0,rx0 = 90, 500
    top=200
    panel(d,[lx0,top,lx0+370,540], fill=PANEL, outline=RED, r=8)
    panel(d,[rx0,top,rx0+370,540], fill=PANEL, outline=GREEN, r=8)
    d.text((lx0+16,top+12),"WILL BE RESET", font=F11B, fill=RED)
    d.text((rx0+16,top+12),"CARRIES OVER", font=F11B, fill=GREEN)
    reset=["Zone progress (back to Z1)","Character levels","Equipment / weapon power","Gil","Limit charge"]
    keep=["Unlocked characters","Learned weapon specials","Bestiary / analyses","Reunion Essence",
          "★ NEW: Programmable Gambits","★ Permanent boost (+x%, capped)"]
    for i,t in enumerate(reset):
        d.text((lx0+18,top+44+i*30),"– "+t, font=F9B, fill=TEXT)
    for i,t in enumerate(keep):
        col = GOLD if t.startswith("★") else TEXT
        d.text((rx0+18,top+44+i*30),("  " if not t.startswith("★") else "")+t, font=F9B, fill=col)
    # button
    d.rounded_rectangle([W//2-110,552,W//2+110,588], radius=8, fill=CYAN, outline=(200,240,245))
    d.text((W//2-96,560),"TRIGGER REUNION", font=F11B, fill=INK)
    base.convert("RGB").save(f"{OUT}/04_reunion.png")
    print("04 ok")

POP_ACTIVE=(251,246,210); POP_DIM=(120,138,178); POP_TITLE=(170,196,255)
RAINBOW=[(226,75,74),(239,159,39),(99,170,34),(55,138,221),(150,120,225)]

def ff7box(base, x0,y0,x1,y1, alpha=236):
    ov=Image.new("RGBA",base.size,(0,0,0,0)); od=ImageDraw.Draw(ov)
    od.rounded_rectangle([x0,y0,x1,y1], radius=9, fill=(22,30,84,alpha),
                         outline=(150,180,255,255), width=2)
    od.rounded_rectangle([x0+3,y0+3,x1-3,y1-3], radius=7, outline=(92,118,198,170), width=1)
    base.alpha_composite(ov)

def poprow(d, xl, y, xr, label, right="", active=True, arrow=False, rainbow=False):
    col = POP_ACTIVE if active else POP_DIM
    if rainbow:
        cx=xl
        for i,ch in enumerate(label):
            d.text((cx,y),ch,font=F11B,fill=RAINBOW[i%5]); cx+=10
    else:
        d.text((xl,y), label, font=(F11B if active else F11), fill=col)
    if arrow: d.text((xr-12,y), ">", font=F11B, fill=col)
    elif right: d.text((xr-len(right)*8, y), right, font=F9, fill=col)

def screen_popup():
    base=Image.new("RGBA",(W,H),INK)
    base.alpha_composite(backdrop("megacorp_tower", align=0.30),(0,0))
    gy=STAGE_H-20
    for key,x in [("claude",100),("barrel",190),("tofa",280),("arris",370)]:
        sprite(base,f"{ROOT}/characters/{key}_64.png", x, gy, scale=1)
    for key,x in [("kindlebale",560),("caffiend",660)]:
        sprite(base,f"{ROOT}/monsters/{key}_64.png", x, gy, scale=1, flip=True)
    d=ImageDraw.Draw(base)
    d.text((370-20,gy-92),"Arris",font=F9B,fill=CYAN)
    d.text((370-26,gy-106),"ready",font=F9B,fill=CYAN)
    # Submenu (Magic opened) left of the main menu
    sx0,sy0,sx1,sy1=316,300,508,470
    ff7box(base,sx0,sy0,sx1,sy1)
    d=ImageDraw.Draw(base)
    d.text((sx0+14,sy0+9),"Magic",font=F9B,fill=POP_TITLE); d.text((sx0+64,sy0+9),">",font=F9B,fill=POP_TITLE)
    sry=sy0+32
    poprow(d,sx0+16,sry,   sx1-14,"Fire",  right="6 MP",  active=True)
    poprow(d,sx0+16,sry+26,sx1-14,"Thunder",  right="6 MP",  active=True)
    poprow(d,sx0+16,sry+52,sx1-14,"Heal",right="8 MP",  active=True)
    poprow(d,sx0+16,sry+78,sx1-14,"Feuga",  right="18 MP", active=False)
    d.text((sx0+16,sry+104),"scroll for more",font=F9,fill=POP_DIM)
    d.text((sx0+14,sy1-20),"grey = not enough MP",font=F9,fill=POP_DIM)
    # Main menu above Arris' panel
    px0,py0,px1,py1=520,286,720,470
    ff7box(base,px0,py0,px1,py1)
    d=ImageDraw.Draw(base)
    d.text((px0+14,py0+9),"Arris  -  ready",font=F9B,fill=POP_TITLE)
    ry=py0+32
    poprow(d,px0+16,ry,    px1-14,"Attack",     active=True)
    poprow(d,px0+16,ry+26, px1-14,"Defend", active=True)
    poprow(d,px0+16,ry+52, px1-14,"Magic", arrow=True, active=True)
    poprow(d,px0+16,ry+78, px1-14,"Heal Wind", right="10 MP", active=True)
    poprow(d,px0+16,ry+104,px1-14,"Limit", rainbow=True)
    d.text((px1-70,ry+104),"charged",font=F9,fill=POP_DIM)
    # Popup -> Arris panel connector line
    d.line([(px0+40,py1),(px0+40,H-BOTTOM_H)], fill=(150,180,255), width=2)
    panel_note="Arris = Manual: once ready, the ENTIRE clock pauses (incl. Shock/telegraphs), popup opens. Team keeps fighting on Auto."
    sidebar(base,"R3 · MegaCorp Tower",24,318,0.62,15)
    bottombar(base,[
        dict(name="Claude",hp=1.0,mp=0.5,atb=0.6,limit=0.3,mode="auto"),
        dict(name="Barrel",hp=0.9,mp=0.7,atb=0.4,limit=0.4,mode="auto"),
        dict(name="Tofa",hp=0.8,mp=0.6,atb=0.5,limit=0.6,mode="auto"),
        dict(name="Arris",hp=0.95,mp=0.9,atb=1.0,limit=0.2,mode="manual")],
        note=panel_note)
    base.convert("RGB").save(f"{OUT}/05_aktions_popup.png")
    print("05 ok")

if __name__=="__main__":
    screen_region1(); screen_region3(); screen_analyse(); screen_reunion(); screen_popup()
    print("All mockups in", OUT)
