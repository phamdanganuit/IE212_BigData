import time
from googleapiclient.discovery import build
from kafka import KafkaProducer
import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
video_id = sys.argv[1] if len(sys.argv) > 1 else None

if not video_id:
    print("Error: Video ID is required")
    sys.exit(1)

# API Key và ID livestream
API_KEY = "AIzaSyBZE4RYK5oNTjjez4XeUWAMjXlGmXgNcNI"

# Kafka configuration
KAFKA_BROKER = "103.48.193.225:9094"  # Địa chỉ Kafka broker
KAFKA_TOPIC = "youtube-live-chat"  # Kafka topic
KAFKA_USERNAME = "admin"
KAFKA_PASSWORD = "admin"

# Khởi tạo API client
youtube = build("youtube", "v3", developerKey=API_KEY)

# Lấy liveChatId
response = youtube.videos().list(
    part="liveStreamingDetails",
    id=video_id
).execute()

if "items" in response and len(response["items"]) > 0:
    live_chat_id = response["items"][0]["liveStreamingDetails"]["activeLiveChatId"]
    print(f"Live Chat ID: {live_chat_id}")
else:
    print("Không tìm thấy livestream hoặc livestream không hoạt động.")
    live_chat_id = None

# Thu thập bình luận và gửi tới Kafka
if live_chat_id:
    # Tạo Kafka producer
    producer = KafkaProducer(
        bootstrap_servers=KAFKA_BROKER,
        security_protocol="SASL_PLAINTEXT",  # Hoặc "SASL_SSL" nếu sử dụng SSL
        sasl_mechanism="PLAIN",
        sasl_plain_username=KAFKA_USERNAME,
        sasl_plain_password=KAFKA_PASSWORD,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')  
    )

    try:
        while True:
            response = youtube.liveChatMessages().list(
                liveChatId=live_chat_id,
                part="snippet,authorDetails",
                maxResults=200
            ).execute()

            for item in response["items"]:
                author = item["authorDetails"]["displayName"]
                message = item["snippet"].get("displayMessage", "[NaN]")
                published_at = item["snippet"]["publishedAt"]

                # Tạo message payload
                data = {
                    "author": author,
                    "message": message,
                    "published_at": published_at
                }

                # Gửi message tới Kafka
                producer.send(KAFKA_TOPIC, value=data)
                print(f"Sent to Kafka: {data}")

            time.sleep(5)

    except KeyboardInterrupt:
        print("Dừng chương trình.")
    except Exception as e:
        print(f"Lỗi: {e}")
else:
    print("Không thể thu thập bình luận.")