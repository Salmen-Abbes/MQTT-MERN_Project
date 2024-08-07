from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import re
import random_responses  # Make sure to have this module
import psycopg2

app = Flask(__name__)
CORS(app)

# Define your database connection parameters
db_params = {
    'dbname': 'Products',
    'user': 'postgres',
    'password': 'root',
    'host': 'localhost',  # e.g., 'localhost' or an IP address
    'port': '5432'   # e.g., '5432'
}

# Establish the connection
try:
    conn = psycopg2.connect(**db_params)
    print("Connection successful")
except Exception as e:
    print(f"Error: {e}")
    conn = None

if conn:
    # Create a cursor object to interact with the database
    cur = conn.cursor()

    # Example query: Select data from the table
    select_query = '''
    SELECT * FROM public.products
    ORDER BY "ID" ASC;
    '''
    cur.execute(select_query)

    # Fetch all rows from the executed query
    products = cur.fetchall()
    print(products)

    # Close the cursor and connection
    cur.close()
    conn.close()

# Load JSON data
def load_json(file):
    with open(file) as bot_responses:
        print(f"Loaded '{file}' successfully!")
        return json.load(bot_responses)

# Store JSON data
response_data = load_json("bot.json")

def get_response(input_string):
    split_message = re.split(r'\s+|[,;?!.-]\s*', input_string.lower())
    score_list = []

    # Check all the responses
    for response in response_data:
        response_score = 0
        required_score = 0
        required_words = response["required_words"]

        # Check if there are any required words
        if required_words:
            for word in split_message:
                if word in required_words:
                    required_score += 1

        # Amount of required words should match the required score
        if required_score == len(required_words):
            # Check each word the user has typed
            for word in split_message:
                # If the word is in the response, add to the score
                if word in response["user_input"]:
                    response_score += 1

        # Add score to list
        score_list.append(response_score)

    # Find the best response and return it if they're not all 0
    best_response = max(score_list)
    response_index = score_list.index(best_response)

    # Check if input is empty
    if input_string == "":
        return "Please type something so we can chat :("

    # If there is no good response, return a random one.
    if best_response != 0:
        return response_data[response_index]["bot_response"]

    return random_responses.random_string()

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    response = get_response(user_input)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True, port=5050)
