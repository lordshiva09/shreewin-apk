import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

# find definition of U around vae
idx = code.find('vae=async(e,t)=>U(')
# search backwards for U= or function U
snippet = code[max(0, idx-3000):idx]
matches = re.findall(r'(?:const|let|var)\s+U\s*=\s*[^;]+;', snippet)
if matches:
    print("Found U definition:", matches[-1])
else:
    # search anywhere in snippet
    print("Snippet backwards from vae:")
    print(snippet[-800:])
