import pandas as pd
import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Define the scope
scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']

# Load credentials
creds = ServiceAccountCredentials.from_json_keyfile_name('python-417610-fa887e74adea.json', scope)

# Authorize the client
client = gspread.authorize(creds)

# Open the spreadsheet by its URL
spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1u34TuIps6wsoGpklx_jsS_PjLTKrjo-aqDRB5CZMk4M/edit'
sheet = client.open_by_url(spreadsheet_url)

# Access the first worksheet
worksheet = sheet.get_worksheet(0)

# Extract data from Google Sheets
data = worksheet.get_all_values()

# Convert data to a DataFrame
df_updated = pd.DataFrame(data[1:], columns=data[0])

# Filter out rows with missing values in 'ip' or 'baseVideoPath' columns
df_updated = df_updated.dropna(subset=['ip', 'baseVideoPath'])

# Exclude 'Computer Number' column
df_updated = df_updated.drop(columns=['Computer Number'])

# Convert empty strings to NaN
df_updated.replace('', pd.NA, inplace=True)

# Filter rows where both 'ip' and 'baseVideoPath' are not empty
df_filtered = df_updated.dropna(subset=['ip', 'baseVideoPath'])

# Convert the DataFrame to a dictionary
updated_config_data = {'servers': df_filtered.to_dict(orient='records')}

# Write the updated configuration to config.json
with open('static/config.json', 'w') as f:
    json.dump(updated_config_data, f, indent=4)

print("Configuration updated successfully!")
