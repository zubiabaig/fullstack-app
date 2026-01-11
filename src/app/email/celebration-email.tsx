import resend from "@/app/email"
import db from "@/db"
import { articles, usersSync } from "@/db/schema"
import { eq } from "drizzle-orm"
import CelebrationTemplate from "./templates/celebration-template"

const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

export default async function sendCelebrationEmail(articleId:number, pageViews:number) {
  const response = await db.select({
    email: usersSync.email,
    id: usersSync.id,
    title: articles.title,
    name: usersSync.name
  })
  .from(articles)
  .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
  .where(eq(articles.id, articleId))

  const { email, id, name, title } = response[0]

  if(!email) {
    console.log(`❌ skipping celebration for ${articleId} on pageviews ${pageViews}, could not find email in database`)
    return
  }


  const emailRes = await resend.emails.send({
    from: "Wikimasters <onboarding@resend.dev>",
    to: "<zed.bee2002@gmail.com>",
    subject: `🎉 Your article just hit ${pageViews} page views!`,
    react:(
      <CelebrationTemplate
        name={name ?? "Friend"}
        pageviews={pageViews}
        articleTitle={title}
        articleUrl={`${BASE_URL}/wiki/${articleId}`}
      />
    )
  })

  if(!emailRes.error){
    console.log(`📧 sent ${id} a celebration email for getting ${pageViews} page views on article ${articleId}`)
  } else {
    console.log(`❌ failed to send ${id} a celebration email for getting ${pageViews} page views on article ${articleId}`)
  }

}
