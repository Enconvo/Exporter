import { EnconvoResponse, RequestOptions, showToast } from "@enconvo/api";
import { Exporter, Clipboard } from "@enconvo/api";
import { writeFileSync } from "fs";


export default async function main(req: Request): Promise<EnconvoResponse> {

  const options: RequestOptions = await req.json()
  const { text, context } = options

  let content = text || context || await Clipboard.selectedText();

  if (!content) {
    throw new Error("No text to process")
  }

  // save  content to markdown file
  const path = await Exporter.showSavePanel({})

  if (!path) {
    return new Response("", { status: 400, statusText: "Cancelled" })
  }

  console.log("path", path)
  writeFileSync(path, content);
  await showToast({
    title: "Exported Success",
  })

  return ""

}
