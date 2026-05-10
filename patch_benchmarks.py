import re
with open('src/data/benchmarks.ts', 'r') as f:
    content = f.read()
content = content.replace("'lvl2': 4\n            }", "'lvl2': 4,\n                'lvl4': 0,\n                'lvl5': 0\n            }")
with open('src/data/benchmarks.ts', 'w') as f:
    f.write(content)
