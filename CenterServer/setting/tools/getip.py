import requests
from bs4 import BeautifulSoup
import re
import time
import json
import urllib.request

def get_file_name(url,file_type): 
    
    result = requests.get(url)
    soup = BeautifulSoup(result.text, 'html.parser')
    txts = soup.find_all(title=re.compile(f"\.{file_type}$"))
    filenames = []
    for txt in txts:
        filename= txt.extract().get_text()
        filenames.append(filename)
    

    if len(filenames) > 0:
        print("Case 1: --------------------------")
        print(filenames)
        return filenames

    list_file=[]
    o = urllib.request.urlopen(url)
    b = o.read()
    s = b.decode("utf-8")
    
    soup = BeautifulSoup(s,"html.parser")
    # print(soup)
    for a in soup.findAll("script",type="application/json"):
        # print(a.contents)
        data = json.loads(a.contents[0])
        if data.get("payload"):
            for items in data["payload"]["tree"]["items"]:
                item_split = items["name"].split(".")
                if item_split[-1] == file_type:
                    list_file.append(items["name"])

    print("Case 2: --------------------------")
    print(list_file)
    return list_file

def getIpGithub(url, type):
    ips = []
    print(url)
    te_url = url.split("/")
    username = te_url[3]
    repository = te_url[4]
    branch = te_url[6]
    folder = "/".join(te_url[7:])
    filenames = get_file_name(url, type)
    for filename in filenames:
        print (username, repository, branch, folder, filename)
        te = requests.get(f'https://raw.githubusercontent.com/{username}/{repository}/{branch}/{folder}/{filename}')
        ips.append(te.text)
    return ips
