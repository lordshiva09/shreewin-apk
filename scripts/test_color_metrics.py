import cv2, numpy as np

# Let's inspect the exact font metrics of 1st image (Real)
img1 = cv2.imread(r'C:/Users/Pawan kumar/.gemini/antigravity/brain/d1514078-c51d-4afd-bef5-249e0febc2df/.user_uploaded/media_1794811539208_301248f7.png')

# Find colors of text in img1
# "Direct subordinates" is at approx y=110, x=100
# "Team subordinates" is at approx y=110, x=350
print("Color at Direct subordinates text:", img1[110, 100])
print("Color at Team subordinates text:", img1[110, 350])

# Row 2 green number is at approx y=260, x=130
# Row 3 orange number is at approx y=330, x=130
print("Row 2 green number color:", img1[260, 130])
print("Row 3 orange number color:", img1[330, 130])
