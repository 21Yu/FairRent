## API testing (curl)

### Reset Database:
```bash
curl -X POST http://127.0.0.1:8000/test/reset-db
```

### Sign Up User:
```bash
curl -X POST http://127.0.0.1:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Password123!",
    "full_name": "Test User"
  }'
```

### Login User:
```bash
curl -X POST http://127.0.0.1:8000/auth/login \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=testuser@example.com&password=Password123!'
```
Note the "access_token": "..." string returned in the JSON response


### Get Current User Profile (/me): 
```bash
curl -X GET http://127.0.0.1:8000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Test Invalid Login:
```bash
curl -i -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser@example.com&password=wrongpassword"
```

### Test Access /me Without Token (Should Return 401):
```bash
curl -i -X GET http://127.0.0.1:8000/auth/me
```