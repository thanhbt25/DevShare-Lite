@echo off

REM Bước 1: Di chuyển đến thư mục gốc dự án
cd /d D:\DevShare-Lite\ai_server

REM Bước 2: Kích hoạt môi trường ảo
call .venv\Scripts\activate.bat

REM Bước 3: Mở cmd với .venv đã bật
cmd

REM Chạy server với uvicorn
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload