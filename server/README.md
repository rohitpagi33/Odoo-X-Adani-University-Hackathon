# GearGuard Backend Server

A Node.js + Express + TypeScript backend for maintenance management using MVC architecture.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Production Server
```bash
npm start
```

## 📁 Project Structure

```
src/
├── controllers/      # Request/Response handlers
├── models/          # Data models and storage
├── routes/          # API route definitions
├── services/        # Business logic
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

## 🔧 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin support
- **UUID** - Unique ID generation
- **In-memory storage** - No database required

## 📝 Features

- ✅ MVC Architecture
- ✅ RESTful API
- ✅ Auto-fill logic for maintenance requests
- ✅ Workflow validation (New → In Progress → Repaired)
- ✅ Equipment scrap tracking
- ✅ Overdue request detection
- ✅ CORS enabled
- ✅ TypeScript with strict mode

## 🌐 API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint documentation.

### Quick Reference

- **Equipment**: `GET/POST /api/equipment`, `GET /api/equipment/:id`
- **Teams**: `GET/POST /api/teams`
- **Requests**: `GET/POST /api/requests`, `PATCH /api/requests/:id/status`

## 🧪 Testing the API

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- cURL
- Your frontend application

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
```

## 📌 Notes

- Uses in-memory storage (data resets on server restart)
- For production, connect to MongoDB or PostgreSQL
- All dates should be in ISO 8601 format
- CORS is enabled for all origins (configure for production)

## 👨‍💻 Development

The server runs on `http://localhost:5000` by default.

Hot reload is enabled in development mode - any changes to `.ts` files will automatically restart the server.

---

**Happy Coding! 🎉**
