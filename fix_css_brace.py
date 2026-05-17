with open("src/pages/index.astro", "r") as f:
    content = f.read()

# Let's see what went wrong with .athena-score
import re

content = content.replace(""".raven-score {
        color: #8A2BE2; /* Mysterious violet */
        font-weight: bold;
        text-shadow: 0 0 5px rgba(138, 43, 226, 0.5);
    }
    .raven-text {
        font-family: 'Courier New', monospace;
        font-size: 1.2rem;
    }

    .athena-score {""", """.raven-score {
        color: #8A2BE2; /* Mysterious violet */
        font-weight: bold;
        text-shadow: 0 0 5px rgba(138, 43, 226, 0.5);
    }
    .raven-text {
        font-family: 'Courier New', monospace;
        font-size: 1.2rem;
    }

    .athena-score {""") # Just check what we replaced it with

# Actually I see what happened. Let me fix the file via re
with open("src/pages/index.astro", "r") as f:
    text = f.read()

# Make sure all .raven-text and .raven-score are properly closed and .athena-score is properly closed
# Let's find .raven-score block
match = re.search(r'\.raven-score \{.*?\.athena-score \{', text, re.DOTALL)
if match:
    print("Found match:", match.group())
else:
    print("Not found")
