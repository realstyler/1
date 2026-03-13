export type UserDTO = {
  id: string;
  name: string;
  email: string;
  stripeCustomerId: string | null;
  createdAt: string;
  avatarUrl: string | null;
  creditsRemaining: number;
};
