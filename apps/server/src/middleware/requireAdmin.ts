import type { Request, Response, NextFunction } from 'express';

/**
 * חייב לרוץ אחרי requireAuth. מגביל ל-role admin בלבד.
 *
 * ה-role נטען מ-PostgreSQL בכל בקשה דרך getUserFromBearer() (לא מ-JWT):
 * verifyAccessToken → findUserById → rowToUser. עדכון role ב-DB נכנס לתוקף מיד
 * בלי הנפקת JWT מחדש.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.authUser;
  if (!user) {
    res.status(401).json({ error: 'לא מאומת' });
    return;
  }
  if (user.role !== 'admin') {
    res.status(403).json({ error: 'נדרשת הרשאת מנהל' });
    return;
  }
  next();
}
