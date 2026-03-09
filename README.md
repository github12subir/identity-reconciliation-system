# Identity Reconciliation API

This service identifies and links customer contacts across multiple purchases.

Customers may use different email addresses or phone numbers when placing orders.
The system reconciles identities to maintain a unified customer profile.

The API determines whether a request belongs to an existing customer identity or if a new identity should be created.

---

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Supabase (Cloud PostgreSQL Database)
- Render (Deployment)

---

## Project Structure

```
src
│
├── controllers
│   └── identifyController.ts
│
├── routes
│   └── identifyRoutes.ts
│
├── services
│   └── identityService.ts
│
├── utils
│   └── responseBuilder.ts
│
├── prisma
│   └── prismaClient.ts
│
└── server.ts
```

Architecture flow:

```
Route → Controller → Service → Database
                       ↓
                    Utils
```

---

## Database

The project uses **Supabase PostgreSQL** as a managed cloud database.

Prisma connects to the database using the `DATABASE_URL` stored in the `.env` file.

Example:

```
DATABASE_URL="postgresql://username:password@host:5432/database"
```

---

## Database Schema

Contact table fields:

| Field          | Type      | Description                   |
| -------------- | --------- | ----------------------------- |
| id             | Int       | Primary key                   |
| email          | String?   | Customer email                |
| phoneNumber    | String?   | Customer phone number         |
| linkedId       | Int?      | Points to the primary contact |
| linkPrecedence | Enum      | primary / secondary           |
| createdAt      | DateTime  | Record creation time          |
| updatedAt      | DateTime  | Record update time            |
| deletedAt      | DateTime? | Soft delete field             |

### LinkPrecedence Enum

```
primary
secondary
```

---

## API Endpoint

POST `/identify`

### Request

```json
{
  "email": "string",
  "phoneNumber": "string"
}
```

Both fields are optional, but at least one must be provided.

---

## Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["primary@email.com", "secondary@email.com"],
    "phoneNumbers": ["9999999999"],
    "secondaryContactIds": [23, 45]
  }
}
```

---

## Identity Resolution Logic

The service performs the following steps:

1. Search for contacts with matching email or phone number.
2. Expand the identity graph to include indirectly linked contacts.
3. Identify the **oldest primary contact**.
4. If multiple primary contacts exist:
   - Convert newer primary contacts to **secondary**
   - Link them using `linkedId`.

5. If new email or phone information appears, create a **secondary contact**.
6. Return a consolidated identity response.

---

## Running the Project Locally

### Install dependencies

```
npm install
```

### Setup environment variables

Create `.env` file:

```
DATABASE_URL="your_supabase_postgres_connection_string"
```

---

### Run Prisma migration

```
npx prisma migrate dev --name init
```

---

### Start the server

```
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

## Example Request

```
POST /identify
```

Body:

```json
{
  "email": "doc@fluxkart.com",
  "phoneNumber": "123456"
}
```

---

## Deployment

The API is deployed on **Render**.

Example endpoint:

```
https://your-render-url.com/identify
```

---

## Author

Subir
