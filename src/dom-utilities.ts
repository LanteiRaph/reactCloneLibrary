import { TEXT_ELEMENT } from "./elements";
/**
 * @param {HTMLElement} dom - the html element where props get applied to
 * @param {object} props - consists of both attributes and event listeners.
 */
 export function updateDomProperties(dom: { [x: string]: any; removeEventListener: (arg0: string, arg1: any) => void; addEventListener: (arg0: string, arg1: any) => void; }, prevProps: { [x: string]: any; }, nextProps: { [x: string]: any; }) {
    const isEvent = (name) => name.startsWith("on");
    const isAttribute = (name) => !isEvent(name) && name != "children";
    // Remove event listeners
    Object.keys(prevProps)
      .filter(isEvent)
      .forEach((name) => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
      });
    // Remove attributes
    Object.keys(prevProps)
      .filter(isAttribute)
      .forEach((name) => {
        dom[name] = null;
      });
    // Set new attributes
    Object.keys(nextProps)
      .filter(isAttribute)
      .forEach((name) => {
        dom[name] = nextProps[name];
      });
    // Set new eventListeners
    Object.keys(nextProps)
      .filter(isEvent)
      .forEach((name) => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
      });
  }