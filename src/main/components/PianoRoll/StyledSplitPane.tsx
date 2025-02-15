import styled from "@emotion/styled"
//import SplitPane from "@ryohey/react-split-pane"
import { SplitPaneProps } from "@ryohey/react-split-pane"
import CloseableSplitPane, {
  CloseableSplitPaneProps,
} from "../../../components/CloseableSplitPane"
import { useStores } from "../../hooks/useStores"

//2023/12/26 replaced with closeable version
export const StyledSplitPane = styled(CloseableSplitPaneDefault)`
  .Resizer {
    z-index: 1;
    background: #000;
    opacity: 0.2;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }

  .Resizer:hover {
    transition: all 0.2s ease;
  }

  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(255, 255, 255, 0.5);
    border-bottom: 5px solid rgba(255, 255, 255, 0.5);
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(255, 255, 255, 0.5);
    border-right: 5px solid rgba(255, 255, 255, 0.5);
  }

  .Resizer.disabled {
    cursor: not-allowed;
  }

  .Resizer.disabled:hover {
    border-color: transparent;
  }
`

export function CloseableSplitPaneDefault(props: SplitPaneProps) {
  const rootStore = useStores()
  const props_: CloseableSplitPaneProps = Object.assign({}, props)
  props_.closed = rootStore.embedCodeStore.closeablePaneDefault
  return <CloseableSplitPane {...props_} />
}
