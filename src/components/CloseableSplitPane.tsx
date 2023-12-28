import SplitPane, { SplitPaneProps } from "@ryohey/react-split-pane"
import { ReactElement } from "react"
import { CloseablePane2, Direction, FlexStyled } from "./CloseablePane"

//2023/12/26 created closeable version
//(SplitPane is a JS Class Component and i didn't know how to translate into TS correctly,
//so i decided to mutate rendered components. ugly codes.)
function funcSplitPane(direction: Direction) {
  return class extends SplitPane {
    render() {
      let pane = super.render() as ReactElement
      let children = pane.props["children"]
      let paneNewProps = Object.assign({}, pane.props)

      paneNewProps["children"] = undefined
      paneNewProps["defaultSize"] = undefined
      if (direction == "down" || direction == "right") {
        return (
          <div {...paneNewProps}>
            <FlexStyled>{children[0]}</FlexStyled>
            {children[1]}
            <CloseablePane2 closed={false} direction={direction}>
              {children[2]}
            </CloseablePane2>
          </div>
        )
      } else {
        return (
          <div {...paneNewProps}>
            <CloseablePane2 closed={false} direction={direction}>
              {children[0]}
            </CloseablePane2>
            {children[1]}
            <FlexStyled>{children[2]}</FlexStyled>
          </div>
        )
      }
    }
  }
}
let classesSplitPane = {
  up: funcSplitPane("up"),
  down: funcSplitPane("down"),
  left: funcSplitPane("left"),
  right: funcSplitPane("right"),
}

export default function CloseableSplitPane(props: SplitPaneProps) {
  const ACloseableSplitPane =
    classesSplitPane[
      props.primary == "second"
        ? props.split == "horizontal"
          ? "down"
          : "right"
        : props.split == "horizontal"
          ? "up"
          : "left"
    ]
  return <ACloseableSplitPane {...props} />
}
