export function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}
