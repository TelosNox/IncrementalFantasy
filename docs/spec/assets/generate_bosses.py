"""Boss-Generator (Kapitel 1). Gleiche Helfer/Iso-Kippung/Palette wie
generate_monsters.py, aber groessere Canvas: Minibosse 96x96 (1,5x),
Kapitel-Boss 128x128 (2x). Bosse sind aufgemotzte Varianten bestehender
Familien (Blandzilla<-Karton-Blando, Fort Knoxious & Vaultron<-Tresor-Safeguard).
Steckbriefe: gegner-katalog.md. Reproduzierbar & erweiterbar.
"""
import os
from PIL import Image, ImageDraw

C={
# Karton (Blando-Familie)
'box':'#c79a5e','boxT':'#ddb987','boxR':'#a2743f','tape':'#ecdcb8','boxDk':'#7d5127',
# Metall (Safeguard-Familie)
'steel':'#525a68','steelH':'#c3cad6','steelD':'#2f343f','steelM':'#6b7482','dial':'#e2e6ec',
# Messing (Zahlenraeder)
'brass':'#c9a24b','brassT':'#e6c463','brassD':'#8a6a26',
# Mako-Glow / Kern
'mako':'#8ef0a0','makoHi':'#d8ffe0','makoD':'#57944a',
# Akzente
'gold':'#e7c14b','red':'#d24b4b','lockRed':'#e2534e','lockRedD':'#a83530',
'eye':'#20242e','white':'#eef0f2'}
def K(k):
    x=C[k].lstrip('#'); return (int(x[0:2],16),int(x[2:4],16),int(x[4:6],16),255)

class P:
    def __init__(s,size=96):
        s.n=size; s.img=Image.new('RGBA',(size,size),(0,0,0,0)); s.d=ImageDraw.Draw(s.img)
    def shadow(s,cx,rx=20,ry=4,a=40):
        sl=Image.new('RGBA',(s.n,s.n),(0,0,0,0))
        ImageDraw.Draw(sl).ellipse([cx-rx,s.n-4-ry,cx+rx,s.n-4+ry],fill=(0,0,0,a))
        s.img=Image.alpha_composite(s.img,sl); s.d=ImageDraw.Draw(s.img)
    def r(s,x,y,w,h,c): s.d.rectangle([x,y,x+w-1,y+h-1],fill=K(c))
    def e(s,cx,cy,rx,ry,c): s.d.ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=K(c))
    def p(s,pts,c): s.d.polygon([(a,b) for a,b in pts],fill=K(c))
    def line(s,pts,c,w): s.d.line([(a,b) for a,b in pts],fill=K(c),width=w)
    def glow(s,cx,cy,rx,ry,c,a=110):   # weiches Leuchten (halbtransparent)
        gl=Image.new('RGBA',(s.n,s.n),(0,0,0,0)); col=K(c)[:3]+(a,)
        ImageDraw.Draw(gl).ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=col)
        s.img=Image.alpha_composite(s.img,gl); s.d=ImageDraw.Draw(s.img)
    def blk(s,x,y,w,hh,fc,tc,rc,dd):   # iso-Quader: Front + heller Deckel + dunkle rechte Seite
        s.r(x,y,w,hh,fc)
        s.d.polygon([(x,y),(x+dd,y-dd),(x+w+dd,y-dd),(x+w,y)],fill=K(tc))
        s.d.polygon([(x+w,y),(x+w+dd,y-dd),(x+w+dd,y+hh-dd),(x+w,y+hh)],fill=K(rc))

# --------------------------------------------------------------------------
def blandzilla():
    """1,5x (96). Kartonturm-Kaiju: gestapelte Umzugskartons, Mako aus den Ritzen."""
    s=P(96); s.shadow(48,30,6,46)
    # Mako-Glow hinter dem Turm (aus den Fugen quellend)
    s.glow(48,58,26,8,'mako',70); s.glow(46,38,22,7,'mako',70)
    # drei gestapelte Kartons (unten -> oben kleiner, leicht versetzt)
    s.blk(22,60,46,28,'box','boxT','boxR',8)
    s.blk(27,40,37,24,'box','boxT','boxR',7)
    s.blk(31,20,33,24,'box','boxT','boxR',6)
    # leuchtende Ritzen an den Fugen
    s.r(27,58,37,2,'mako'); s.r(31,38,33,2,'mako'); s.r(30,63,4,3,'makoD')
    # Klebeband vertikal je Karton + ein diagonaler Streifen
    s.r(41,60,6,28,'tape'); s.r(41,40,6,24,'tape'); s.r(44,20,6,24,'tape')
    s.p([[24,64],[30,62],[31,66],[25,68]],'tape')
    # aufgerissene Kartonlaschen als Arme
    s.p([[27,44],[15,41],[18,52],[27,53]],'boxR')
    s.p([[64,44],[77,40],[74,52],[64,53]],'box'); s.p([[74,40],[74,52],[77,50]],'boxR')
    # Augenbrauen = hochgeknickte Laschen
    s.p([[34,27],[41,23],[42,27]],'boxT'); s.p([[53,27],[60,23],[61,27]],'boxT')
    # Gesicht (grimmig, groesser)
    s.r(36,30,4,5,'eye'); s.r(53,30,4,5,'eye')
    s.r(40,40,15,2,'eye')
    # "THIS SIDE UP" - kopfueber getragene Pfeile (nach unten)
    s.p([[30,68],[37,68],[33,74]],'boxDk'); s.p([[54,68],[61,68],[57,74]],'boxDk')
    return s.img

def fort_knoxious():
    """1,5x (96). Tresor-Panzer-Duo: dicker Safeguard + kleiner Beitresor."""
    s=P(96); s.shadow(44,32,6,42)
    # Haupt-Tresor
    s.blk(16,30,48,50,'steel','steelH','steelD',10)
    # dicke Nietenplatten an den Ecken
    for a in [(20,34),(56,34),(20,72),(56,72)]: s.r(a[0],a[1],5,5,'steelD')
    # LOCKED-Schild oben (rotes Schild + Schloss-Buegel)
    s.r(30,25,20,7,'lockRed'); s.p([[35,25],[35,21],[45,21],[45,25]],'lockRedD'); s.r(38,27,4,3,'white')
    # Augen
    s.r(26,44,4,5,'eye'); s.r(48,44,4,5,'eye')
    # mehrere Messing-Zahlenraeder
    for (cx,cy,rr) in [(28,60,6),(50,60,6),(39,71,5)]:
        s.e(cx,cy,rr,rr,'brass'); s.e(cx,cy,rr-2,rr-2,'brassD'); s.r(cx,cy-rr+1,1,3,'brassT')
    # vergittertes Maul unten
    s.r(26,76,28,4,'steelD')
    for x in [29,34,39,44,49]: s.r(x,74,2,7,'steelM')
    # Beitresor (klein, rechts) - der "Sohn"
    s.blk(66,54,22,26,'steel','steelH','steelD',6)
    for a in [(69,57),(83,57)]: s.r(a[0],a[1],3,3,'steelD')
    s.r(71,63,3,4,'eye'); s.r(80,63,3,4,'eye')
    s.e(76,72,4,4,'brass'); s.e(76,72,2,2,'brassD')
    # Stummelfuesse
    s.r(22,80,6,3,'steelD'); s.r(52,80,6,3,'steelD'); s.r(70,80,4,2,'steelD')
    return s.img

def vaultron():
    """2x (128). Mecha-Tresor-Boss: gestapelte Segmente, Mako-Kerne telegrafieren AoE."""
    s=P(128); s.shadow(64,42,8,54)
    # Mako-Aura hinter den Schultern (Telegraf)
    s.glow(34,54,16,16,'mako',75); s.glow(94,54,16,16,'mako',75)
    # Beine
    s.blk(40,94,18,28,'steel','steelH','steelD',6)
    s.blk(70,94,18,28,'steel','steelH','steelD',6)
    s.r(38,120,22,4,'steelD'); s.r(68,120,22,4,'steelD')
    # Rumpf (grosser Panzerschrank)
    s.blk(30,54,66,46,'steel','steelH','steelD',11)
    for a in [(36,60),(84,60),(36,90),(84,90)]: s.r(a[0],a[1],5,5,'steelD')
    # Geldschein-Schlitze
    for yy in [70,78,86]: s.r(40,yy,20,3,'steelD')
    # MegaCorp-Emblem auf der Brust
    s.r(68,66,20,18,'gold'); s.r(71,69,14,12,'steelD'); s.r(75,72,7,6,'mako'); s.r(77,74,3,2,'makoHi')
    # Arme / Faeuste (kurze Tresor-Ausleger)
    s.blk(12,64,18,16,'steel','steelH','steelD',5)
    s.blk(98,64,18,16,'steel','steelH','steelD',5)
    # Schulter-Mako-Kerne (leuchtend)
    s.e(34,54,7,7,'mako'); s.e(34,54,4,4,'makoHi')
    s.e(94,54,7,7,'mako'); s.e(94,54,4,4,'makoHi')
    # Kopf (Tresortuer-Segment)
    s.blk(46,26,36,28,'steel','steelH','steelD',8)
    # Zyklopen-Auge = leuchtendes Zahlenrad
    s.glow(64,40,10,10,'mako',90)
    s.e(64,40,8,8,'dial'); s.e(64,40,6,6,'brass'); s.e(64,40,3.5,3.5,'mako'); s.e(63,39,1.6,1.6,'makoHi')
    s.r(64,29,1,5,'steelD'); s.r(64,47,1,5,'steelD')
    return s.img

# --------------------------------------------------------------------------
BOSS={'blandzilla':(blandzilla,96),'fort_knoxious':(fort_knoxious,96),'vaultron':(vaultron,128)}
OUT=os.path.join(os.path.dirname(__file__),'bosses'); os.makedirs(OUT,exist_ok=True)

pad=8; cells=[]
for name,(fn,sz) in BOSS.items():
    im=fn()
    im.save(os.path.join(OUT,f'{name}_base.png'))           # native (96 bzw. 128)
    up=im.resize((sz*4,sz*4),Image.NEAREST)                 # 4x Nearest = gleiche Pixelgroesse wie Monster
    up.save(os.path.join(OUT,f'{name}_x4.png'))
    cells.append((name,up,sz*4))
# Kontaktbogen (gemeinsame Grundlinie, Groessen massstabsgetreu)
Wd=sum(c[2] for c in cells)+pad*(len(cells)+1); Ht=max(c[2] for c in cells)+pad*2
sheet=Image.new('RGBA',(Wd,Ht),(0,0,0,0)); x=pad
for name,up,w in cells:
    sheet.paste(up,(x,Ht-pad-up.height)); x+=w+pad
sheet.save(os.path.join(OUT,'_sheet.png'))
print('done',list(BOSS.keys()))
