import { NextAuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import alchemy from "./alchemy";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Wallet",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );
          // eslint-disable-next-line turbo/no-undeclared-env-vars
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          if (!result.success) {
            return null;
          }
          // TODO check if user exists backend
          let user = null;
          if (!user) {
            // create user
            // const ens = await alchemy.core.lookupAddress(
            //   siwe.address.toLowerCase()
            // );
            // TODO persist user in backend. get ens?
            const newUser = {
              id: siwe.address,
              evmAddress: siwe.address,
              // ens: ens || siwe.address,
              imageUrl: `https://avatars.dicebear.com/api/identicon/${siwe.address}.svg`,
            };
            return newUser;
          }
          return user;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      session.user.id = token.sub;
      session.user.evmAddress = token.evmAddress;
      session.user.image = token.picture;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.evmAddress = user.evmAddress;
        token.picture = user.imageUrl;
      }
      return token;
    },
  },
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  secret: process.env.NEXTAUTH_SECRET,
};
