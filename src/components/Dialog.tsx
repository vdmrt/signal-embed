import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import {
  Content,
  Overlay,
  Portal,
  DialogProps as Props,
  Root,
} from "@radix-ui/react-dialog"
import { Portal as _Portal1 } from "@radix-ui/react-portal"
import { FC } from "react"
import { CLASS_NAME_WINDOW } from "../main/index"

const overlayShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const contentShow = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`
//2023/12/31 configurable position property (fixed or absolute)
const StyledOverlay = styled(Overlay)`
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
  inset: 0;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`

const StyledContent = styled(Content)`
  background-color: ${({ theme }) => theme.backgroundColor};
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 3rem ${({ theme }) => theme.shadowColor};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-bottom: 1rem;
  max-width: 30rem;
  max-height: 85vh;
  padding: 1rem;
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  overflow: hidden;

  &:focus {
    outline: none;
  }
  z-index: 10;
` //2023/12/31 prevent covered by CloseablePanes

//2023/12/31 add "container" of its portal to props
type PortalProps = React.ComponentPropsWithoutRef<typeof _Portal1>
export type DialogProps = Props & {
  style?: React.CSSProperties
  container?: PortalProps["container"]
  positionFixed?: boolean
}

export const Dialog: FC<DialogProps> = ({
  children,
  style,
  container,
  positionFixed,
  ...props
}) => (
  <Root {...props}>
    <Portal container={container}>
      <StyledOverlay
        style={{
          position:
            positionFixed === undefined || positionFixed ? "fixed" : "absolute",
        }}
      />
      <StyledContent
        className={CLASS_NAME_WINDOW}
        style={{
          ...style,
          position:
            positionFixed === undefined || positionFixed ? "fixed" : "absolute",
        }}
      >
        {children}
      </StyledContent>
    </Portal>
  </Root>
)

export const DialogTitle = styled.div`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 1.5rem;
`

export const DialogContent = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  margin-bottom: 1rem;
`

export const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;

  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`
