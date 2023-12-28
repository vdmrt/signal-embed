import { FC } from "react"
import { loadFromBase64 } from "../actions/embed"
import { useStores } from "../hooks/useStores"

let initialized = false
export const SettingLoader: FC<{ elem?: HTMLElement }> = ({ elem }) => {
  const rootStore = useStores()

  if (!initialized) {
    let midi = elem?.dataset.midi as string
    loadFromBase64(rootStore, midi)
  }
  initialized = true
  return <></>
}
