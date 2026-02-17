import axios from "axios";
import { cookies } from "next/headers";

export default async function createSSRApi() {
  const cookieStore = await cookies();

  return axios.create({
    baseURL: "http://localhost:4000",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
}
