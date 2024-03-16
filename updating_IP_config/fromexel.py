#this file is to extract the excel data and update the config.json file

import pandas as pd
import json

# Read the updated Excel file, skipping the first column
#REMEMBER TO UPDATE THE NAME OF THE XLSX file BEFORE RUNNING THE FILE!!
df_updated = pd.read_excel('updating_IP_config/updated_config(1).xlsx', usecols=lambda x: x != 'Computer Number')

# Filter out rows with missing values in 'ip' or 'baseVideoPath' columns
df_updated = df_updated.dropna(subset=['ip', 'baseVideoPath'])

# Convert the DataFrame to a dictionary
updated_config_data = {'servers': df_updated.to_dict(orient='records')}

# Write the updated configuration to config.json
with open('static/config.json', 'w') as f:
    json.dump(updated_config_data, f, indent=4)

print("Configuration updated successfully!")
