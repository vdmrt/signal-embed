import JSZip from "jszip"
import { songFromMidi, songToMidi } from "../../common/midi/midiConversion"
import RootStore from "../stores/RootStore"
import { setSong } from "./song"

export const exportAsB64 = async ({ song }: RootStore) => {
  try {
    const data = songToMidi(song).buffer
    const b64 = arrayBufferToBase64String(data)
    console.log(b64)
    const b642 = await arrayBufferToZipBase64String(data)
    console.log(b642)
  } catch (ex) {
    const msg = "Unable to save file."
    console.error(msg, ex)
    alert(msg)
    return
  }
}

export const loadFromBase64 = async (
  rootStore: RootStore,
  zipBase64String: string,
) => {
  const arrayBuffer = await zipBase64StringToArrayBuffer(zipBase64String)
  if (arrayBuffer != undefined) {
    const song = songFromMidi(new Uint8Array(arrayBuffer))
    console.log(zipBase64String)
    song.fileHandle = null
    song.filepath = ""
    song.isSaved = true
    setSong(rootStore)(song)
  }
}

//https://zenn.dev/takaodaze/articles/74ac1684a7d1d2
function arrayBufferToBase64String(arrayBuffer: ArrayBuffer): string {
  let binaryString = ""
  const bytes = new Uint8Array(arrayBuffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binaryString += String.fromCharCode(bytes[i])
  }
  return btoa(binaryString)
}
function base64StringToArrayBuffer(base64String: string): ArrayBuffer {
  let binaryString = atob(base64String)
  const len = binaryString.length
  const buffer = new ArrayBuffer(len)
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < len; i++) {
    bytes[i] += binaryString.charCodeAt(i)
  }
  return buffer
}
async function arrayBufferToZipBase64String(
  arrayBuffer: ArrayBuffer,
): Promise<string> {
  const zip: JSZip = new JSZip()
  zip.file("tmp.mid", arrayBuffer)

  const zipFile = await zip.generateAsync<"blob">({
    type: "blob",
    platform: "UNIX",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  })
  return await zipFile.arrayBuffer().then(arrayBufferToBase64String)
}
async function zipBase64StringToArrayBuffer(
  zipBase64String: string,
): Promise<ArrayBuffer | undefined> {
  const zipArrayBuffer: ArrayBuffer = base64StringToArrayBuffer(zipBase64String)
  const zip: JSZip = new JSZip()
  const zip2 = await zip.loadAsync(zipArrayBuffer)
  const arrayBuffer = await zip2.file("tmp.mid")?.async("arraybuffer")
  if (arrayBuffer === undefined) {
    const msg = "Unable to read base64."
    console.error(msg)
    alert(msg)
  }
  return arrayBuffer
}
