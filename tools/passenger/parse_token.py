import json
  
# Opening JSON file
f = open('token.txt', 'r+')
  
# returns JSON object as 
# a dictionary
data = json.load(f)
f.close()


token = data['access_token']
f = open('token.txt', 'w')
f.write(token)
f.close()
