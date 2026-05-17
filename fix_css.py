with open("src/pages/index.astro", "r") as f:
    lines = f.readlines()

new_lines = []
raven_count = 0
for line in lines:
    if ".raven-score {" in line:
        raven_count += 1
        if raven_count > 1:
            continue
    if raven_count > 1 and ("color: #8A2BE2" in line or "font-weight: bold;" in line or "text-shadow:" in line or "}" in line or ".raven-text" in line or "font-family:" in line or "font-size:" in line):
        if "    .athena-score {" in line: # keep athena-score
            new_lines.append("    .athena-score {\n")
            raven_count = 1 # reset to allow keeping the rest
        continue

    new_lines.append(line)

with open("src/pages/index.astro", "w") as f:
    f.writelines(new_lines)
