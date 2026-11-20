import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

# Search for url patterns or post/get calls
matches = re.findall(r'url:\s*["\']([^"\']+)["\']', code)
print("url matches:", len(matches))
for m in sorted(set(matches))[:30]:
    print("  ", m)

matches2 = re.findall(r'post\(\s*["\']([^"\']+)["\']', code)
print("post matches:", len(matches2))
for m in sorted(set(matches2))[:30]:
    print("  ", m)

matches3 = re.findall(r'get\(\s*["\']([^"\']+)["\']', code)
print("get matches:", len(matches3))
for m in sorted(set(matches3))[:30]:
    print("  ", m)
