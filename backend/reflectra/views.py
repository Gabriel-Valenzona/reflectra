from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# =============================================
# Login API endpoint (temporary test version)
# =============================================
@csrf_exempt  # disable CSRF for now; later replace with proper auth
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            # placeholder login logic for testing
            if email == "test@example.com" and password == "password123":
                return JsonResponse({"user": "Test User"}, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=401)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)