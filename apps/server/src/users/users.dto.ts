export type UserDTO = {
  stripeCustomerId: string | null;
  email: string;
  name: string;
  id: string;
  createdAt: Date;
  avatarUrl: string | null;
  creditsRemaining: number;
};
