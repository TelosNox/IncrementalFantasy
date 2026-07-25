import os, math
from PIL import Image, ImageDraw

from pixel_io import save_png, upscale

C = {'cloudA':'#9fb0c6','cloudB':'#c4d2e2','cloudTop':'#dfe9f4','cloudHi':'#f0f5fb','cloudSh':'#7d90ab',
'blonde':'#e6c356','blondeH':'#f3dd86','blade':'#c3cad6','bladeH':'#e6eaf0','gold':'#e7c14b','handle':'#6e4523',
'wood':'#a9713f','woodMid':'#98652f','woodD':'#7d5127','woodTop':'#c99a63','ring':'#9aa2b0','metalH':'#e2e6ec',
'gun':'#525a68','gunD':'#2f343f','hairD':'#2a2622','shade':'#2b2f3a','shadeD':'#1f2229','skirt':'#3a3f4c',
'white':'#f2f0e6','whiteT':'#fbf9ef','whiteSh':'#d3d1c4','hair':'#26262f','skin':'#e7b48a','red':'#d24b4b','redL':'#e46a6a',
'pink':'#e0788f','pinkD':'#c15570','led':'#64cf87',
'flower':'#f4b6cf','flowerC':'#f4d35e','eye':'#20242e',
'fanPaper':'#f6ead9','fanPaperSh':'#e3d2b8','rib':'#8a6a3c'}
def K(k):
    x=C[k].lstrip('#'); return (int(x[0:2],16),int(x[2:4],16),int(x[4:6],16),255)

class P:
    def __init__(s): s.img=Image.new('RGBA',(64,64),(0,0,0,0)); s.d=ImageDraw.Draw(s.img)
    def shadow(s,cx):
        sl=Image.new('RGBA',(64,64),(0,0,0,0)); ImageDraw.Draw(sl).ellipse([cx-15,57,cx+15,63],fill=(0,0,0,36))
        s.img=Image.alpha_composite(s.img,sl); s.d=ImageDraw.Draw(s.img)
    def r(s,x,y,w,h,c): s.d.rectangle([x,y,x+w-1,y+h-1],fill=K(c))
    def e(s,cx,cy,rx,ry,c): s.d.ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=K(c))
    def p(s,pts,c): s.d.polygon([(a,b) for a,b in pts],fill=K(c))
    def blk(s,x,y,w,hh,fc,tc,rc,dd):
        s.r(x,y,w,hh,fc)
        s.d.polygon([(x,y),(x+dd,y-dd),(x+w+dd,y-dd),(x+w,y)],fill=K(tc))
        s.d.polygon([(x+w,y),(x+w+dd,y-dd),(x+w+dd,y+hh-dd),(x+w,y+hh)],fill=K(rc))
    def line(s,pts,c,w): s.d.line([(a,b) for a,b in pts],fill=K(c),width=w)

def eyes(s,x1,x2,y): s.r(x1,y,3,4,'eye'); s.r(x2,y,3,4,'eye')
def flower(s,cx,cy,r=3):
    s.e(cx,cy,r,r,'flower'); s.e(cx-r*0.9,cy,r*0.66,r*0.66,'flower')
    s.e(cx+r*0.9,cy,r*0.66,r*0.66,'flower'); s.e(cx,cy-r*0.9,r*0.66,r*0.66,'flower')
    s.e(cx,cy,r*0.46,r*0.46,'flowerC')
def sword(s): s.r(41,51,18,4,'gold'); s.p([(44,51),(58,51),(58,12),(51,5)],'blade'); s.r(47,13,2,38,'bladeH'); s.r(49,55,4,7,'handle')
def vulcan(s,cx,cy):
    s.e(cx,cy,8,8,'gunD'); s.e(cx,cy,6,6,'gun')
    for q in [(0,-4),(3.4,-2),(3.4,2),(0,4),(-3.4,2),(-3.4,-2)]: s.e(cx+q[0],cy+q[1],1.3,1.3,'gunD')
    s.e(cx,cy,1.7,1.7,'gunD'); s.e(cx-2,cy-2,1.3,1.3,'metalH')
def bez(P0,P1,P2,P3,n=26):
    pts=[]
    for i in range(n+1):
        t=i/n; u=1-t
        x=u*u*u*P0[0]+3*u*u*t*P1[0]+3*u*t*t*P2[0]+t*t*t*P3[0]
        y=u*u*u*P0[1]+3*u*u*t*P1[1]+3*u*t*t*P2[1]+t*t*t*P3[1]
        pts.append((x,y))
    return pts

def claude():
    s=P(); s.shadow(30)
    for a in [(30,42,20,13),(15,44,8,7),(46,44,8,7),(22,35,11,9),(39,35,11,9),(20,50,8,6),(39,50,8,6)]: s.e(*a,'cloudA')
    s.e(29,34,17,7,'cloudTop'); s.e(26,32,10,4,'cloudHi'); s.e(32,51,16,5,'cloudSh'); s.e(41,47,8,6,'cloudSh')
    for x in [17,25,33,41]: s.p([(x-5,32),(x,15),(x+5,32)],'blonde')
    for x in [21,29,37]: s.p([(x-3,31),(x,20),(x+3,31)],'blondeH')
    eyes(s,24,35,43); sword(s); return s.img
def barrel():
    s=P(); s.shadow(31)
    s.p([(27,10),(25,5),(29,11)],'hairD'); s.p([(37,10),(39,5),(35,11)],'hairD'); s.r(28,8,8,3,'hairD')
    for i in range(7): s.r(16+i*5,14,5,40,'woodMid' if i%2 else 'wood')
    s.r(16,14,5,40,'woodTop'); s.r(44,14,4,40,'woodD')
    s.e(32,14,17,5,'woodTop'); s.e(32,14,13,3,'wood'); s.e(32,54,16,4,'woodD')
    s.r(15,24,34,2,'ring'); s.r(15,45,34,2,'ring')
    s.r(19,22,10,5,'gunD'); s.r(35,22,10,5,'gunD'); s.r(29,24,6,2,'gunD'); s.r(20,23,3,1,'metalH'); s.r(36,23,3,1,'metalH')
    s.r(29,39,7,3,'hairD'); s.p([(30,42),(35,42),(32,45)],'hairD')
    vulcan(s,49,35); return s.img
def tofa():
    s=P(); s.shadow(31)
    s.blk(14,21,36,26,'white','whiteT','whiteSh',6)
    s.r(16,43,32,4,'shade'); s.r(16,43,32,2,'skirt')
    s.r(24,49,5,2,'skin'); s.r(35,49,5,2,'skin')
    s.r(23,51,7,6,'shadeD'); s.r(34,51,7,6,'shade')
    s.r(15,19,34,4,'hair'); s.r(14,23,4,9,'hair'); s.r(46,23,4,9,'hair'); s.p([(19,20),(16,15),(23,21)],'hair'); s.p([(41,20),(44,15),(37,21)],'hair')
    eyes(s,26,37,31)
    s.e(12,42,7,7,'red'); s.e(52,42,7,7,'red'); s.e(10,40,2.5,2.5,'redL'); s.e(50,40,2.5,2.5,'redL'); return s.img
def airis():
    """Air is... -- a folding fan, opened upward, pivot/guard at the bottom (per reference photo).
    Two pink jacket flaps overlap the outer ribs like shoulders (snapped to the real rib points,
    with a drooping base corner so they hang down rather than just being wide), a single clear
    flower sits upper-side on the paper, and the eyes sit centered on the dome."""
    s=P(); s.shadow(32)
    pivot=(32,50); r_wood,r_out=14,26; a0,a1=179,361; n=14
    pts_out,pts_wood=[],[]
    for i in range(n+1):
        ang=math.radians(a0+(a1-a0)*i/n)
        pts_out.append((pivot[0]+r_out*math.cos(ang), pivot[1]+r_out*math.sin(ang)))
        pts_wood.append((pivot[0]+r_wood*math.cos(ang), pivot[1]+r_wood*math.sin(ang)))
    s.p(pts_out+[pivot],'fanPaper')
    s.p(pts_wood+[pivot],'wood')
    for i in range(0,n+1,2):
        s.line([pts_wood[i],pts_out[i]], 'fanPaperSh' if i%4 else 'woodD', 1)
    s.line(pts_out,'rib',1); s.line(pts_wood,'woodD',1)
    guard_tips={}
    for i in (0,n):
        ang=math.radians(a0+(a1-a0)*i/n)
        tip=(pivot[0]+(r_out+3)*math.cos(ang), pivot[1]+(r_out+3)*math.sin(ang))
        s.line([pivot,tip],'rib',2)
        guard_tips[i]=(pivot[0]+(r_out+5)*math.cos(ang), pivot[1]+(r_out+5)*math.sin(ang))
    flower(s,24,25,3.6)
    s.e(pivot[0],pivot[1],2.4,2.4,'rib')
    def shoulder(idx,droop_at):
        outer=[guard_tips[i] if i in guard_tips else pts_out[i] for i in idx]
        inner=[]
        for i in idx:
            dx,dy=pts_out[i][0]-pivot[0], pts_out[i][1]-pivot[1]
            dist=math.hypot(dx,dy)
            inner.append((pivot[0]+22*dx/dist, pivot[1]+22*dy/dist))
        di=0 if droop_at=='start' else -1
        ox,oy=outer[di]; ix,iy=inner[di]
        outer[di]=(ox,oy+9); inner[di]=(ix,iy+9)
        s.p(outer+list(reversed(inner)),'pink')
        s.line(outer,'pinkD',1)
    shoulder([0,1,2,3],droop_at='start')
    shoulder([11,12,13,14],droop_at='end')
    eyes(s,27,35,30)
    return s.img

OUT=os.path.join(os.path.dirname(__file__),'characters')
os.makedirs(OUT,exist_ok=True)
chars={'claude':claude(),'barrel':barrel(),'tofa':tofa(),'airis':airis()}
sheet=Image.new('RGBA',(256*4,256),(0,0,0,0))
for i,(n,im) in enumerate(chars.items()):
    save_png(im,os.path.join(OUT,f'{n}_64.png'))
    up=upscale(im,4); save_png(up,os.path.join(OUT,f'{n}_256.png'))
    sheet.paste(up,(i*256,0))
save_png(sheet,os.path.join(OUT,'_sheet_256.png'))
print('done', list(chars.keys()))
