import { observer } from "mobx-react-lite"
import { useCallback } from "react"
import { Button } from "../../../components/Button"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../../../components/Dialog"
import { Label } from "../../../components/Label"
import { Localized } from "../../../components/Localized"
import { TextArea } from "../../../components/TextArea"
import { TextField } from "../../../components/TextField"
import { exportTag } from "../../actions/embed"
import { useStores } from "../../hooks/useStores"

//20231230 Added dialog to export as tag
export const EmbedCodeDialog = observer(() => {
  const rootStore = useStores()
  const { rootViewStore, embedCodeStore: exportTagStore } = rootStore
  const { openEmbedCodeDialog: open } = rootViewStore

  return (
    <Dialog open={open} style={{ minWidth: "20rem", width: "160%" }}>
      <DialogTitle>
        <Localized default="Generate Embed Code">generate-embed-code</Localized>
        :{" "}
      </DialogTitle>
      <DialogContent>
        <Label>
          <Localized default="Width">embed-code-width</Localized>
        </Label>
        <TextField
          type="number"
          value={exportTagStore.tagWidth}
          onChange={(e) =>
            (exportTagStore.tagWidth = parseFloat(e.target.value))
          }
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <Label>
          <Localized default="Height">embed-code-height</Localized>
        </Label>
        <TextField
          type="number"
          value={exportTagStore.tagHeight}
          onChange={(e) =>
            (exportTagStore.tagHeight = parseFloat(e.target.value))
          }
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <Label>
          <Localized default="Generated Embed Code">
            generated-embed-code
          </Localized>
        </Label>
        <TextArea
          value={exportTag(rootStore)}
          style={{ width: "100%", height: "400px", marginBottom: "1rem" }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={useCallback(
            () => (rootViewStore.openEmbedCodeDialog = false),
            [rootViewStore],
          )}
        >
          <Localized default="Close">close</Localized>
        </Button>
      </DialogActions>
    </Dialog>
  )
})
