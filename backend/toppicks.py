from flask import Flask, jsonify, request, send_from_directory
import os
import json
from openai import OpenAI

app = Flask(__name__)

PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY', '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')

client = OpenAI(
    api_key=PERPLEXITY_API_KEY,
    base_url="https://api.perplexity.ai"
)

SYSTEM_PROMPT = '''
You are a smart AI market analyst for Indian electronics. Your job is to return the current top 12 best-selling devices in India across smartphones, tablets, and laptops combined.

### Rules:
1. Output should be a single JSON array with 12 device objects.
2. Include 2 to 4 devices from each category: smartphone, tablet, and laptop.
3. Each object must include only these fields:
   - name: Device name
   - category: One of "smartphone", "tablet", or "laptop"
   - price: Approximate INR price (e.g., ₹45,000)
   - key_features: A short list of 3-4 important features only
4. All devices must be real, currently available in India.
5. DO NOT include unreleased or global-only models.
6. Strictly return only JSON. Do not include any extra commentary or formatting.

### Example:
[
  {
    "name": "iQOO Z9 5G",
    "category": "smartphone",
    "price": "₹13,999",
    "key_features": ["MediaTek Dimensity 7200", "120Hz AMOLED", "5000mAh", "OIS camera"]
  },
  ... 11 more ...
]
'''

@app.route('/api/toppicks', methods=['GET'])
def get_toppicks():
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": "List top 12 best-selling devices in India from smartphones, tablets, and laptops with 2 to 4 from each category."}
    ]
    try:
        response = client.chat.completions.create(
            model="sonar-pro",
            messages=messages
        )
        content = response.choices[0].message.content
        parsed = json.loads(content)

        # Optional filtering to strictly enforce 2-4 per category if needed
        categorized = {"smartphone": [], "tablet": [], "laptop": []}
        for item in parsed:
            cat = item.get("category")
            if cat in categorized:
                categorized[cat].append(item)

        # Clamp to max 4 and min 2 per category
        final_output = []
        for cat, items in categorized.items():
            final_output.extend(items[:4])  # Get up to 4 per category

        return jsonify({"devices": final_output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/content resources/<path:filename>')
def serve_content_resources(filename):
    return send_from_directory('../content resources', filename)

@app.route('/Toppicks/<path:filename>')
def serve_toppicks_static(filename):
    return send_from_directory('../Toppicks', filename)

if __name__ == '__main__':
    app.run(port=5600)
