## Running the Predictor Service (Colab Integration)

The `predict` service, which hosts the fine-tuned BERT model, is typically executed on Google Colab. Because Colab does not provide a public endpoint, the service is exposed using ngrok/grok.

### Steps to Start the Predictor

1. Open the Colab notebook located in `server/predict/`.
2. Run all cells to start the model server.
3. After the server starts, ngrok/grok will generate a public URL (e.g., `https://xxxx.ngrok.io`).
4. Copy this URL.

### Configure the Manage Service

The `manage` service communicates with the predictor using the `API_PREDICT` environment variable.

1. Navigate to the `server/manage/` directory.
2. Open the `.env` file (or create one by copying `.env.example`).
3. Set the value below:
```base 
API_PREDICT=<your_public_ngrok_url>
```
4. Save the file.

Once configured, the Manage service will forward incoming queries or extracted PDF text to the predictor running on Colab.