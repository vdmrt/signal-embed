import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"
import { configure } from "mobx"
import ReactDOM from "react-dom/client"
//import { createRoot } from "react-dom/client"
import { App } from "./components/App/App"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
})

configure({
  enforceActions: "never",
})

//const root = createRoot(document.querySelector("#root")!)
//root.render(<App />)

export const CLASS_NAME_WINDOW = "singal_window"
const CLASS_NAME_ENDFLAG = "signal_end"

const es: HTMLCollectionOf<Element> =
  document.getElementsByClassName(CLASS_NAME_WINDOW)

for (let i: number = 0; i < es.length; i++) {
  const e: HTMLElement = es[i] as HTMLElement
  //console.log(e.childNodes.length)
  if (e.getElementsByClassName(CLASS_NAME_ENDFLAG).length > 0) {
    //console.log("already occupied")
  } else {
    let ee = document.createElement("span")
    ee.className = CLASS_NAME_ENDFLAG
    e.appendChild(ee)

    const root = ReactDOM.createRoot(e)
    root.render(<App elem={e} />)
  }
}
