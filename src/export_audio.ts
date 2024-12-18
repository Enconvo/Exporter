import { EnconvoResponse, FileUtil, PlayPoolItem, RequestOptions } from "@enconvo/api";
import { Action, ServiceProvider, TTS, res, uuid } from "@enconvo/api";
import { Exporter, Clipboard } from "@enconvo/api";


export default async function main(req: Request): Promise<EnconvoResponse> {

  const options: RequestOptions = await req.json()
  const { text, context } = options


  let filePaths: string[] = options.draggedContext || []
  let saveName: string | null = null

  const textFilePaths = filePaths.filter((filePath) => {
    return FileUtil.isTextFile(filePath)
  }).map((filePath) => {
    return {
      id: uuid(),
      filePath,
      type: "file"
    }
  })
  let docContent = null

  if (textFilePaths.length > 0) {
    // 第一个文件的文件名
    saveName = `${textFilePaths[0].filePath.split("/").pop()}.mp3` || "-audio.mp3"

    const loader: any = await ServiceProvider.load({
      extensionName: "chat_with_doc",
      commandName: "load_docs"
    })
    const docs: any[] = await loader.load({ docs: textFilePaths })
    docContent = docs.map((doc: any) => {
      return doc.pageContent
    }).join("\n\n")
  }

  let content = docContent || text || context || await Clipboard.selectedText();
  if (!saveName) {
    saveName = content.split(' ')[0] + ".mp3"
  }

  if (!content) {
    throw new Error("No content to export")
  }

  // save  content to markdown file
  const path = await Exporter.showSavePanel({
    nameFieldStringValue: saveName,
  })


  if (!path) {
    throw new Error("No path selected")
  }

  res.write({
    content: `Saving audio to "${path}"`,
    overwrite: true,
    loading: true
  })

  await TTS.ttsToFile({
    text: content, concurrency: options.concurrency, outputFile: path, chunkSize: 1000, ttsOptions: options.tts_providers, playCallBack: async (item: PlayPoolItem, progress?: number) => {
      await res.write({
        content: `Progress: ${progress}%`,
        overwrite: true,
        loading: true
      })
    }
  })

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
