import { showToast } from "@enconvo/api";
import { Exporter, Clipboard } from "@enconvo/api";
import * as fs from "fs";


export default async function main(req: Request) {

  const { text, context, options } = await req.json();

  try {
    let content = text || context || await Clipboard.selectedText();

    if (!content) {
      return new Response("", { status: 400, statusText: "No text to process" })
    }

    // save  content to markdown file
    const path = await Exporter.showSavePanel({
      nameFieldStringValue: "Untitled.pdf",
    })
    if (!path) {
      return new Response("", { status: 400, statusText: "Cancelled" })
    }

    console.log("path", path)

    // const doc = await processor.process(content);
    // const buffer = await doc.result;
    // fs.writeFileSync("example.pdf", buffer);

    showToast(`Exported Success`)

    return ""

  } catch (e) {
    return e.message;
  }
}
