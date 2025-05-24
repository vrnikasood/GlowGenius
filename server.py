import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import requests

load_dotenv()
# Use AIML API key and base URL


app = Flask(__name__)
CORS(app)

@app.route('/api/concern-solution', methods=['POST'])
def concern_solution():
    data = request.get_json()
    user_concern = data.get('concern', '')
    category = data.get('category', 'skincare')  # default to skincare

    if category == 'cosmetics':
        prompt = f'''
User query: "{user_concern}"
Extract the key product attributes (such as finish, wear-time, coverage, skin-type compatibility, etc.) that would best address this query.
Respond ONLY with a JSON array of objects, each with "name" and "description" fields, where "name" is the attribute (e.g., "Matte Finish", "Long-Wear", "Medium Coverage") and "description" explains why it is important for the user's need. Do not include any product names or recommendations. Do not include any explanation or text outside the JSON.
'''
    else:
        prompt = f'''
User concern: "{user_concern}"
Suggest 3–5 skincare ingredients or attributes that would best address this concern.
Respond ONLY with a JSON array of objects, each with "name" and "description" fields. Do not include any explanation or text outside the JSON.
'''

    try:
        api = OpenAI(
            api_key=os.getenv("AIML_API_KEY"),
            base_url="https://api.aimlapi.com/v1"
        )
        response = api.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        text = response.choices[0].message.content
        print("OpenAI response:", text)  # For debugging

        # Extract JSON array from the response
        json_start = text.find('[')
        json_end = text.rfind(']')
        solutions = []
        if json_start != -1 and json_end != -1:
            import json
            solutions = json.loads(text[json_start:json_end+1])
        return jsonify({"solutions": solutions})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

# New endpoint for mapping features to products (mocked)
@app.route('/api/cosmetics-products', methods=['POST'])
def cosmetics_products():
    data = request.get_json()
    features = data.get('features', [])
    # For now, return a static list of products as a mock
    # In a real app, you would match features to a product database
    mock_products = [
        {
            "name": "Stila Stay All Day Waterproof Liquid Eyeliner",
            "description": "This eyeliner offers a long-lasting, waterproof formula with a precision tip for easy application and a variety of finishes from matte to glossy."
        },
        {
            "name": "Kat Von D Tattoo Liner",
            "description": "A highly pigmented liquid eyeliner with an ultra-precise brush tip for easy application and 24-hour wear. It is suitable for all skin types."
        },
        {
            "name": "NYX Professional Makeup Epic Ink Liner",
            "description": "A flexible liquid eyeliner with intense color payoff and a waterproof formula. It delivers a matte finish and is suitable for all-day wear."
        },
        {
            "name": "Fenty Beauty Flyliner Longwear Liquid Eyeliner",
            "description": "A hyper-saturated liquid eyeliner with a felt tip for precision, providing a smooth, fade-resistant finish ideal for any skin type."
        },
        {
            "name": "Maybelline Hyper Easy Liquid Pen No-Skip Eyeliner",
            "description": "This liquid eyeliner features a flex-tip brush for easy glide and an intense black formula that lasts up to 24 hours without smudging."
        }
    ]
    return jsonify({"products": mock_products})

@app.route('/api/product-search', methods=['POST'])
def product_search():
    data = request.get_json()
    features = data.get('features', [])
    # Build a query string from features (join feature names)
    query = " ".join([f['name'] for f in features])
    
    url = "https://google-shopping-data.p.rapidapi.com/shopping/search"
    
    headers = {
        "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
        "X-RapidAPI-Host": "google-shopping-data.p.rapidapi.com"
    }
    
    querystring = {
        "query": query,
        "country": "us",
        "language": "en"
    }
    
    try:
        response = requests.get(url, headers=headers, params=querystring)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            print(f"Error response: {response.status_code} - {response.text}")
            return jsonify({"error": "Failed to fetch products", "details": response.text}), 500
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=3001, debug=True)
