from flask import Flask, render_template
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from datetime import datetime

app = Flask(__name__)

# 設定 OpenWeatherMap API 密鑰與基本資訊
API_KEY = '24e8d9a4ab751373cf6cf5850a9dfbc8'
CITY_NAME = '溪口鄉, TW'
URL = f'http://api.openweathermap.org/data/2.5/forecast?q={CITY_NAME}&units=metric&cnt=8&appid={API_KEY}'

# 爬取新聞資料
def scrape_news():
    options = Options()
    options.add_argument("--headless")  # 無頭模式
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    titles_links = []

    try:
        driver.get("https://sikou.cyhg.gov.tw/News.aspx?n=680&sms=14235")
        news_items = driver.find_elements(By.CSS_SELECTOR, "td.CCMS_jGridView_td_Class_1 span a")
        for item in news_items:
            title = item.get_attribute("title")
            link = item.get_attribute("href")
            if title and link:
                titles_links.append((title, link))
    finally:
        driver.quit()

    return titles_links

@app.route('/')
def index():
    # 爬取新聞資料
    titles_links = scrape_news()

    # 呼叫 OpenWeatherMap API
    response = requests.get(URL)
    data = response.json()
    
    if response.status_code == 200:
        # 解析天氣預報資料
        forecast = data['list']
        daily_data = {}

        for entry in forecast:
            # 提取日期（只取年月日部分）
            date = datetime.fromtimestamp(entry['dt']).strftime('%Y-%m-%d')
            temp_max = entry['main']['temp_max']
            temp_min = entry['main']['temp_min']

            # 初始化或更新每日最高/最低溫
            if date not in daily_data:
                daily_data[date] = {
                    "temperature_max": temp_max,
                    "temperature_min": temp_min,
                    "weather": entry['weather'][0]['description']
                }
            else:
                daily_data[date]['temperature_max'] = max(daily_data[date]['temperature_max'], temp_max)
                daily_data[date]['temperature_min'] = min(daily_data[date]['temperature_min'], temp_min)

        # 輸出結果
        weather_data = {
            f"day_{i+1}": {
                "date": date,
                "temperature_max": daily_data[date]["temperature_max"],
                "temperature_min": daily_data[date]["temperature_min"],
                "weather": daily_data[date]["weather"]
            }
            for i, date in enumerate(daily_data.keys())
        }

        print("每日天氣資料:")
        print(weather_data)
    else:
        print(f"無法獲取資料，錯誤碼: {response.status_code}")
        
    return render_template('index.html', weather_data=weather_data, titles_links=titles_links)

if __name__ == '__main__':
    app.run(debug=True)
