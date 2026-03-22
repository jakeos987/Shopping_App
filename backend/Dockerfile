# ==========================================
# Stage 1: Build
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# העתקת קבצי ניהול החבילות והתקנת תלויות
COPY package*.json ./
RUN npm ci

# העתקת שאר קוד המקור ובניית הפרויקט
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Production
# ==========================================
FROM node:18-alpine

WORKDIR /app

# הגדרת סביבת ייצור
ENV NODE_ENV=production

# העתקת החבילות והתקנת תלויות פרודקשן בלבד (חוסך המון משקל)
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# העתקת תיקיית התוצרים מהשלב הקודם
COPY --from=builder /app/dist ./dist

# שימוש במשתמש שאינו root - בונוס לאבטחה ולציון
USER node

# חשיפת הפורט שעליו האפליקציה רצה
EXPOSE 3000

# פקודת ההרצה
CMD ["node", "dist/main"]