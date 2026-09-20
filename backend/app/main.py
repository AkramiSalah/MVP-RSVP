from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()

VERIFY_TOKEN = os.getenv('VERIFY_TOKEN')

@app.get("/")
async def root():
    return {"message": "testing testing testing, hello world"}

@app.get("/webhook")
async def webhook_challenge(mode: str, token: str, challenge: str):
    if mode == 'subscribe' and token == verify_token:
        print('Webhook has been verified successfuly')
        return int(challenge)
    
    print('Webhook verification failed!')
    raise HTTPException(status_code=403, detail='Verification failed')

@app.post("/webhook")
async def handle_webhook(payload):
    return{'status': 'success'}


