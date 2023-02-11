import { updateDomProperties } from "./dom-utilities";
import { TEXT_ELEMENT } from "./elements";
let rootInstance = null; // will keep the reference to the instance rendered on the dom
export function render(element, parentDom) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(parentDom, prevInstance, element);
  rootInstance = nextInstance;
}
function reconcile(parentDom, instance, element) {
  if (instance == null) {
    // initial render
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    /**
     * this section gets hit when
     * a childElement was previously present
     * but in the new element is not present
     * for instance a todo item that has been deleted
     * it was present at first but is now not present
     */
    parentDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type === element.type) {
    /**
     * if the types are the same
     * eg: if prevType was "input" and current type is still "input"
     * NB:// we still havent updated
     * the props of the node rendered in the dom
     */
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    /**
     * if the type of the previous Instance is not the
     * same as the type of the new element
     * we replace the old with the new.
     * eg: if we had an "input" and now have "button"
     * we get rid of the input and replace it with the button
     */
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }
}
function instantiate(element) {
  const { type, props } = element;
  const isTextElement = type === TEXT_ELEMENT;
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(type);
  updateDomProperties(dom, {}, props );
  // Instantiate and append children
  const childElements = props.children || [];
  // we are recursively calling instanciate on each
  // child element
  const childInstances = childElements.map(instantiate);
  const childDoms = childInstances.map(
    (childInstance: { dom: any }) => childInstance.dom
  );
  childDoms.forEach((childDom) => dom.appendChild(childDom));
  const instance = { dom, element, childInstances };
  return instance;
}
function reconcileChildren(
  instance: { dom: any; childInstances: any },
  element: { props: { children: never[] } }
) {
  const dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances: any[] = [];
  const count = Math.max(childInstances.length, nextChildElements.length);
  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    // the reconcile function has logic setup to handle the scenario when either
    // the child instance or the childElement is null
    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }
  return newChildInstances.filter((instance) => instance != null);
}


