import sys,glob
from PIL import Image
d=sys.argv[1]; fs=sorted(glob.glob(d+'/t*.jpg'),key=lambda f:float(f.split('/t')[-1][:-4]))
w=360;h=640;n=len(fs);cols=min(n,5);rows=(n+cols-1)//cols
S=Image.new('RGB',(cols*w,rows*h),'white')
for i,f in enumerate(fs): S.paste(Image.open(f).resize((w,h)),((i%cols)*w,(i//cols)*h))
S.save(d+'/sheet.jpg',quality=85)
