import re

with open('src/data/benchmarks.ts', 'r') as f:
    content = f.read()

# Update Gemini 3.0 Flash Preview (with code execution)
content = re.sub(
    r"""name: 'Gemini 3\.0 Flash Preview \(with code execution\)',\s*scores: \{\s*'lvl1': 70\.7,\s*'lvl2': 70\.7,\s*'lvl3': 70\.7\s*\},""",
    r"""name: 'Gemini 3.0 Flash Preview (with code execution)',
            scores: {
                'lvl1': 85,
                'lvl2': 61,
                'lvl3': 66
            },""",
    content
)

# Update Gemini 3.1 Pro Preview (with code execution)
content = re.sub(
    r"""name: 'Gemini 3\.1 Pro Preview \(with code execution\)',\s*scores: \{\s*'lvl1': 71,\s*'lvl2': 71,\s*'lvl3': 71\s*\},""",
    r"""name: 'Gemini 3.1 Pro Preview (with code execution)',
            scores: {
                'lvl1': 84,
                'lvl2': 73,
                'lvl3': 56
            },""",
    content
)

with open('src/data/benchmarks.ts', 'w') as f:
    f.write(content)
