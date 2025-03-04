import NextAuth from "next-auth";
import { authOptions } from "./authOptions"; // Adjust based on folder structure

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };