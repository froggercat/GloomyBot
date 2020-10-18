# %%
from bs4 import BeautifulSoup
import requests
# %%
soup = BeautifulSoup(requests.get("https://dragalialost.gamepedia.com/Special:CargoQuery").text, "html.parser")
print(soup.findAll(".ui-menu-item"))
# %%
