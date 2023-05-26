const documentStyles = document.body ? window.getComputedStyle(document.body) : window.getComputedStyle(document.querySelector('body'))
const accentColor = documentStyles.getPropertyValue('--accent-color')
const parseSVG = (imgElement) => {
  const parser = new DOMParser();
  let parsedSuccessfully = false;

  if (imgElement instanceof HTMLImageElement) {
    fetch(imgElement.src)
      .then(response => response.text())
      .then(text => {
        if (text) {
          const parsed = parser.parseFromString(text, 'text/html');
          const svg = parsed.querySelector('svg');

          if (svg !== null) {
            imgElement.replaceWith(svg);
            parsedSuccessfully = true;
          }
        }
      });
  }

  return parsedSuccessfully
}

const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  }
  catch(e){
    return false;
  }
}

const setImageFallback = (element, fallbackSrc) => {
  if ((element instanceof HTMLImageElement || element instanceof HTMLObjectElement) && isValidUrl(fallbackSrc)) {
    element.onerror = null;
    element.setAttribute('src', fallbackSrc);
  }

  return element.src
}

customElements.define("collapsible-content",
  class CollapsibleContent extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById("collapsible-content");
      const templateContent = template.content;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(templateContent.cloneNode(true));
    }
    toggleCollapsedContent() {
      return this.toggleAttribute('collapsed');
    }
  }
);

const bulletIcon = (svgHeight= '13', svgWidth= '13', fill= 'black') => {
  const svgItem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  Number(svgHeight) > 0 ? svgItem.setAttribute('height', svgHeight) : svgItem.setAttribute('height', '13');
  Number(svgWidth) > 0 ? svgItem.setAttribute('width', svgWidth) : svgItem.setAttribute('width', '13');
  svgItem.setAttribute("viewBox", `0 0 13 13`);
  CSS.supports('color', fill) ? path.setAttribute('fill', fill) : path.setAttribute('fill', 'black');
  path.setAttribute('d', "M11 3.4L2.12502 12.3C1.92502 12.5 1.68736 12.6 1.41202 12.6C1.13669 12.6 0.899357 12.5 0.700024 12.3C0.500024 12.1 0.400024 11.8623 0.400024 11.587C0.400024 11.3117 0.500024 11.0743 0.700024 10.875L9.60003 2H2.00002C1.71669 2 1.47902 1.904 1.28702 1.712C1.09502 1.52 0.999358 1.28267 1.00002 1C1.00002 0.71667 1.09602 0.479004 1.28802 0.287004C1.48002 0.0950036 1.71736 -0.000663206 2.00002 3.4602e-06H12C12.2834 3.4602e-06 12.521 0.0960036 12.713 0.288004C12.905 0.480004 13.0007 0.717337 13 1V11C13 11.2833 12.904 11.521 12.712 11.713C12.52 11.905 12.2827 12.0007 12 12C11.7167 12 11.479 11.904 11.287 11.712C11.095 11.52 10.9994 11.2827 11 11V3.4Z");
  svgItem.appendChild(path);

  return svgItem
}


customElements.define("bulleted-item",
  class BulletedItem extends HTMLLIElement {
    constructor() {
      super();
      const bullet = bulletIcon('13', '13', accentColor)
      console.info(bullet.getAttribute('width'))
      this.insertAdjacentElement('afterbegin', bullet)
    }
  }
, {extends: 'li'})
