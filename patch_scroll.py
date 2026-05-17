with open("src/pages/index.astro", "r") as f:
    content = f.read()

content = content.replace("overflow-x: auto;", "/* overflow-x: auto; removed to prevent horizontal scrolling */")

with open("src/pages/index.astro", "w") as f:
    f.write(content)
