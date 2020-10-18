import pandas as pd
import requests
from schema import schema

dfs = {}
url="https://dragalialost.gamepedia.com/Special:CargoExport"
params = {
    "format": "json",
    "limit": 10000
}
for i in schema.keys():
    params["tables"] = i
    params["fields"] = ", ".join(schema[i])
    dfs[i] = pd.read_json(requests.Request('GET', url, params=params).prepare().url)

for i in dfs.keys():
    dfs[i].to_csv(f"data/csv/{i}.csv",index=False)