import styled from "@emotion/styled"
import { observer } from "mobx-react-lite"
import { FC } from "react"
import { CircularProgress } from "../../../components/CircularProgress"
import { Dialog, DialogContent } from "../../../components/Dialog"
import { useStores } from "../../hooks/useStores"

const Message = styled.div`
  color: ${({ theme }) => theme.textColor};
  margin-left: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
`
//2023/12/31 change to draw inside its parent element
export const LoadingDialog: FC<{ elem?: HTMLElement }> = observer(
  ({ elem }) => {
    const rootStore = useStores()
    const { rootViewStore } = rootStore
    const { openLoadingDialog: open, loadingDialogMessage } = rootViewStore
    console.log(elem)
    return (
      <Dialog
        open={open}
        style={{ minWidth: "20rem" }}
        container={elem}
        positionFixed={false}
      >
        <DialogContent style={{ display: "flex", marginBottom: "0" }}>
          <CircularProgress />
          <Message>{loadingDialogMessage ?? "Loading..."}</Message>
        </DialogContent>
      </Dialog>
    )
  },
)
