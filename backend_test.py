import requests
import sys
from datetime import datetime
import json

class DekoraCleanAPITester:
    def __init__(self, base_url="https://dekoraclean-preview.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.contact_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    print(f"   Response: {response.text}")
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+57 300 123 4567",
            "service_type": "residential",
            "message": "This is a test message for the contact form."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=test_data
        )
        
        if success and response:
            self.contact_id = response.get('contact_id')
            # Verify response structure
            if 'success' in response and 'message' in response and 'contact_id' in response:
                print(f"   ✅ Response structure is correct")
                print(f"   Contact ID: {self.contact_id}")
                return True
            else:
                print(f"   ❌ Response structure is incorrect")
                return False
        return success

    def test_contact_form_validation(self):
        """Test contact form with invalid data"""
        invalid_data = {
            "name": "Test User",
            "email": "invalid-email",  # Invalid email format
            "phone": "+57 300 123 4567",
            "service_type": "residential"
        }
        
        success, response = self.run_test(
            "Contact Form Validation (Invalid Email)",
            "POST",
            "contact",
            422,  # Expecting validation error
            data=invalid_data
        )
        return success

    def test_get_contacts(self):
        """Test getting all contacts (admin endpoint)"""
        return self.run_test("Get All Contacts", "GET", "contacts", 200)

    def test_contact_form_missing_fields(self):
        """Test contact form with missing required fields"""
        incomplete_data = {
            "name": "Test User"
            # Missing email, phone, service_type
        }
        
        success, response = self.run_test(
            "Contact Form Missing Fields",
            "POST",
            "contact",
            422,  # Expecting validation error
            data=incomplete_data
        )
        return success

def main():
    print("🧪 Starting Dekora Clean API Tests")
    print("=" * 50)
    
    tester = DekoraCleanAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_contact_form_submission,
        tester.test_contact_form_validation,
        tester.test_contact_form_missing_fields,
        tester.test_get_contacts,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
            tester.tests_run += 1
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Summary:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())