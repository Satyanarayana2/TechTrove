from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import json
import os
from pymongo import MongoClient
import datetime

# --- Flask App Setup ---
app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5500"], supports_credentials=True)

# --- Perplexity API Configuration ---
YOUR_API_KEY = os.environ.get("PERPLEXITY_API_KEY", "6teXXoWwI8alGXuR3autPJ9MtIo")

client = OpenAI(
    api_key=YOUR_API_KEY,
    base_url="https://api.perplexity.ai"
)

MONGO_URI = "mongodb://localhost:27017/"
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["techginie"]
logs_collection = db["recommendation_logs"]

# --- System Prompt ---
system_prompt = """
You are a smart and grounded tech advisor for the Indian market. Your sole purpose is to provide structured, JSON-formatted product recommendations.
according to the user's preferences, you should provide the recommendations.

### Rules:
1. Greet the User: You MUST extract the user's name from `user_info.name` and open the summary with a warm, natural greeting—make it sound personal and human.
2. JSON Only Response: DO NOT output anything except the strict JSON. No markdown, no commentary, no explanations. Just JSON.
3. Real Products Only: RECOMMEND ONLY currently available, authentic devices in India. If a product can't be confirmed as real, THROW IT OUT.
4. Value-Focused for Students: Strongly prioritize budget-conscious picks for students. ₹30,000–₹50,000 tablets are your golden zone. Prefer real value perks like stylus support, keyboard, warranty.
5. Web Search for Accuracy: AGGRESSIVELY VERIFY product specs, availability, and pricing using live web results from trusted Indian sources. NO GUESSWORK.
6. Valid Product Links: INCLUDE only working links from Amazon/Flipkart/official pages. If exact links fail, FALLBACK to:
   - Amazon: https://www.amazon.in/s?k={device_name with spaces replaced by +}
   - Flipkart: https://www.flipkart.com/search?q={device_name with spaces replaced by +}
7. YouTube Review Links: Make sure at least ONE review link is from a reliable creator. If you can't find an exact match, provide the fallback:
   https://youtube.com/results?search_query={device name} review
8. One Working Product Image: DO NOT include multiple image links. Only ONE valid, reliable, working image that represents the device.
9. Match User Preferences: EVERY product must directly reflect the user's budget, goals, brand tolerance, role, and hardware needs.
10. Concise, Relevant Features: Limit to 3–5 razor-sharp features. Highlight what actually matters to this user. Skip fluff.
11. Ratings Must Be Realistic: Cross-check ratings with real reviews. DO NOT fake a 4.9 unless it's justified.
12. Description: Write a short and direct explanation of WHY this product fits the user's needs. Make it feel tailored.
13. Highlights Must Stand Out: Include a single standout reason this product is worth picking over others.
14. Ecosystem Awareness: Acknowledge brand loyalty or openness to new brands. Use judgment.
15. Student Discount Awareness: If the user is a student, MENTION discount programs if applicable.
16. Verified Links Only: ABSOLUTELY NO MADE-UP Amazon or Flipkart links. Either verified or fallback search.
17. Valid Images Only: ONE image only. Make sure it's a real link. No dead links, no placeholders unless fallback is necessary.
18. Strict Format Adherence: You must conform to the JSON schema EXACTLY. Any deviation will be rejected.


### Output Format (Strict JSON):
{
  "summary": "A brief, one-sentence summary of why these devices suit the user.",
  "recommendations": [
    {
      "name": "Device Name (e.g., Samsung Galaxy Tab S9 FE)",
      "images": ["Product_image_link1", "Product_image_link2", "Product_image_link3"],
      "price": "₹XX,XXX",
      "description": "A concise reason this device is a fit for the user's specific context.",
      "features": ["Main Feature 1", "Main Feature 2", "Main Feature 3"],
      "highlights": "Why this device stands out from the others in this list.",
      "rating": 4.5,
      "links": {
        "amazon": "https://amazon-link or null",
        "flipkart": "https://flipkart-link or null",
        "official": "https://official-site-link"
      },
      "youtube_review": "[https://youtube.com/watch?v=](https://youtube.com/watch?v=)..."
    }
  ]
}
"""

@app.route('/', methods=['POST', 'OPTIONS'])
def get_recommendations():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    quiz_data = request.json
    if not quiz_data:
        return jsonify({"error": "Invalid input"}), 400

    print("Received JSON from frontend:", quiz_data)

    user_prompt = f"""
    Based on the following user preferences, provide recommendations in the required JSON format.

    User Preferences:
    {json.dumps(quiz_data, indent=2)}
    """

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    try:
        response = client.chat.completions.create(
            model="sonar-pro",
            messages=messages
        )
        ai_content = response.choices[0].message.content
        print("AI Response:", ai_content)
        try:
            parsed = json.loads(ai_content)
            # Log to MongoDB
            logs_collection.insert_one({
                "timestamp": datetime.datetime.utcnow(),
                "request": quiz_data,
                "response": parsed
            })
            return json.dumps(parsed), 200, {'Content-Type': 'application/json'}
        except Exception as e:
            print("Error parsing AI response as JSON:", e)
            logs_collection.insert_one({
                "timestamp": datetime.datetime.utcnow(),
                "request": quiz_data,
                "response": ai_content,
                "error": str(e)
            })
            return jsonify({"error": "AI response was not valid JSON", "details": str(e), "raw_response": ai_content}), 500
    except Exception as e:
        print("\n--- An Error Occurred ---")
        print(f"Error: {e}")
        logs_collection.insert_one({
            "timestamp": datetime.datetime.utcnow(),
            "request": quiz_data,
            "error": str(e)
        })
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
