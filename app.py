"""
Flask application frontend.
Author: [Sebastian Solórzano Holbøll]
Version: [2.2]
Date: [15/03/24]
#works with app.py 
"""



from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# Route to serve CSS file
@app.route('/styles.css')
def styles():
    return app.send_static_file('styles.css')

# Route to serve JavaScript file
@app.route('/script.js')
def script():
    return app.send_static_file('script.js')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
