import styled from "@emotion/styled"
import useComponentSize from "@rehooks/component-size"
import { clamp } from "lodash"
import { observer } from "mobx-react-lite"
import { FC, useCallback, useRef } from "react"
import { Layout, WHEEL_SCROLL_RATE } from "../../Constants"
import { isTouchPadEvent } from "../../helpers/touchpad"
import { useStores } from "../../hooks/useStores"
import ControlPane from "../ControlPane/ControlPane"
import {
  HorizontalScaleScrollBar,
  VerticalScaleScrollBar,
} from "../inputs/ScaleScrollBar"
import { BAR_WIDTH } from "../inputs/ScrollBar"
import { PianoRollStage } from "./PianoRollStage"
import { StyledSplitPane } from "./StyledSplitPane"

//2023/12/26 prevented pane closer from covering horizontal scroll bar
//(by separating drawing area for HorizontalScaleScrollBar and StyledSplitPane)
const ParentSplitPane = styled.div`
  flex-grow: 1;
  position: relative;
`
const ParentScrollBar = styled.div`
  height: ${BAR_WIDTH}px;
`
const Parent = styled.div`
  flex-grow: 1;
  background: ${({ theme }) => theme.backgroundColor};
  position: relative;
  display: flex;
  flex-direction: column;
`

const Alpha = styled.div`
  flex-grow: 1;
  position: relative;

  .alphaContent {
    position: absolute;
    top: 0;
    left: 0;
  }
`

const Beta = styled.div`
  border-top: 1px solid ${({ theme }) => theme.dividerColor};
  height: calc(100%);
  width: 100%;
`

const PianoRollWrapper: FC = observer(() => {
  const {
    pianoRollStore: s,
    pianoRollStore: {
      scaleX,
      scaleY,
      scrollLeft,
      scrollTop,
      transform,
      contentWidth,
      contentHeight,
    },
  } = useStores()

  const ref = useRef(null)
  const size = useComponentSize(ref)

  const alphaRef = useRef(null)
  const { height: alphaHeight = 0 } = useComponentSize(alphaRef)

  const onClickScaleUpHorizontal = useCallback(
    () => s.scaleAroundPointX(0.2, Layout.keyWidth),
    [scaleX, s],
  )
  const onClickScaleDownHorizontal = useCallback(
    () => s.scaleAroundPointX(-0.2, Layout.keyWidth),
    [scaleX, s],
  )
  const onClickScaleResetHorizontal = useCallback(() => (s.scaleX = 1), [s])

  const onClickScaleUpVertical = useCallback(
    () => s.scaleAroundPointY(0.2, 0),
    [scaleY, s],
  )
  const onClickScaleDownVertical = useCallback(
    () => s.scaleAroundPointY(-0.2, 0),
    [scaleY, s],
  )
  const onClickScaleResetVertical = useCallback(() => (s.scaleY = 1), [s])

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.shiftKey && (e.altKey || e.ctrlKey)) {
        // vertical zoom
        let scaleYDelta = isTouchPadEvent(e.nativeEvent)
          ? 0.02 * e.deltaY
          : 0.01 * e.deltaX
        scaleYDelta = clamp(scaleYDelta, -0.15, 0.15) // prevent acceleration to zoom too fast
        s.scaleAroundPointY(scaleYDelta, e.nativeEvent.offsetY)
      } else if (e.altKey || e.ctrlKey) {
        // horizontal zoom
        const scaleFactor = isTouchPadEvent(e.nativeEvent) ? 0.01 : -0.01
        const scaleXDelta = clamp(e.deltaY * scaleFactor, -0.15, 0.15) // prevent acceleration to zoom too fast
        s.scaleAroundPointX(scaleXDelta, e.nativeEvent.offsetX)
      } else {
        // scrolling
        const scaleFactor = isTouchPadEvent(e.nativeEvent)
          ? 1
          : transform.pixelsPerKey * WHEEL_SCROLL_RATE
        const deltaY = e.deltaY * scaleFactor
        s.scrollBy(-e.deltaX, -deltaY)
      }
    },
    [s, transform],
  )

  return (
    <Parent ref={ref}>
      <ParentSplitPane>
        <StyledSplitPane
          split="horizontal"
          minSize={50}
          defaultSize={"40%"}
          primary="second"
        >
          <Alpha onWheel={onWheel} ref={alphaRef}>
            <PianoRollStage width={size.width} height={alphaHeight} />
            <VerticalScaleScrollBar
              scrollOffset={scrollTop}
              contentLength={contentHeight}
              onScroll={useCallback((v: any) => s.setScrollTopInPixels(v), [s])}
              onClickScaleUp={onClickScaleUpVertical}
              onClickScaleDown={onClickScaleDownVertical}
              onClickScaleReset={onClickScaleResetVertical}
            />
          </Alpha>
          <Beta>
            <ControlPane />
          </Beta>
        </StyledSplitPane>
      </ParentSplitPane>
      <ParentScrollBar>
        <HorizontalScaleScrollBar
          scrollOffset={scrollLeft}
          contentLength={contentWidth}
          onScroll={useCallback((v: any) => s.setScrollLeftInPixels(v), [s])}
          onClickScaleUp={onClickScaleUpHorizontal}
          onClickScaleDown={onClickScaleDownHorizontal}
          onClickScaleReset={onClickScaleResetHorizontal}
        />
      </ParentScrollBar>
    </Parent>
  )
})

export default PianoRollWrapper
