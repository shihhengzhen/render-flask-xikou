FROM python:3.10-slim

# 安裝 Chromium 和依賴
RUN apt-get update && apt-get install -y \
    chromium-browser \
    chromium-chromedriver \
    && rm -rf /var/lib/apt/lists/*

# 設置環境變量
ENV PATH="/usr/bin/chromium-browser:$PATH"

# 安裝 Python 依賴
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 複製應用代碼
COPY . /app
WORKDIR /app

# 啟動命令
CMD ["python", "app.py"]
