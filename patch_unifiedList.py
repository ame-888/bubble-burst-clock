import re

with open('src/pages/index.astro', 'r') as f:
    content = f.read()

content = content.replace("const unifiedList = computeRanks(unifiedRawList, 'avg');", "const unifiedList = computeRanks(unifiedRawList, ['lvl1', 'lvl2', 'lvl3', 'lvl4', 'lvl5']);")
content = content.replace("m.avg = total / 5; // Calculate average for sorting and ranking", "// Average removed in favor of level-by-level fallback ranking")

with open('src/pages/index.astro', 'w') as f:
    f.write(content)
