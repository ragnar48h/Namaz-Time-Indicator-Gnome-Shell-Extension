# importing the requests library 
import requests 

# api-endpoint 
URL = "http://www.islamicfinder.us/index.php/api/prayer_times" 
PARAMS = {
        "date": "5-08-2021",
           "latitude": 34.04513309358292,
           "longitude": 74.81649712439841,
           "method": 1,
           "timezone": "Asia/Kolkata",
        }
# sending get request and saving the response as response object 
r = requests.get(url = URL, params = PARAMS) 

# extracting data in json format 
data = r.json() 

print("Data:",data)

# extracting latitude, longitude and formatted address 
# of the first matching location 
#latitude = data['results'][0]['geometry']['location']['lat'] 
#longitude = data['results'][0]['geometry']['location']['lng'] 
#formatted_address = data['results'][0]['formatted_address'] 
fajr = data['results']

print(fajr)
# printing the output 
