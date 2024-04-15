import { Action, ActionProps, TTS, res, showToast } from "@enconvo/api";
import { Exporter, Clipboard } from "@enconvo/api";
import { writeFileSync } from "fs";


export default async function main(req: Request) {

  const { options } = await req.json()
  const { text, context } = options

  let content = text || context || await Clipboard.selectedText();

  if (!content) {
    throw new Error("No content to export")
  }

  // save  content to markdown file
  const path = await Exporter.showSavePanel({
    nameFieldStringValue: "audio.mp3",
  })


  if (!path) {
    throw new Error("No path selected")
  }

  console.log("path", path)
  res.write({
    content: `Exporting audio to ${path}`,
    overwrite: true,
    loading: true
  })

  await TTS.ttsToFile({ text: content, outputFile: path, ttsOptions: options.tts_providers })

  const actions: ActionProps[] = [
    Action.ShowInFinder({ path: path }),
    Action.PlayAudio({ content: content }),
    Action.PauseResumeAudio(),
  ]

  const output = {
    content: `Audio file saved: [${path}](file:///${path})`,
    actions: actions
  }
  return output
}
