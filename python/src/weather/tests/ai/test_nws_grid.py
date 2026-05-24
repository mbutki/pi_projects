import requests
import json
headers = {"User-Agent": "WeatherApp/1.0"}
url = "https://api.weather.gov/points/47.6062,-122.3321"
res = requests.get(url, headers=headers).json()
grid_url = res["properties"]["forecastGridData"]
print("Grid URL:", grid_url)
grid_res = requests.get(grid_url, headers=headers).json()

# Let's inspect skyCover
sky_cover = grid_res["properties"]["skyCover"]
print("skyCover values (first 3):", json.dumps(sky_cover["values"][:3], indent=2))

# Let's inspect quantitativePrecipitation
qpf = grid_res["properties"]["quantitativePrecipitation"]
print("quantitativePrecipitation values (first 3):", json.dumps(qpf["values"][:3], indent=2))
