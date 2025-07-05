from flask import Flask, jsonify, send_from_directory, abort
import google.generativeai as genai
import os
import re
import json
import time

app = Flask(__name__)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSZZINAcdOTQTxEdlwthnqdU")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash-latest')

# In-memory cache
news_cache = {"data": None, "timestamp": 0}
CACHE_DURATION = 60 * 60 * 24 * 3  # 3 days in seconds

@app.route('/api/technews')
def get_technews():
    now = time.time()
    if news_cache["data"] and (now - news_cache["timestamp"] < CACHE_DURATION):
        return jsonify(news_cache["data"])
    system_prompt = """
    You are a reliable global tech journalist AI.
    Your goal is to generate a list of the most recent and important technology-related news in structured JSON.
    Focus Areas:
    - AI trends and research breakthroughs
    - Major tech events globally (e.g., CES, Apple Event, GTC)
    - New AI chip releases from companies like NVIDIA, Intel, AMD, Apple
    - Robotics and autonomous systems
    - Breakthroughs in ML/Deep Learning, generative AI
    - Future technologies or notable innovations
    - Scan for news related to the following topics: New AI trends, major AI model developments, global tech events, significant tech innovations, future tech trend analysis, new chips from Intel/AMD/NVIDIA/Apple/Qualcomm, and breakthroughs in autonomous systems.
    - Select the top 5-7 most impactful news items.
    - For each item, provide a concise summary for the `main_content`. This should be 2-3 sentences long.
    - Ensure the `source_link` is the direct URL to the original, credible article.
    - You MUST ONLY respond with a single valid JSON object or array. Do not include any introductory text, explanations, or markdown formatting like ```json. Your entire response must start with '{' or '[' and end with '}' or ']'. If you cannot provide a valid JSON, return an empty array: [].
    ### Output Format:
    {
      "summary": "Concise summary of the day's most notable developments",
      "news": [
        {
          "headline": "Headline of the news",
          "content": "Detailed but concise explanation of the news",
          "source_link": "https://original-source-link.com"
        }
      ]
    }
    """
    try:
        response = model.generate_content(system_prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        match = re.search(r'(\{.*\}|\[.*\])', cleaned_response, re.DOTALL)
        if match:
            json_str = match.group(1)
            news_json = json.loads(json_str)
            news_cache["data"] = news_json
            news_cache["timestamp"] = now
            return jsonify(news_json)
        else:
            return jsonify({"news": [], "summary": "No valid JSON found in response."})
    except Exception as e:
        return jsonify({"news": [], "summary": f"Error: {e}"})

# Serve technews.html and technews.js from /technews/ route
@app.route('/technews/<path:filename>')
def serve_technews_static(filename):
    return send_from_directory('../technews', filename)

@app.route('/content resources/<path:filename>')
def content_resources(filename):
    return send_from_directory('../content resources', filename)

@app.route('/')
def root_404():
    abort(404)

@app.errorhandler(404)
def page_not_found(e):
    return '404 Not Found', 404

if __name__ == '__main__':
    app.run(port=5500)


