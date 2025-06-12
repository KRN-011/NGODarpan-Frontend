import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

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
            console.log('JWT callback:', { token, account, user });
            return token;
        },
        async session({ session, token, user }: { session: any, token: any, user: any }) {
            console.log('Session callback:', { session, token, user });
            return session;
        },
        async signIn({ user, account, profile, email, credentials }: { user?: any, account?: any, profile?: any, email?: any, credentials?: any }) {
            console.log('SignIn callback:', {
                user,
                account,
                profile,
                email,
                credentials,
            });
            return true;
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
    debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
