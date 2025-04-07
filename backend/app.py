from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import openai
import json
import traceback

load_dotenv()

app = Flask(__name__)
CORS(app)

# Set your OpenAI API key securely
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route("/generate-recipes", methods=["POST"])
def generate_recipes():
    data = request.get_json()
    ingredients = data.get("ingredients", [])
    filters = data.get("filters", [])

    if not ingredients:
        return jsonify({"error": "No ingredients provided."}), 400

    SYSTEM_PROMPT = (
    "You are a helpful cooking assistant. Based on the ingredients, generate 5 unique recipes. "
    "Your entire response must ONLY be a valid JSON array. "
    "Do not add any extra text or formatting — no markdown, no introductions, no explanations."
    )

    user_prompt = (
        f"Ingredients: {', '.join(ingredients)}\n"
        f"Filters: {', '.join(filters) if filters else 'None'}\n"
        "Return exactly 5 recipes using mostly these ingredients.\n"
        "Each recipe must include: title, description, duration, difficulty, servings, ingredients (list), steps (list), and notes.\n"
        "Output ONLY raw JSON as a list of 5 objects — no markdown or headers."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=3000
        )

        raw_text = response.choices[0].message.content

        try:
            recipes = json.loads(raw_text)
        except json.JSONDecodeError:
            print("❌ Failed to parse GPT response.")
            return jsonify({"error": "GPT response was not valid JSON.", "raw": raw_text}), 500

        # 🖼 Generate DALL·E image for each recipe
        for recipe in recipes:
            try:
                image_response = client.images.generate(
                    model="dall-e-2",
                    prompt=f"A realistic, high-resolution food photograph of {recipe['title']} plated on a white dish, top-down view, natural soft lighting, depth of field, shot with a DSLR camera, food styling, no text",
                    size="256x256",
                    response_format="url",
                    n=1,
                )
                recipe["image_url"] = image_response.data[0].url
            except Exception as img_error:
                print(f"⚠️ Image gen failed for {recipe['title']}: {img_error}")
                recipe["image_url"] = "https://via.placeholder.com/512?text=No+Image"

        return jsonify({"recipes": recipes})

    except Exception as e:
        print("❌ GPT call failed:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
