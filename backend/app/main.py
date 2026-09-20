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
    print("payload", request)
    return{'status': 'success'}


