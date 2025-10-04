Base URL
/api/v1
Authentication (optional but recommended)

POST /auth/register → register user

POST /auth/login → login and get JWT

1. Create a Podcast

POST /podcasts
Create a new podcast.

Request Body:

{
  "title": "Tech Talks",
  "description": "Podcast about tech trends",
  "host": "Alice Johnson",
  "category": "Technology",
  "language": "English"
}


Response (201 Created):

{
  "id": 1,
  "title": "Tech Talks",
  "description": "Podcast about tech trends",
  "host": "Alice Johnson",
  "category": "Technology",
  "language": "English",
  "createdAt": "2025-10-04T12:00:00Z"
}

2. Get All Podcasts

GET /podcasts?category=Technology&language=English&page=1&limit=10

Supports filters and pagination.

Response (200 OK):

[
  {
    "id": 1,
    "title": "Tech Talks",
    "host": "Alice Johnson",
    "category": "Technology",
    "language": "English"
  },
  {
    "id": 2,
    "title": "AI Daily",
    "host": "Bob Smith",
    "category": "Technology",
    "language": "English"
  }
]

3. Get Podcast by ID

GET /podcasts/{id}

Response (200 OK):

{
  "id": 1,
  "title": "Tech Talks",
  "description": "Podcast about tech trends",
  "host": "Alice Johnson",
  "category": "Technology",
  "language": "English",
  "episodes": [
    {
      "id": 101,
      "title": "Rise of AI",
      "duration": "30:00",
      "publishedAt": "2025-10-01T10:00:00Z"
    }
  ]
}

4. Update Podcast

PUT /podcasts/{id}

Request Body:

{
  "title": "Tech Talks Reloaded",
  "description": "Updated description"
}


Response (200 OK):

{
  "id": 1,
  "title": "Tech Talks Reloaded",
  "description": "Updated description",
  "updatedAt": "2025-10-04T14:00:00Z"
}

5. Delete Podcast

DELETE /podcasts/{id}
