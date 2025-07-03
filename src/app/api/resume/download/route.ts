import { formatTailwindHTML } from "@/lib/utils";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const POST = async (request: Request) => {
  try {
    const { html, structure } = await request.json();
    if (!html || !structure) {
      return Response.json(
        { message: "Parâmetros inválidos" },
        { status: 400 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";
    const launchOpts = isDev
      ? {}
      : {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        };

    const browser = await puppeteer.launch(launchOpts);
    const page = await browser.newPage();
    await page.setContent(formatTailwindHTML(html, structure));

    // @ts-expect-error
    const bodyHeight = await page.evaluate(
      () => document.body.scrollHeight + 20
    );

    const pdf = await page.pdf({
      width: "210mm",
      height: `${bodyHeight}px`,
      printBackground: true,
    });

    await browser.close();

    return new Response(pdf, {
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Ocorreu um erro inesperado", error },
      { status: 500 }
    );
  }
};
