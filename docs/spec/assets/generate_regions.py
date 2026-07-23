import os
from PIL import Image, ImageDraw
W,H=160,96
def col(c):
    if isinstance(c,tuple): return c
    c=c.lstrip('#'); return (int(c[0:2],16),int(c[2:4],16),int(c[4:6],16),255)
class P:
    def __init__(s): s.img=Image.new('RGBA',(W,H),(0,0,0,0)); s.d=ImageDraw.Draw(s.img)
    def _c(s,fn,color):
        rgba=col(color)
        if rgba[3]==255: fn(s.d,rgba)
        else:
            l=Image.new('RGBA',(W,H),(0,0,0,0)); fn(ImageDraw.Draw(l),rgba); s.img=Image.alpha_composite(s.img,l); s.d=ImageDraw.Draw(s.img)
    def r(s,x,y,w,h,c): s._c(lambda d,cc:d.rectangle([x,y,x+w-1,y+h-1],fill=cc),c)
    def e(s,x,y,rx,ry,c): s._c(lambda d,cc:d.ellipse([x-rx,y-ry,x+rx,y+ry],fill=cc),c)
    def p(s,pts,c): s._c(lambda d,cc:d.polygon([(a,b) for a,b in pts],fill=cc),c)
    def sr(s,x,y,w,h,c): s.d.rectangle([x,y,x+w,y+h],outline=col(c),width=1)
    def ln(s,a,b,c2,d2,cc): s.d.line([(a,b),(c2,d2)],fill=col(cc),width=1)
def win(s,bx,by,cols,rows):
    for i in range(cols):
        for j in range(rows):
            lit=(i*3+j*7)%4!=0; s.r(bx+3+i*6,by+3+j*6,3,3,'#e7c14b' if lit else '#2f3a42')
def winb(s,bx,by,cols,rows):
    for i in range(cols):
        for j in range(rows):
            if (i*5+j*3)%3!=0: s.r(bx+2+i*5,by+3+j*5,3,3,'#f2b45a' if (i+j)%2 else '#e0788f')
def awn(s,x,y,ww):
    n=ww//4
    for i in range(n): s.r(x+i*4,y,4,5,'#d24b4b' if i%2 else '#efe9df')
    for i in range(n): s.p([[x+i*4,y+5],[x+i*4+4,y+5],[x+i*4+2,y+8]],'#d24b4b' if i%2 else '#efe9df')

def reactor():
    s=P()
    s.r(0,0,160,96,'#1f2730'); s.r(0,36,160,30,'#2b3940'); s.r(0,58,160,10,'#33474a')
    for b in [(8,30,6,26),(16,24,5,32),(24,34,7,22),(122,30,6,26),(133,26,6,30),(143,34,6,22),(151,30,5,26)]: s.r(*b,'#26313a')
    s.r(40,40,52,34,'#2b333c'); s.p([[40,40],[52,26],[80,26],[92,40]],'#333d47')
    s.r(46,20,5,20,'#2b333c'); s.r(78,16,5,24,'#2b333c')
    s.e(48,16,5,3,(160,170,178,128)); s.e(80,12,6,3,(160,170,178,128)); s.e(85,8,6,3,(160,170,178,71))
    s.r(40,58,52,3,'#3a4150'); s.r(44,44,3,26,'#3a4150'); s.r(84,44,3,26,'#3a4150')
    s.r(58,46,16,20,'#153f2a'); s.e(66,56,11,12,(100,207,135,56)); s.r(62,50,8,12,'#1f6b41'); s.e(66,56,4,5,'#64cf87'); s.e(66,55,2,2,'#c8f0d6')
    s.r(2,48,34,28,'#242c34'); s.r(96,46,52,30,'#242c34'); win(s,2,48,5,4); win(s,96,46,8,4)
    s.r(112,39,26,13,'#12161c'); s.sr(112,39,25,12,'#64cf87'); s.p([[122,42],[126,48],[122,51],[118,48]],'#64cf87')
    s.r(129,43,6,1,'#a6de8f'); s.r(129,46,5,1,'#a6de8f'); s.r(129,49,6,1,'#a6de8f')
    s.r(0,70,160,3,'#3a4150')
    for x in [6,30,54,100,124,148]: s.r(x,70,6,3,'#3fae6a')
    s.r(0,80,160,16,'#181c22'); s.r(0,80,160,2,'#2a2f38'); s.e(66,92,16,3,(100,207,135,36))
    s.r(18,71,11,11,'#7d5127'); s.e(23.5,71,5.5,2,'#5e3f24'); s.r(18,74,11,1,'#9aa2b0'); s.r(18,80,11,1,'#9aa2b0')
    return s.img
def bazaar():
    s=P()
    s.r(0,0,160,96,'#241826'); s.r(0,38,160,28,'#3a2440'); s.r(0,60,160,8,'#5a2f4a')
    s.r(0,44,42,32,'#2b2030'); s.r(42,40,30,36,'#2a1e2c'); s.r(72,46,44,30,'#2b2030'); s.r(116,42,44,34,'#2a1e2c')
    winb(s,2,46,5,3); winb(s,76,48,6,3); winb(s,120,44,6,4)
    s.r(6,44,6,26,'#12101a'); s.sr(6,44,6,25,'#e0788f')
    for y in [48,52,56,60]: s.r(7,y,4,1,'#f4a6c4')
    s.r(126,46,22,12,'#12101a'); s.sr(126,46,21,11,'#6fc3d6'); s.p([[137,49],[140,52],[137,55],[134,52]],'#f4d35e'); s.e(137,52,1.2,1.2,'#12101a')
    for x in range(8,152,10): s.e(x,37,1.6,1.6,'#f4b06a')
    awn(s,20,60,24); awn(s,64,62,20); awn(s,104,60,28)
    s.r(22,68,20,10,'#3a2a30'); s.r(66,70,16,8,'#3a2a30'); s.r(106,68,24,10,'#3a2a30')
    s.r(0,80,160,16,'#1a1420'); s.r(0,80,160,2,'#3a2a38')
    for x in range(4,156,12): s.r(x,86,7,1,'#241826')
    s.r(132,70,10,10,'#7d5127'); s.e(137,70,5,2,'#5e3f24'); s.r(132,80,10,1,'#9aa2b0')
    s.e(30,88,3,4,'#f4b06a'); s.e(30,88,1.6,2.4,'#fff0cf')
    return s.img
def tower():
    s=P()
    s.r(0,0,160,96,'#1c2530'); s.r(0,0,160,6,'#141b24')
    for x in [20,50,80,110,140]: s.r(x,2,12,2,'#cfe0ec')
    s.r(14,0,6,74,'#26333f'); s.r(140,0,6,74,'#26333f'); s.r(18,0,1,74,'#3a4c5a'); s.r(140,0,1,74,'#6fc3d6')
    s.r(20,8,120,58,'#1a2a3e'); s.r(20,8,120,14,'#15233a'); s.r(20,22,120,16,'#1e3048'); s.r(20,38,120,16,'#2a4460')
    for st in [(34,14),(70,12),(100,16),(126,13),(52,18)]: s.r(st[0],st[1],1,1,'#9fb8cf')
    for x in range(24,136,6):
        hh=4+((x*5)%8); s.r(x,64-hh,4,hh,'#101e2c'); s.r(x+1,64-hh+1,1,1,'#e7c14b')
    s.r(20,63,120,2,(100,207,135,82))
    s.e(44,50,12,3,(200,214,224,140)); s.e(90,54,17,4,(200,214,224,128)); s.e(120,49,10,3,(200,214,224,115)); s.e(30,55,9,3,(200,214,224,102))
    for x in [40,60,80,100,120]: s.ln(x,8,x,66,'#33445a')
    s.ln(20,37,140,37,'#33445a'); s.sr(20,8,120,58,'#4a5a6c')
    s.r(3,8,8,58,'#223040'); s.p([[7,9],[4,13],[10,13]],'#64cf87')
    for y in range(16,62,4): s.r(5,y,4,2,'#64cf87' if y<26 else '#2f3a42')
    s.r(148,26,9,12,'#12161c'); s.sr(148,26,9,12,'#64cf87'); s.p([[152,29],[155,33],[152,36],[149,33]],'#64cf87')
    s.r(40,58,80,6,'#26333f'); s.r(40,58,80,1,'#3a4c5a')
    s.r(0,74,160,22,'#20303c'); s.r(0,74,160,2,'#33505f'); s.r(0,78,160,1,'#2a4150')
    s.r(70,80,22,10,(100,207,135,26)); s.r(36,82,10,8,(111,195,214,20))
    return s.img

OUT=os.path.join(os.path.dirname(__file__),'regions'); os.makedirs(OUT,exist_ok=True)
order=[('reactor_row',reactor),('bargain_bazaar',bazaar),('megacorp_tower',tower)]
sheet=Image.new('RGBA',(480,288*3),(0,0,0,0))
for i,(n,fn) in enumerate(order):
    im=fn(); im.save(os.path.join(OUT,f'{n}_160.png'))
    up=im.resize((480,288),Image.NEAREST); up.save(os.path.join(OUT,f'{n}_480.png')); sheet.paste(up,(0,i*288))
sheet.save(os.path.join(OUT,'_sheet.png'))
print('done',[n for n,_ in order])
