from flask import Flask, request, jsonify, make_response
import numpy as np
from keras.models import load_model
from datetime import datetime, timedelta
from flask_cors import CORS
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

model = load_model('rnn_price_forecast2.h5')
district_encoder = np.load('district_classes.npy', allow_pickle=True)
# commodity_encoder = np.load('commodity_classes.npy', allow_pickle=True)
commodity_encoder = np.array(['Black pepper', 'Chili Red', 'Corriander seed', 'Cummin Seed(Jeera)', 'Turmeric'])
# print("district encoder content : ", district_encoder)



min_price_scaler_min = 0.0
min_price_scaler_scale = 959900.0
max_price_scaler_min = 0.0
max_price_scaler_scale = 960000.0

@app.route('/predict', methods=['OPTIONS', 'POST'])
def predict():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Origin')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    try:
        data = request.get_json()
        if data is None:
            logging.error("No JSON data received")
            return jsonify({"error": "No JSON data received"}), 400

        commodity = data['commodity']
        district = data['district']
        min_price = data['min_price']
        max_price = data['max_price']

        current_date = datetime.now()
        year = current_date.year
        month = current_date.month
        day = current_date.day

        # Convert district_encoder and commodity_encoder to lists
        district_encoder_list = district_encoder.tolist()
        commodity_encoder_list = commodity_encoder.tolist()
        print(district_encoder_list)
        print(commodity_encoder_list)
        district_encoded = 0
        commodity_encoded = 0

        # Check if the district and commodity exist in the encoders
        if district in district_encoder_list and commodity in commodity_encoder_list:
            district_encoded = district_encoder_list.index(district)
            commodity_encoded = commodity_encoder_list.index(commodity)
        else:
            print("Error: District or Commodity not found in encoder arrays.")
            return jsonify({"error": "Invalid district or commodity name provided"}), 400



        min_price_scaled = (min_price - min_price_scaler_min) / min_price_scaler_scale
        max_price_scaled = (max_price - max_price_scaler_min) / max_price_scaler_scale
        print("min price",min_price_scaled)
        print("max price",max_price_scaled)

        input_data = np.array([[commodity_encoded, district_encoded, year, month, day, min_price_scaled, max_price_scaled]])
        input_data = input_data.reshape((1, 1, 7))

        predictions = []
        for _ in range(7):
            prediction = model.predict(input_data)
            predictions.append(prediction[0][0])
            current_date += timedelta(days=1)
            print(current_date)
            print(prediction)
            input_data[0, 0, 4] = current_date.day
            input_data[0, 0, 3] = current_date.month
            input_data[0, 0, 2] = current_date.year
            input_data[0, 0, 5] = (prediction[0][0] - 2000)/min_price_scaler_scale
            input_data[0, 0, 6] = (prediction[0][0] + 2000)/max_price_scaler_scale


        # Convert predictions to Python floats
        predictions = [float(prediction) for prediction in predictions]
        response = make_response(jsonify(predictions))

        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')  # Specific origin
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    except Exception as e:
        logging.error("Error from flask app: %s", e)
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
