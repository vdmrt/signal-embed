import { FC } from "react"
import { loadFromBase64 } from "../actions/embed"
import { selectTrack } from "../actions/song"
import { useStores } from "../hooks/useStores"

//20231230 Load settings from dataset (data-*** property)).
let initialized = false
export const SettingLoader: FC<{ elem?: HTMLElement }> = ({ elem }) => {
  const rootStore = useStores()
  const { pianoRollStore, player } = rootStore

  if (!initialized) {
    const ds = elem?.dataset
    if (ds !== undefined) {
      let midi = ds.midi as string
      if (midi !== undefined) {
        loadFromBase64(rootStore, midi).then(() => {
          console.log(pianoRollStore.selectedTrackId)
          const scaleX = ds.scaleX
          if (scaleX !== undefined) pianoRollStore.scaleX = parseFloat(scaleX)
          const scaleY = ds.scaleY
          if (scaleY !== undefined) pianoRollStore.scaleY = parseFloat(scaleY)
          const scrollLeft = ds.scrollLeft
          if (scrollLeft !== undefined)
            pianoRollStore.setScrollLeftInPixels(parseFloat(scrollLeft))
          const scrollTop = ds.scrollTop
          if (scrollTop !== undefined)
            pianoRollStore.setScrollTopInPixels(parseFloat(scrollTop))
          const selectedTrackId = ds.selectedTrackId
          if (selectedTrackId !== undefined)
            selectTrack(rootStore)(parseFloat(selectedTrackId))
          const position = ds.position
          if (position !== undefined) player.position = parseFloat(position)
        })
      }
    }
  }
  initialized = true
  return <></>
}
