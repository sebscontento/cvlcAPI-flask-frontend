# Frontend for CVLC Backend

This is a frontend application designed to work with the CVLC (Command Line VLC) backend for video streaming and processing. This frontend supports mutiple servers and can send commands to multiple servers at the same time. The backends and this frontend operate a with decoupled architecture. 

Works best with this FastAPI backend 
https://github.com/sebscontento/cvlcAPI-FastAPI-backend 

Also Works with this Flask API backend
https://github.com/sebscontento/cvlcAPI-flask-backend 


## Instructions

    Run the CVLC backend application. If you dont use static IPs you need to run the backends first.
    Write the IP addresses and specify the video folder for active servers in the config.json file.
    Launch the frontend Flask application

## install requirements

    pip install -r requirements.txt

### To launch the Flask app, navigate to the project directory and run the following command:

    python3 app.py


### launch with bashscript start_app.sh
- remember to give the bash script permissions to run 


    `./start_app.sh`



## Configuration of IPs

To make changes or add IP addresses and specify the video folder, edit the `config.json` file located at `../static/config.json`

```json
{
  "servers": [
    {
      "ip": "your_server_ip:port",
      "baseVideoPath": "path_to_video_folder"
    }
  ]
}
```

### Configuration using Excel and py scripts
Configure your application by placing the Excel file `updated_config.xlsx` in the updating_IP_config folder, then run the Python script `fromexcel.py` located in the same folder to convert it to JSON `config.json`

### Configuration of IPS using Google Sheets API
As an alternative to editing the configuration file `config.json` inside the static directory, you can use the Google Sheets API integration. 
Edit the `sheetsconfig.py` by changing the name og your json api key file provided by Google Sheets aswell as placing the json file in the main directory. 
Make sure to change the spreadsheet_url to your own url 
To create the spreadsheet you can use the py files in the `updating_IP_config` folder
 

### Stopping the App

To stop the Flask app, simply press `Ctrl + C` in the terminal where it is running.