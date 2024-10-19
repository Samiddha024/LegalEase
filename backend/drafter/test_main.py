import pytest
from fastapi.testclient import TestClient
from main import app
from datetime import datetime
import os

client = TestClient(app)

@pytest.fixture
def template_data():
    return """
DOMICILE CERTIFICATE

This is to certify that {name}, son/daughter of {father_name},
is a permanent resident of {address}.

He/She has been residing at the above address in the state of {state}
for the past {years_of_residence} years.

This certificate is being issued for {purpose}.

Date: {issue_date}

{authority}
Issuing Authority
"""

@pytest.fixture
def certificate_data():
    return {
        "name": "John Doe",
        "father_name": "James Doe",
        "address": "123 Main Street, City",
        "state": "California",
        "years_of_residence": 10,
        "purpose": "Employment Verification",
        "issue_date": datetime.now().strftime("%Y-%m-%d"),
        "authority": "City Magistrate"
    }

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()

def test_store_template(template_data):
    """Test storing a new document template"""
    template_name = "domicile_certificate"
    
    response = client.post(
        "/store_template/",
        params={"template_name": template_name},
        json={"template": template_data}
    )
    
    assert response.status_code == 200
    assert response.json()["message"] == "Template stored successfully"
    assert response.json()["template_name"] == template_name

def test_get_template(template_data):
    """Test retrieving a stored template"""
    template_name = "test_template"
    
    # Store template first
    store_response = client.post(
        "/store_template/",
        params={"template_name": template_name},
        json={"template": template_data}
    )
    
    # Then retrieve it
    get_response = client.get(f"/templates/{template_name}")
    assert get_response.status_code == 200
    assert "template" in get_response.json()
    assert get_response.json()["template"] == template_data

def test_generate_certificate(template_data, certificate_data):
    """Test generating a certificate using stored template"""
    template_name = "cert_template"
    
    # Store template
    store_response = client.post(
        "/store_template/",
        params={"template_name": template_name},
        json={"template": template_data}
    )
    
    # Generate certificate
    response = client.post(
        "/generate_domicile_certificate/",
        params={"template_name": template_name},
        json=certificate_data
    )
    
    assert response.status_code == 200
    assert "certificate" in response.json()
    assert "certificate_id" in response.json()
    assert "pdf_url" in response.json()
    
    # Verify PDF download
    pdf_url = response.json()["pdf_url"]
    download_response = client.get(pdf_url)
    assert download_response.status_code == 200
    assert download_response.headers["content-type"] == "application/pdf"

def test_invalid_template_name():
    """Test requesting a non-existent template"""
    response = client.get("/templates/nonexistent_template")
    assert response.status_code == 404
    assert "Template not found" in response.json()["detail"]

def test_invalid_certificate_data(template_data):
    """Test generating certificate with invalid data"""
    template_name = "invalid_test_template"
    
    # Store template first
    client.post(
        "/store_template/",
        params={"template_name": template_name},
        json={"template": template_data}
    )
    
    invalid_data = {
        "name": "John Doe" 
    }
    
    response = client.post(
        "/generate_domicile_certificate/",
        params={"template_name": template_name},
        json=invalid_data
    )
    
    assert response.status_code == 422  # Validation error

def test_cleanup():
    """Test cleanup of temporary files"""
    temp_dir = "temp_certificates"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    # Create a test file
    test_file = os.path.join(temp_dir, "test.pdf")
    with open(test_file, "w") as f:
        f.write("test")
    
    # Modify the file's creation time to be older than 24 hours
    old_time = datetime.now().timestamp() - 86500  # 24 hours + 100 seconds
    os.utime(test_file, (old_time, old_time))
    
    # Run startup event (cleanup)
    client.get("/health")

    assert not os.path.exists(test_file)

if __name__ == "__main__":
    pytest.main([__file__, "-v"])