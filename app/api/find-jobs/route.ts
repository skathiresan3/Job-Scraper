import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Resend } from "resend";



export async function GET(req: Request) {

    // const authHeader = req.headers.get("authorization");

    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response("Unauthorized", { status: 401 });
    // }
    const resend = new Resend(process.env.RESEND_API_KEY);
  

    // URL for scraping jobs
    const response = fetch("https://github.com/SimplifyJobs/New-Grad-Positions");
    const html = await (await response).text();
    
    const $ = cheerio.load(html);


    const jobs: any[] = [];

    $("table tbody tr").each((i, row) => {
        const tds = $(row).find("td");
    
        if (tds.length < 5) return; 
    
        const company = $(tds[0]).text().trim();
        const role = $(tds[1]).text().trim();
        const location = $(tds[2]).text().trim();
        const age = $(tds[4]).text().trim();
    
        const applyLink = $(tds[3]).find("a").first().attr("href");
        const roleLower = role.toLowerCase();

        const isSoftware =
        roleLower.includes("software") ||
        roleLower.includes("swe") ||
        roleLower.includes("backend") ||
        roleLower.includes("full stack") ||
        roleLower.includes("fullstack");
        if ((age === "0d") && isSoftware) {
          jobs.push({
            company,
            role,
            location,
            applyLink,
            age,
          });
        }
      });

      if (jobs.length > 0) {

        const jobListHTML = jobs.map(job => `
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0;">${job.company}</h3>
            <p style="margin: 4px 0;"><strong>${job.role}</strong></p>
            <p style="margin: 4px 0;">📍 ${job.location}</p>
            <a href="${job.applyLink}" 
               style="display:inline-block;
                      margin-top:6px;
                      padding:8px 12px;
                      background:#111;
                      color:#fff;
                      text-decoration:none;
                      border-radius:6px;">
              Apply Now
            </a>
          </div>
          <hr/>
        `).join("");
      
        const {data, error} = await resend.emails.send({
          from: "onboarding@resend.dev", // change later to verified domain
          to: "sachin.kathir.123@gmail.com",
          subject: `🚨 ${jobs.length} New SWE Jobs Posted Today`,
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>New SWE Jobs (0d)</h2>
              <p>These were posted today. Apply immediately.</p>
              ${jobListHTML}
            </div>
          `
        });
        console.log("EMAIL RES: ", {data, error});
      
      }
      
    
      return Response.json(jobs);
}