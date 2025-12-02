import os
from typing import Final

import dotenv
dotenv.load_dotenv()


API_KEY_FIREBASE: Final[str] = os.getenv("API_KEY_FIREBASE")
FIREBASE_CREDENTIAL_PATH: Final[str] = 'serviceAccountKey.json'
