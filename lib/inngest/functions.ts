import {inngest} from "@/lib/inngest/client";
import {NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {sendNewsSummaryEmail, sendWelcomeEmail} from "@/lib/nodemailer";
import {getAllUsersForNewsEmail} from "@/lib/actions/user.actions";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import {formatDateToday} from "@/lib/utils";

export const sendSignUpEmail = inngest.createFunction(
  { id: 'sign-up-email' },
  { event: 'app/user.created' },
  async ({ event, step }) => {
    const userProfile = `
      - Country: ${event.data.country}
      - Investment goals: ${event.data.investmentGoals}
      - Risk tolerance: ${event.data.riskTolerance}
      - Preferred industry: ${event.data.preferredIndustry}
    `

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile);

    const response = await step.ai.infer('generate-welcome-email', {
      model: step.ai.models.gemini({ model: 'gemini-2.0-flash-lite' }),
      body: {
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt }
            ]
          }
        ]
      }
    });

    await step.run('send-welcome-email', async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const defaultIntroText = 'Thanks for joining Signalist. You now have tools to track markets and make smatter moves.';
      const introText = (part && 'text' in part ? part.text : null) || defaultIntroText;

      // Destructure data from event
      const { data: {email, name} } = event;
      return await sendWelcomeEmail({ email, name, intro: introText });
    });

    return {
      success: true,
      message: 'Welcome email sent successfully.'
    }
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  { id: 'daily-news-summary' },
  [ {event: 'app/send.daily.news' }, { cron: '0 12 * * *' } ],
  async ({ step }) => {

    // ------------------------------------------------------------------------
    // Step 1: Get all users for news delivery
    // ------------------------------------------------------------------------

    const users = await step.run('step1-get-all-users', getAllUsersForNewsEmail);
    if (!users || users.length === 0)
      return { success: false, message: 'No users found for news email.' } as const;

    // ------------------------------------------------------------------------
    // Step 2: For each user, get their watchlist symbols -> fetch news (or general if none)
    // ------------------------------------------------------------------------

    const newsList: any[] = [];
    for (const user of users) {
      const newsResult = await step.run(`step2-fetch-news-user-${user.email}`, async () => {

        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);

          let news = await getNews(symbols);
          if (!news || news.length == 0) {
            // fallback to general market news
            news = await getNews();
          }
          // Enforce max 6 articles per user
          news = news.slice(0, 6);
          return {
            user: user,
            articles: news,
            symbols: symbols
          };

        } catch (e) {
          console.error(`Failed processing news for ${user.email}`, e);
          return null;
        }
      });

      if (newsResult) {
        newsList.push(newsResult);
      }

    } // END for loop

    // ------------------------------------------------------------------------
    // Step 3: (placeholder) Summarize news via AI
    // ------------------------------------------------------------------------
    const userNewsSummaries: { user: User; newsContent: string | null }[] = [];
    for (const {user, articles} of newsList) {

      // Get or default country code
      const countryCode = user.country ?? 'EN';
      console.log('HERE ----------- Country code: ', countryCode);

      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT
          .replace('{{newsData}}', JSON.stringify(articles,null, 2))
          .replace('{{countryCode}}', countryCode);
        const response = await step.ai.infer(`step3-summarize-news-${user.email}`, {
          model: step.ai.models.gemini({ model: 'gemini-2.0-flash-lite' }),
          body: {
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
          }
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.';
        userNewsSummaries.push({ user, newsContent });

      } catch (e) {
        console.error(`Failed to summarize news via Gemini AI for: ${user.email}`, e);
      }
    }

    // ------------------------------------------------------------------------
    // Step 4: (placeholder) Send the emails
    // ------------------------------------------------------------------------

    await step.run('step4-send-all-news-emails', async () => {

      // Send all at the same time
      const results = await Promise.all(

        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return null;
          try {
            await sendNewsSummaryEmail( { email: user.email, date: formatDateToday(), newsContent });
            return true;

          } catch (e) {
            console.error(`Failed to send email to user.email`, e);
            return null;
          }
        })
      );

      return { success: true, message: `Total ${results.length} daily news summary emails are already sent.`};
    });

    // Return success even if some users failed; we log counts for diagnostics
    return { success: true, message: `Daily news summary processed for ${users.length} users` };
  }
);