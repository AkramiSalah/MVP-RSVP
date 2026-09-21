from fastapi import FastAPI, Request, HTTPException, Query
from dotenv import load_dotenv
import json
import sys
import os

load_dotenv()
app = FastAPI()

VERIFY_TOKEN = os.getenv('VERIFY_TOKEN')

@app.get("/")
async def root():
    return {"message": "endpoint is up!"}

@app.get("/webhook")
async def verify_webhook(
    mode: str = Query(None, alias="hub.mode"),
    challenge: str = Query(None, alias="hub.challenge"),
    verify_token: str = Query(None, alias="hub.verify_token")
):
    if mode == 'subscribe' and verify_token == VERIFY_TOKEN:
        print('Webhook has been verified successfuly')
        return int(challenge)
    
    print('Webhook verification failed!')
    print("mode :", mode)
    print("challenge :", challenge)
    print("verify_token :", verify_token, VERIFY_TOKEN)
    raise HTTPException(status_code=403, detail='Verification failed')

@app.post("/webhook")
async def handle_webhook(request: Request):
    data = await request.json()
    if data:
        for entry in data.get('entry', []):
            for change in entry.get('changes', []):
                messages = change.get('value', {}).get('messages',[])
                for message in messages:
                    phone_number = message.get('from', None)
                    timestamp    = message.get('timestamp', None)
                    text = message.get('text', {}).get('body', None)

                    print("phone_number: ",phone_number)
                    print("timestamp: ",  timestamp)
                    print("text: ",  text)


    return{'status': 'success'}


