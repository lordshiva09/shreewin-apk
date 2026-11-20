import cv2, numpy as np

img1 = cv2.imread(r'C:/Users/Pawan kumar/.gemini/antigravity/brain/d1514078-c51d-4afd-bef5-249e0febc2df/.user_uploaded/media_1794811539208_301248f7.png')
img2 = cv2.imread(r'C:/Users/Pawan kumar/.gemini/antigravity/brain/d1514078-c51d-4afd-bef5-249e0febc2df/.user_uploaded/media_1794811554732_d1eb8ece.png')

# Let's crop key regions from both images and analyze:
# 1. "Agency" title
# 2. "0"
# 3. "Yesterday's total commission"
# 4. Table header ("Direct subordinates")
# 5. Table rows (numbers and labels)

# Save crops to brain directory
cv2.imwrite(r'C:/Users/Pawan kumar/.gemini/antigravity/brain/d1514078-c51d-4afd-bef5-249e0febc2df/crop_img1_header.png', img1[0:150, :])
cv2.imwrite(r'C:/Users/Pawan kumar/.gemini/antigravity/brain/d1514078-c51d-4afd-bef5-249e0febc2df/crop_img2_header.png', img2[0:150, :])

cv2.imwrite(r'C:/Users/Pawan kumar/.gemini/antigravity/brain/d1514078-c51d-4afd-bef5-249e0febc2df/crop_img1_table.png', img1[150:, :])
cv2.imwrite(r'C:/Users/Pawan kumar/.gemini/antigravity/brain/d1514078-c51d-4afd-bef5-249e0febc2df/crop_img2_table.png', img2[150:, :])

print("Crops saved!")
