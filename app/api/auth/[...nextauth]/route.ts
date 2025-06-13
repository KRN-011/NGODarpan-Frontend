import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { logoutUser, socialMediaAuthentication } from '@/lib/api';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: {
                    redirect_uri: "http://localhost:3000/api/auth/callback/github"
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }: { token: any, account: any, user: any }) {

            // On initial sign-in
            if ( account && user ) {
                token.provider = account.provider;
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image;
                token.providerAccountId = account.providerAccountId;
            }

            if ( token?.email && token?.provider ) {
                const response = await socialMediaAuthentication({
                    email: token.email,
                    username: token.name,
                    image: token.picture,
                    provider: token.provider,
                    providerAccountId: token.providerAccountId,
                });

                const data = response.data;

                // storing backend jwt in token to pass into session
                if ( response.success ) {
                    token.accessToken = data.token;
                }

                return token;
            }
        },
        async session({ session, token }: { session: any, token: any }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
    async error({ error }: { error: any }) {
        console.error("NextAuth error callback:", error);
        return Promise.resolve();
    },
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/signup',
    },
    // debug: true,
    timeout: 10000,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
