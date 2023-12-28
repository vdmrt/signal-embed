/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React, { Children, ReactElement, useState } from "react"

//2023/12/26 created for closeable split pane.
export type Direction = "up" | "down" | "left" | "right"
const closeablePaneStyle = css`
  display: block;
`
const closeablePaneStyleClosed = css`
  display: none;
`
const closeablePaneCloserStyle = css`
  background: #111808;
  opacity: 0.9;
  position: relative;
`
const closeablePaneCloserStyleHorizontal = css`
  height: 11px;
`
const closeablePaneCloserStyleVertical = css`
  width: 11px;
`
const closeablePaneCloserKnobStyle = css`
  z-index: 3;
  height: var(--knob-height);
  width: var(--knob-width);
  background: #231;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: calc(var(--knob-height) * (-0.5)) 0 0 calc(var(--knob-width) * (-0.5));

  &:hover {
    background: #788840;
  }
`
const closeablePaneCloserKnobStyleHorizontal = css`
  --knob-width: 200px;
  --knob-height: 9px;
`
const closeablePaneCloserKnobStyleVertical = css`
  --knob-width: 9px;
  --knob-height: 200px;
`
const closeablePaneCloserMarkerStyle = css`
  z-index: 4;
  --marker-size: 8px;
  --marker-color: #b2ce54;
  position: absolute;
  top: 50%;
  left: 50%;
`

const closeablePaneCloserMarkerStyleUp = css`
  /*https://www.granfairs.com/blog/staff/make-triangle-with-css*/
  border-right: calc(var(--marker-size) * (0.5)) solid transparent;
  border-bottom: calc(var(--marker-size) * (0.866025)) solid var(--marker-color);
  border-left: calc(var(--marker-size) * (0.5)) solid transparent;
  margin: calc(var(--marker-size) * (-0.433013)) 0 0
    calc(var(--marker-size) * (-0.5));
`
const closeablePaneCloserMarkerStyleDown = css`
  /*https://www.granfairs.com/blog/staff/make-triangle-with-css*/
  border-right: calc(var(--marker-size) * (0.5)) solid transparent;
  border-top: calc(var(--marker-size) * (0.866025)) solid var(--marker-color);
  border-left: calc(var(--marker-size) * (0.5)) solid transparent;
  margin: calc(var(--marker-size) * (-0.433013)) 0 0
    calc(var(--marker-size) * (-0.5));
`
const closeablePaneCloserMarkerStyleLeft = css`
  /*https://www.granfairs.com/blog/staff/make-triangle-with-css*/
  border-bottom: calc(var(--marker-size) * (0.5)) solid transparent;
  border-right: calc(var(--marker-size) * (0.866025)) solid var(--marker-color);
  border-top: calc(var(--marker-size) * (0.5)) solid transparent;
  margin: calc(var(--marker-size) * (-0.5)) 0 0
    calc(var(--marker-size) * (-0.433013));
`
const closeablePaneCloserMarkerStyleRight = css`
  /*https://www.granfairs.com/blog/staff/make-triangle-with-css*/
  border-bottom: calc(var(--marker-size) * (0.5)) solid transparent;
  border-left: calc(var(--marker-size) * (0.866025)) solid var(--marker-color);
  border-top: calc(var(--marker-size) * (0.5)) solid transparent;
  margin: calc(var(--marker-size) * (-0.5)) 0 0
    calc(var(--marker-size) * (-0.433013));
`

//TODO: refactoring around common parts
//Standard Version
type PropsCloseablePane = { closed?: boolean; direction?: Direction }
export function CloseablePane(
  props: React.PropsWithChildren<PropsCloseablePane>,
) {
  const [closedState, setClosed] = useState(props.closed)

  function handleClick() {
    setClosed(!closedState)
  }
  let horizontal = props.direction == "down" || props.direction == "up"
  let closer = (
    <span
      css={[
        closeablePaneCloserStyle,
        horizontal
          ? closeablePaneCloserStyleHorizontal
          : closeablePaneCloserStyleVertical,
      ]}
    >
      <span
        css={[
          closeablePaneCloserKnobStyle,
          horizontal
            ? closeablePaneCloserKnobStyleHorizontal
            : closeablePaneCloserKnobStyleVertical,
        ]}
        onClick={handleClick}
      ></span>
      <span
        css={[
          closeablePaneCloserMarkerStyle,
          closedState !== (props.direction == "left" || props.direction == "up")
            ? horizontal
              ? closeablePaneCloserMarkerStyleUp
              : closeablePaneCloserMarkerStyleLeft
            : horizontal
              ? closeablePaneCloserMarkerStyleDown
              : closeablePaneCloserMarkerStyleRight,
        ]}
      ></span>
    </span>
  )
  let sizeStyle = undefined //props.size ? (horizontal ? css`height: ${props.size}` : css`width: ${props.size}`) : undefined;
  return (
    <>
      {props.direction == "down" || props.direction == "right" ? closer : null}
      <div
        css={[
          closedState ? closeablePaneStyleClosed : closeablePaneStyle,
          sizeStyle,
        ]}
      >
        {props.children}
      </div>
      {props.direction == "up" || props.direction == "left" ? closer : null}
    </>
  )
}

//PianoRoll will corrupt if arranged in a component without {display: "flex"} style.
export function FlexStyled(props: React.PropsWithChildren) {
  const child = Children.only(props.children) as ReactElement
  let newStyle =
    child.props["style"] === undefined
      ? {}
      : Object.assign({}, child.props["style"])

  newStyle = {
    ...newStyle,
    display: "flex",
  }
  const newChild = React.cloneElement(child, {
    ...child.props,
    style: newStyle,
  })
  return newChild
}

//A Special Version for PianoRoll.
//- mutates its child component's style instead of enclosing it by a <div> element.
//  Resizer works only if the two panes are at the same level.
//- prevents the PianoRoll corruption described above
export function CloseablePane2(
  props: React.PropsWithChildren<PropsCloseablePane>,
) {
  const [closedState, setClosed] = useState(props.closed)

  function handleClick() {
    setClosed(!closedState)
  }
  let horizontal = props.direction == "down" || props.direction == "up"
  let closer = (
    <span
      css={[
        closeablePaneCloserStyle,
        horizontal
          ? closeablePaneCloserStyleHorizontal
          : closeablePaneCloserStyleVertical,
      ]}
    >
      <span
        css={[
          closeablePaneCloserKnobStyle,
          horizontal
            ? closeablePaneCloserKnobStyleHorizontal
            : closeablePaneCloserKnobStyleVertical,
        ]}
        onClick={handleClick}
      ></span>
      <span
        css={[
          closeablePaneCloserMarkerStyle,
          closedState !== (props.direction == "left" || props.direction == "up")
            ? horizontal
              ? closeablePaneCloserMarkerStyleUp
              : closeablePaneCloserMarkerStyleLeft
            : horizontal
              ? closeablePaneCloserMarkerStyleDown
              : closeablePaneCloserMarkerStyleRight,
        ]}
      ></span>
    </span>
  )

  const child = Children.only(props.children) as ReactElement
  let newStyle =
    child.props["style"] === undefined
      ? {}
      : Object.assign({}, child.props["style"])

  if (closedState) {
    newStyle = {
      ...newStyle,
      display: "none",
    }
  }
  const newChild = React.cloneElement(child, {
    ...child.props,
    style: newStyle,
  })
  return (
    <>
      {props.direction == "down" || props.direction == "right" ? closer : null}
      {newChild}
      {props.direction == "up" || props.direction == "left" ? closer : null}
    </>
  )
}
