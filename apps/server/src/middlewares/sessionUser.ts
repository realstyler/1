import { usersService } from "../users/users.service.js";

export async function sessionUser(req: any, _: any, next: any) {
  if (req.session.userId)
    req.user = await usersService.getUserById(req.session.userId);
  next();
}
