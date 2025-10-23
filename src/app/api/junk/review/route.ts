// import { auth } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/db';
// import { EmailService } from '@/lib/email-service';

// export async function GET() {
//     try {
//         const { userId: clerkId } = await auth();

//         if (!clerkId) {
//           return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         const user = await prisma.user.findUnique({
//           where: { clerkId },
//         });

//         if (!user) {
//           return NextResponse.json({ error: 'User not found' }, { status: 404 });
//         }

//         const emailService = new EmailService();
//         await emailService.syncJunkEmails(user.id);

//         const junkEmails = await prisma.email.findMany({
//           where: {
//             userId: user.id,
//             folder: 'junk',
//             junkConfirmed: false,
//           },
//           orderBy: {
//             receivedAt: 'desc',
//           },
//         });

//         return NextResponse.json(junkEmails);
//       } catch (error) {
//         console.error('Error fetching junk emails:', error);
//         return NextResponse.json(
//           { error: 'Failed to fetch junk emails' },
//           { status: 500 }
//         );
//       }
//     }

//         try {

//             if (!code) {
//                 return NextResponse.redirect(
//                   new URL('/dashboard?error=no_code', request.url)
//                 );
//               }

//               const oauth2Client = new google.auth.OAuth2(
//                 process.env.GMAIL_CLIENT_ID,
//                 process.env.GMAIL_CLIENT_SECRET,
//                 process.env.GMAIL_REDIRECT_URI
//               );

//               const { tokens } = await oauth2Client.getToken(code);
//               oauth2Client.setCredentials(tokens);

//               // Get user's Gmail address
//               const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
//               const profile = await gmail.users.getProfile({ userId: 'me' });

//               // Store encrypted tokens
//               await prisma.emailAccount.upsert({
//                 where: {
//                   userId_email: {
//                     userId: user.id,
//                     email: profile.data.emailAddress!,
//                   },
//                 },
//                 update: {
//                   accessToken: encrypt(tokens.access_token!),
//                   refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
//                   tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
//                   isActive: true,
//                 },
//                 create: {
//                   userId: user.id,
//                   provider: 'gmail',
//                   email: profile.data.emailAddress!,
//                   accessToken: encrypt(tokens.access_token!),
//                   refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
//                   tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
//                   isActive: true,
//                 },
//               });

//               return NextResponse.redirect(
//                 new URL('/dashboard?connected=gmail', request.url)
//               );

//         } catch (error) {
//             console.error('Error connecting Gmail:', error);
//             return NextResponse.redirect(
//               new URL('/dashboard?error=connection_failed', request.url)
//             );
//         }
// }
