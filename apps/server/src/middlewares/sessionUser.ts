import { userService } from "../user/user.service.js";

export async function sessionUser(req: any, _: any, next: any) {
  if (req.session.userId)
    req.user = await userService.getUserById(req.session.userId);
  next();
}
