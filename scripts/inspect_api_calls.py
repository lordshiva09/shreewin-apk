import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

# Look for patterns like '/api/' or 'api/' or 'webapi/' or string literals
matches = set(re.findall(r'["\'](/?[a-zA-Z0-9_\-]+/(?:api|webapi)/[a-zA-Z0-9_\-/]+)["\']', code))
for m in sorted(matches):
    print("Pattern 1:", m)

# Also search for action names or endpoints like GetUserInfo, Login, Register, etc.
actions = set(re.findall(r'["\'](/[a-zA-Z0-9_]+/(?:Get|Post|Query|List|Send|Check|Verify|Submit|Save|Update|Del|Do)[a-zA-Z0-9_]+)["\']', code))
for a in sorted(actions):
    print("Action:", a)

# Let's search for any strings containing 'api/webapi/'
webapis = set(re.findall(r'["\']([^"\']*api/webapi/[^"\']*)["\']', code))
for w in sorted(webapis):
    print("Webapi:", w)
