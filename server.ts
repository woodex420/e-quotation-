import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { google } from "googleapis";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Google Sheets API Setup
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

  // API Routes
  app.get("/api/products", async (req, res) => {
    try {
      if (!SPREADSHEET_ID) throw new Error("GOOGLE_SHEET_ID not configured");
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'DB_PRODUCTS!A2:E',
      });
      const rows = response.data.values || [];
      const products = rows.map(row => ({
        sku: row[0],
        name: row[1],
        description: row[2],
        unitPrice: parseFloat(row[3]) || 0,
        imageId: row[4],
      }));
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/quotes", async (req, res) => {
    try {
      if (!SPREADSHEET_ID) throw new Error("GOOGLE_SHEET_ID not configured");
      const quote = req.body;
      
      // Append to LOG_QUOTES
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'LOG_QUOTES!A2',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            quote.id,
            quote.date,
            quote.clientId,
            quote.repName,
            quote.subtotal,
            quote.taxAmount,
            quote.discount,
            quote.grandTotal,
            quote.advanceAmount,
            quote.status,
            quote.pdfLink || ''
          ]],
        },
      });
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
