# README.md

## Flask Frontend for CVLC Backend

This is a Flask frontend application designed to work with the CVLC (Command Line VLC) backend for video streaming and processing.
Launching the Flask App

## Installation

1. Clone the repository:

    ```
    git clone <https://github.com/sebscontento/cvlcAPI-flask-frontend>
    ```


## install requirements

pip install -r requirements.txt

### To launch the Flask app, navigate to the project directory and run the following command:


### bash command launch app 

python3 app.py

### launch with bashscript start_app.sh
- remember to give the bash script permissions to run 


./start_app.sh



### Configuration

To make changes or add IP addresses and specify the video folder, edit the config.json file located at ../static/config.json

{
  "servers": [
    {
      "ip": "your_server_ip+port",
      "baseVideoPath": "path_to_video_folder"
    }
  ]
}

### Instructions

    Run the CVLC backend application.
    Write the IP addresses and specify the video folder for active servers in the config.json file.
    Launch the frontend Flask application using the command mentioned above.


### Stopping the App

To stop the Flask app, simply press Ctrl + C in the terminal where it is running.