import { makeObservable, observable } from "mobx"

export class EmbedCodeStore {
  tag = ""
  tagSongData = ""
  tagWidth = 960
  tagHeight = 320
  closeablePaneDefault = false

  constructor() {
    makeObservable(this, {
      tag: observable,
      tagSongData: observable,
      tagWidth: observable,
      tagHeight: observable,
    })
  }
}
