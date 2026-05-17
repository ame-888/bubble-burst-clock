import re

with open("src/pages/index.astro", "r") as f:
    content = f.read()

# 1. Remove isTotalFail assignment in unifiedRawList
content = re.sub(
    r"// Determine overall fail \(all scores 0\)\s*m\.isTotalFail =.*?;\n\n\s*return m;",
    r"return m;",
    content,
    flags=re.DOTALL
)

# 2. Remove isTotalFail assignment in dataRawList
content = re.sub(
    r"m\.isTotalFail = wormScore === 0 && koalaScore === 0 && crowScore === 0;\n\s*return m;",
    r"return m;",
    content,
    flags=re.DOTALL
)

# 3. Remove isTotalFail check when calculating bestAiScores for Visual
content = re.sub(
    r"if \(!item\.isTotalFail\) \{\n(.*?)(\s*)\}",
    r"\1",
    content,
    count=1,
    flags=re.DOTALL
)

# 4. Remove isTotalFail check when calculating bestDataAiScores
content = re.sub(
    r"if \(!item\.isTotalFail\) \{\n(.*?)(\s*)\}",
    r"\1",
    content,
    count=1,
    flags=re.DOTALL
)

# 5. Remove fail-item and fail-rank HTML conditional classes
content = re.sub(r"\$\{item\.isTotalFail \? 'fail-item' : ''\}", "", content)
content = re.sub(r"\$\{item\.isTotalFail \? 'fail-rank' : ''\}", "", content)
content = re.sub(r"\$\{item\.isTotalFail \? 'fail-score' : ''\}", "", content)

# 6. Remove isTotalFail assignment in sorting script logic
content = re.sub(
    r"item\.isTotalFail = rawVals\.every\(r => r\.val === 0\);\n",
    r"",
    content
)

# 7. Remove CSS classes
content = re.sub(r"\.fail-rank \{.*?\}", "", content, flags=re.DOTALL)
content = re.sub(r"\.fail-score \{.*?\}", "", content, flags=re.DOTALL)
content = re.sub(r"\.fail-item \.model-name \{.*?\}", "", content, flags=re.DOTALL)


with open("src/pages/index.astro", "w") as f:
    f.write(content)
