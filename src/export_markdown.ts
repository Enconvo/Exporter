import { showToast } from "@enconvo/api";
import { Exporter, Clipboard } from "@enconvo/api";
import { writeFileSync } from "fs";


export default async function main(req: Request) {

  const { options } = await req.json()
  const { text, context } = options

  let content = text || context || await Clipboard.selectedText();

  if (!content) {
    return new Response("", { status: 400, statusText: "No text to process" })
  }

  // save  content to markdown file
  const path = await Exporter.showSavePanel({})

  if (!path) {
    return new Response("", { status: 400, statusText: "Cancelled" })
  }

  console.log("path", path)
  writeFileSync(path, content);
  showToast(`Exported Success`)

  return ""

}
