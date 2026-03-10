# Identity Reconciliation System

A backend service that identifies and links customer contacts based on their email address and phone number.

In many applications, the same customer may interact using different contact details (for example, the same person using multiple emails or phone numbers). This service reconciles those identities by linking related contacts together and determining a primary contact along with any secondary contacts.

The API accepts an email and/or phone number and returns a unified view of the customer's contact information.

## Live API

Base URL:

```
https://identity-reconciliation-system-6arj.onrender.com
```

Endpoint:

```
POST /identify
```

---

## Tech Stack

Node.js

TypeScript

Express.js

Prisma ORM

PostgreSQL

Supabase (Cloud PostgreSQL Database)

Render (Deployment)

---

## Project Structure

```
identity-reconciliation
│
├── prisma
│   ├── migrations
│   └── schema.prisma
│
├── src
│   ├── controllers
│   │   └── identifyController.ts
│   │
│   ├── routes
│   │   └── identifyRoutes.ts
│   │
│   ├── services
│   │   └── identifyService.ts
│   │
│   ├── prisma
│   │   └── prismaClient.ts
│   │
│   ├── utils
│   │   └── responseBuilder.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## API Usage

### Request

```
POST /identify
```

Example Request Body

```json
{
  "email": "test@example.com",
  "phoneNumber": "9999999999"
}
```

### Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["test@example.com"],
    "phoneNumbers": ["9999999999"],
    "secondaryContactIds": []
  }
}
```

---

## Local Setup

1. Clone the repository

```
git clone https://github.com/github12subir/identity-reconciliation-system.git
```

2. Install dependencies

```
npm install
```

3. Setup environment variables

Create `.env`

```
DATABASE_URL=your_database_url
```

4. Run database migrations

```
npx prisma migrate dev
```

5. Run the application (Development)

```
npm run dev
```

Server will start at:

```
http://localhost:3000
```

6. Build and run (Production)

Build the project:

```
npm run build
```

Start the server:

```
npm start
```

---

## Deployment

The application is deployed on Render.

Live URL:

```
https://identity-reconciliation-system-6arj.onrender.com
```

---

## Author

Subir Mondal

```

```

```

```

```

```
