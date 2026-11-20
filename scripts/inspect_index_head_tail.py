with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

print(f"Total lines in index.html: {len(lines)}")
print("First 30 lines:")
for l in lines[:30]:
    print(l, end='')

print("\n--- Last 30 lines ---")
for l in lines[-30:]:
    print(l, end='')
