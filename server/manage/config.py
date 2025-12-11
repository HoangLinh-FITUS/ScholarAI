import os 
from dotenv import load_dotenv 

load_dotenv()


API_PREDICT = os.getenv("API_PREDICT")
MAX_CHUNK_LEN = 512