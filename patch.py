import re

with open("src/data/benchmarks.ts", "r") as f:
    content = f.read()

# I want to specifically replace the scores for Muse Spark to "INVALID"
# Also need to make sure I don't replace legitimate 0 scores for other models unless intended.
# The user specifically mentioned the "Muse Spark (with reasoning)" model having 0 scores that should be "INVALID".
# The user's prompt: "I didn't want the INVALID scores to be rewritten as 0%. I just wanted them to be treated... as 0% and also visually glow red just like the 0%. But keeping the "INVALID" text is important."
# Let's replace Muse Spark's 0 scores with "INVALID".

# Are there other 0 scores that should be INVALID?
# Usually in this codebase, omitted scores are the ones that are 0%.
# Let's just restore the "INVALID" scores from before the PR that changed them.
