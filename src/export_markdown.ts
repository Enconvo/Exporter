import { EnconvoResponse, RequestOptions, Runtime } from "@enconvo/api";
import { Exporter, Clipboard } from "@enconvo/api";
import { writeFileSync } from "fs";


export default async function main(req: Request): Promise<EnconvoResponse> {

  const options: RequestOptions = await req.json()
  const { user_input_text, input_text, selection_text, text, context } = options

  let content = user_input_text || input_text || selection_text || text || context || await Clipboard.selectedText();

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

  if (!Runtime.isInteractiveMode()) {
    return EnconvoResponse.json({
      result: 'success'
    })
  }

  return EnconvoResponse.none()

}
