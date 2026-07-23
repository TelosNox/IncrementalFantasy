import os
from PIL import Image, ImageDraw

C={'slimeGrey':'#a7adb8','slimeGreyD':'#7e8590','slimeGreyT':'#c8ccd3','straw':'#d9b25a','strawD':'#b78f3c','strawT':'#ecd089',
'box':'#c79a5e','boxT':'#ddb987','boxR':'#a2743f','tape':'#ecdcb8',
'steel':'#525a68','steelH':'#c3cad6','steelD':'#2f343f','dial':'#e2e6ec','cream':'#efe9df','creamD':'#cfc7b6','lid':'#5e3f24','sleeve':'#c99a63',
'red':'#d24b4b','redD':'#a23636','redT':'#e46a6a','fuse':'#6e4523','spark':'#f4d35e','sparkHi':'#fff3bf','green':'#7cc36a','greenD':'#57944a','greenT':'#a6de8f',
'ferret':'#c99a63','ferretD':'#a9713f','belly':'#ead0a6','mask':'#2b2f3a','orb':'#6fc3d6','orbHi':'#c8ecf4',
'ghost':'#eef0f2','ghostSh':'#cfd6dd','ghostHi':'#f8fafb','stem':'#efe6d2','stemD':'#d8cdb4','cap':'#c46a5a','capT':'#d98a7a','spot':'#f2e6d8','spore':'#9ed77e',
'jelly':'#a9cfe6','jellyT':'#cbe4f2','jellyD':'#7ea9c9','jellyC':'#c3e0f0','eye':'#20242e','white':'#eef0f2'}
def K(k):
    x=C[k].lstrip('#'); return (int(x[0:2],16),int(x[2:4],16),int(x[4:6],16),255)

class P:
    def __init__(s): s.img=Image.new('RGBA',(64,64),(0,0,0,0)); s.d=ImageDraw.Draw(s.img)
    def shadow(s,cx,rx=15,ry=3,a=36):
        sl=Image.new('RGBA',(64,64),(0,0,0,0)); ImageDraw.Draw(sl).ellipse([cx-rx,60-ry,cx+rx,60+ry],fill=(0,0,0,a))
        s.img=Image.alpha_composite(s.img,sl); s.d=ImageDraw.Draw(s.img)
    def r(s,x,y,w,h,c): s.d.rectangle([x,y,x+w-1,y+h-1],fill=K(c))
    def e(s,cx,cy,rx,ry,c): s.d.ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=K(c))
    def p(s,pts,c): s.d.polygon([(a,b) for a,b in pts],fill=K(c))
    def line(s,pts,c,w): s.d.line([(a,b) for a,b in pts],fill=K(c),width=w)
    def blk(s,x,y,w,hh,fc,tc,rc,dd):
        s.r(x,y,w,hh,fc)
        s.d.polygon([(x,y),(x+dd,y-dd),(x+w+dd,y-dd),(x+w,y)],fill=K(tc))
        s.d.polygon([(x+w,y),(x+w+dd,y-dd),(x+w+dd,y+hh-dd),(x+w,y+hh)],fill=K(rc))
def eyes(s,x1,x2,y): s.r(x1,y,3,4,'eye'); s.r(x2,y,3,4,'eye')
def bez(P0,P1,P2,P3,n=26):
    q=[]
    for i in range(n+1):
        t=i/n; u=1-t
        q.append((u*u*u*P0[0]+3*u*u*t*P1[0]+3*u*t*t*P2[0]+t*t*t*P3[0], u*u*u*P0[1]+3*u*u*t*P1[1]+3*u*t*t*P2[1]+t*t*t*P3[1]))
    return q

def blando():
    s=P(); s.shadow(34)
    s.blk(19,27,26,21,'box','boxT','boxR',6)
    s.r(30,27,4,21,'tape'); s.p([[30,27],[33,24],[39,24],[36,27]],'tape'); s.r(19,27,26,1,'boxR')
    eyes(s,24,36,35); s.r(27,43,10,1,'eye'); return s.img
def kindlebale():
    s=P(); s.shadow(32)
    s.blk(16,24,32,26,'straw','strawT','strawD',5)
    s.r(30,24,2,26,'strawD'); s.r(16,36,32,2,'strawD')
    for a in [(20,30,3,2,'strawT'),(38,30,3,2,'strawT'),(22,44,3,2,'strawT'),(37,44,3,2,'strawT'),(24,32,2,2,'strawD'),(40,42,2,2,'strawD'),(19,43,2,2,'strawD')]: s.r(*a)
    for x in [18,21,24,34,37,40,43]: s.r(x,22,1,3,'straw')
    for x in [20,35,41]: s.r(x,20,1,3,'strawT')
    s.r(14,31,2,1,'straw'); s.r(48,33,2,1,'straw'); s.r(14,45,2,1,'strawD')
    eyes(s,23,35,40); return s.img
def safeguard():
    s=P(); s.shadow(35)
    s.blk(17,17,30,30,'steel','steelH','steelD',6)
    s.r(20,48,4,3,'steelD'); s.r(40,48,4,3,'steelD')
    for a in [(20,20,2,2,'steelD'),(42,20,2,2,'steelD'),(20,44,2,2,'steelD'),(42,44,2,2,'steelD')]: s.r(*a)
    eyes(s,24,37,26)
    s.e(38,37,5,5,'dial'); s.e(38,37,3,3,'steelD'); s.r(38,33,1,3,'steelD'); s.r(23,42,11,2,'steelD'); return s.img
def caffiend():
    s=P(); s.shadow(32)
    s.p([[22,31],[42,31],[39,55],[25,55]],'cream'); s.p([[42,31],[39,55],[35,55],[38,31]],'creamD')
    s.r(24,43,16,6,'sleeve')
    s.r(22,28,20,3,'lid'); s.e(32,28,10,3,'lid'); s.r(30,23,4,5,'lid')
    for yy in [(12,37),(11,43),(13,49)]: s.r(yy[0],yy[1],5,1,'steelH')
    s.e(28,20,2,3,'steelH'); s.e(33,17,2,3,'steelH')
    eyes(s,27,36,37); return s.img
def shortfuse():
    s=P(); s.shadow(31)
    s.line(bez((31,28),(35,22),(40,24),(39,17)),'fuse',2)
    s.e(31,42,15,15,'red'); s.e(27,36,9,6,'redT'); s.e(38,48,9,8,'redD')
    s.e(39,16,2.6,2.6,'spark'); s.e(38,15,1.2,1.2,'sparkHi')
    s.r(26,42,3,4,'eye'); s.r(35,42,3,4,'eye'); s.r(29,49,6,1,'eye'); return s.img
def mitoslime():
    s=P(); s.shadow(31)
    s.e(30,44,16,13,'green'); s.e(19,46,6,5,'green')
    s.e(27,38,11,7,'greenT'); s.e(33,50,13,5,'greenD')
    s.r(30,34,2,19,'greenD'); s.e(48,49,6,6,'green'); s.e(47,47,2,2,'greenT')
    eyes(s,25,34,44); return s.img
def pilferret():
    s=P(); s.shadow(30)
    s.p([[22,46],[15,41],[17,52],[24,52]],'ferretD')
    s.e(30,42,10,15,'ferret'); s.e(30,45,6,11,'belly')
    s.e(30,25,8,7,'ferret'); s.p([[24,19],[26,25],[29,21]],'ferretD'); s.p([[36,19],[34,25],[31,21]],'ferretD')
    s.r(23,23,15,3,'mask'); s.r(26,23,2,2,'white'); s.r(33,23,2,2,'white')
    s.e(30,49,5,4,'ferret'); s.e(30,50,3.5,3.5,'orb'); s.e(29,49,1.4,1.4,'orbHi'); return s.img
def boolinen():
    s=P(); s.shadow(31,10,2,26)
    s.e(31,31,15,14,'ghost'); s.r(16,31,30,19,'ghost')
    for x in [20,28,36,44]: s.e(x,50,5,4,'ghost')
    s.r(40,31,6,19,'ghostSh'); s.e(27,27,9,5,'ghostHi')
    s.e(26,35,3,4,'eye'); s.e(37,35,3,4,'eye'); return s.img
def funkus():
    s=P(); s.shadow(31)
    s.r(26,40,12,16,'stem'); s.r(26,40,3,16,'stemD')
    s.e(31,36,18,11,'cap'); s.e(27,31,11,6,'capT')
    s.e(24,35,3,3,'spot'); s.e(38,34,3,3,'spot'); s.e(31,32,2.5,2.5,'spot')
    s.e(31,22,10,5,'spore'); s.e(24,20,5,4,'spore'); s.e(38,20,5,4,'spore')
    s.r(28,45,3,3,'eye'); s.r(35,45,3,3,'eye'); return s.img
def jellyphase():
    s=P(); s.shadow(31,12)
    s.e(31,34,16,12,'jelly'); s.r(15,34,32,4,'jelly')
    s.e(27,30,10,5,'jellyT'); s.e(31,34,7,5,'jellyC'); s.r(15,37,32,2,'jellyD')
    for x in [19,25,31,37,43]: s.line(bez((x,40),(x+2,48),(x-2,52),(x+1,56)),'jellyD',2)
    s.r(27,33,3,4,'eye'); s.r(36,33,3,4,'eye'); return s.img

MON={'blando':blando,'kindlebale':kindlebale,'safeguard':safeguard,'caffiend':caffiend,'shortfuse':shortfuse,'mitoslime':mitoslime,'pilferret':pilferret,'boolinen':boolinen,'funkus':funkus,'jellyphase':jellyphase}
OUT=os.path.join(os.path.dirname(__file__),'monsters'); os.makedirs(OUT,exist_ok=True)
order=list(MON.keys())
sheet=Image.new('RGBA',(256*5,256*2),(0,0,0,0))
for i,n in enumerate(order):
    im=MON[n]()
    im.save(os.path.join(OUT,f'{n}_64.png'))
    up=im.resize((256,256),Image.NEAREST); up.save(os.path.join(OUT,f'{n}_256.png'))
    sheet.paste(up,((i%5)*256,(i//5)*256))
sheet.save(os.path.join(OUT,'_sheet_256.png'))
print('done',order)
