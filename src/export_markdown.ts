import { showToast } from "@enconvo/api";
import { Exporter, Clipboard } from "@enconvo/api";
import { writeFileSync } from "fs";

// {
//   "name": "export_pdf",
//   "title": "Save as PDF",
//   "description": "Export context messages to PDF file.",
//   "icon": "icon.png",
//   "mode": "no-view",
//   "preferences": []
// }

export default async function main(req: Request) {

  const { options } = await req.json()
  const { text, context } = options

  try {
    let content = text || context || await Clipboard.selectedText();

    if (!content) {
      return new Response("", { status: 400, statusText: "No text to process" })
    }

    // save  content to markdown file
    const path = await Exporter.showSavePanel()

    if (!path) {
      return new Response("", { status: 400, statusText: "Cancelled" })
    }

    console.log("path", path)
    writeFileSync(path, content);
    showToast(`Exported Success`)

    return ""

  } catch (e) {
    return e.message;
  }
}
