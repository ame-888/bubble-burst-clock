import re

with open("src/data/benchmarks.ts", "r") as f:
    content = f.read()

# Replace Muse Spark (with reasoning) scores in Visual Bench
content = re.sub(
    r"(name:\s*'Muse Spark \(with reasoning\)',\s*scores:\s*\{\s*)('lvl1':\s*)0,\s*('lvl2':\s*)0,\s*('lvl3':\s*)0,\s*('lvl4':\s*)0,\s*('lvl5':\s*)0(\s*\})",
    r"\1\2'INVALID',\n                \3'INVALID',\n                \4'INVALID',\n                \5'INVALID',\n                \6'INVALID'\7",
    content
)

# Replace Muse Spark (with reasoning) scores in Data Retrieval Bench
content = re.sub(
    r"(\{ name:\s*'Muse Spark \(with reasoning\)',\s*scores:\s*\{\s*worm:\s*13,\s*koala:\s*)0(,\s*crow:\s*)0(\s*\}\s*\})",
    r"\1'INVALID'\2'INVALID'\3",
    content
)

with open("src/data/benchmarks.ts", "w") as f:
    f.write(content)
