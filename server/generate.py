import sys
import os
import time
import random
import string

if len(sys.argv) < 3:
    print("Missing arguments", file=sys.stderr)
    sys.exit(1)

foreground = sys.argv[1]
background = sys.argv[2]

time.sleep(1)  # simulate processing

output_dir = os.path.join(os.path.dirname(__file__), 'outputs')
suggestions_dir = os.path.join(os.path.dirname(__file__), 'suggestions')

output_images = [f for f in os.listdir(output_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
suggestion_images = [f for f in os.listdir(suggestions_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]

if not output_images:
    print("No output images available.", file=sys.stderr)
    sys.exit(1)

if len(suggestion_images) < 3:
    print("Not enough suggestions.", file=sys.stderr)
    sys.exit(1)

main_image = random.choice(output_images)
suggestions = random.sample(suggestion_images, 3)

# Generate a unique design code like "KAA-4832"
random_code = f"KAA{random.randint(1000, 9999)}"

# Output both image path and code
result = {
    "main": f"/outputs/{main_image}",
    "suggestions": [f"/suggestions/{img}" for img in suggestions],
    "code": random_code
}

import json
print(json.dumps(result))
