from urllib.parse import urlparse
from fastapi.testclient import TestClient
# needed to import my FastAPI app
from main import app

# creating a TestClient instance.
client = TestClient(app)

class TestQRCodeAPI:
    def test_generate_qr_code(self):
        # What HTTP method does your QR code generation endpoint use?
            # POST
        test_url = "https://ikea.com"
        response = client.post(f"/generate-qr/?url={test_url}")

        # - What status code indicates success?
        assert response.status_code == 200

        # check if the response is JSON
        assert response.headers["Content-Type"] == "application/json"

        # now, parse the JSON and check its contents
        data = response.json()
        
        # Now, let's check for the presence and format of the qr_code_url
        parsed_url = urlparse(test_url)
        expected_path = f"qr_codes/{parsed_url.netloc}/{parsed_url.path.lstrip('/')}.png"
    
        assert f"https://devops-qr-code-generator-bucket.s3.amazonaws.com/{expected_path}" in data["qr_code_url"]
    # test for invalid url
    def test_generate_invalid_qr_code(self):
        test_url = "invalid_url"
        response = client.post(f"/generate-qr/?url={test_url}")
        
        assert response.status_code == 422
        
        data = response.json()
        assert "detail" in data
        assert "url" in data["detail"][0]["loc"]
    