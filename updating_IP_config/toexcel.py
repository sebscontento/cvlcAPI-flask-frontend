#this file converts the json file into an excel file
#will only be necessary the first time. once you have the excel file then you should be all set to import it back again using fromexel.py

import pandas as pd
import json

# Export config.json to Excel
with open('static/config.json', 'r') as f:
    config_data = json.load(f)

df = pd.json_normalize(config_data['servers'])
df.to_excel('config.xlsx', index=False)