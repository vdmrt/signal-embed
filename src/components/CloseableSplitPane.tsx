import SplitPane, { SplitPaneProps } from "@ryohey/react-split-pane"
import { ReactElement } from "react"
import { CloseablePane2, Direction, FlexStyled } from "./CloseablePane"

//2023/12/26 created closeable version
//(SplitPane is a JS Class Component and i didn't know how to translate into TS correctly,
//so i decided to mutate rendered components. ugly codes.)
function funcSplitPane(
  direction: Direction,
  closed: boolean,
): typeof SplitPane {
  return class extends SplitPane {
    render() {
      let pane = super.render() as ReactElement
      let children = pane.props["children"]
      let paneNewProps = Object.assign({}, pane.props)

      delete paneNewProps["children"]
      delete paneNewProps["defaultSize"]
      if (direction == "down" || direction == "right") {
        return (
          <div {...paneNewProps}>
            <FlexStyled>{children[0]}</FlexStyled>
            {children[1]}
            <CloseablePane2 closed={closed} direction={direction}>
              {children[2]}
            </CloseablePane2>
          </div>
        )
      } else {
        return (
          <div {...paneNewProps}>
            <CloseablePane2 closed={closed} direction={direction}>
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
let classesSplitPane: Record<string, Record<string, typeof SplitPane>> = {
  true: {
    up: funcSplitPane("up", true),
    down: funcSplitPane("down", true),
    left: funcSplitPane("left", true),
    right: funcSplitPane("right", true),
  },
  false: {
    up: funcSplitPane("up", false),
    down: funcSplitPane("down", false),
    left: funcSplitPane("left", false),
    right: funcSplitPane("right", false),
  },
}

export type CloseableSplitPaneProps = SplitPaneProps & { closed?: boolean }
export default function CloseableSplitPane(props: CloseableSplitPaneProps) {
  const { closed, ...props_ } = props
  const props__: SplitPaneProps = props_
  const closed_: boolean = closed === undefined ? false : closed
  const ACloseableSplitPane =
    classesSplitPane["" + closed_][
      props.primary == "second"
        ? props.split == "horizontal"
          ? "down"
          : "right"
        : props.split == "horizontal"
          ? "up"
          : "left"
    ]
  return <ACloseableSplitPane {...props__} />
}
