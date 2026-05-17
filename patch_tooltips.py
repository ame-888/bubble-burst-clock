import re

with open("src/pages/index.astro", "r") as f:
    content = f.read()

# 1) Increase z-index and adjust tooltip width
content = content.replace("z-index: 10;", "z-index: 10000;")
content = content.replace("width: 300px;", "width: 260px;\n        max-width: 80vw;")
content = content.replace("margin-left: -150px;", "margin-left: -130px;")

# 2) We will use an nth-last-child approach or similar in CSS later if needed, but for now
# let's write out the new content.

with open("src/pages/index.astro", "w") as f:
    f.write(content)


# Add responsive edge alignment for last few tooltips
css_patch = """
    /* Prevent tooltips from overflowing on right edge */
    @media (max-width: 768px) {
        .col-header:nth-last-child(1) .tooltip-text,
        .col-header:nth-last-child(2) .tooltip-text {
            left: auto;
            right: -10px;
            margin-left: 0;
            transform: none;
        }
        .col-header:nth-last-child(1) .tooltip-text::after,
        .col-header:nth-last-child(2) .tooltip-text::after {
            left: auto;
            right: 15px;
            margin-left: 0;
        }
    }
"""

with open("src/pages/index.astro", "r") as f:
    content = f.read()

content = content.replace(".tooltip-container:hover .tooltip-text {\n        visibility: visible;", css_patch + "\n    .tooltip-container:hover .tooltip-text {\n        visibility: visible;")

with open("src/pages/index.astro", "w") as f:
    f.write(content)
