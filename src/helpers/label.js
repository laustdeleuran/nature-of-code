export default class Label {
  /**
   * @constructor
   * @param {settings}
   * @prop {string} title
   * @prop {string} desc
   * @prop {HTMLElement} container
   */
  constructor({ title, desc, container = document.body }) {
    this._elements = {
      title: document.createElement('h1'),
      desc: document.createElement('p'),
    };

    this._values = {
      title,
      desc: desc,
    };

    this._container = container;

    this.update();
  }

  /**
   * Update elements
   */
  update() {
    const { title: titleElement, desc: descElement } = this._elements;
    const { title: titleValue, desc: descValue } = this._values;

    // Update title
    if (titleValue) {
      this._container.appendChild(titleElement);
    } else if (titleElement.parentNode) {
      titleElement.parentNode.removeChild(titleElement);
    }
    titleElement.textContent = titleValue || '';

    // Update desc
    if (descValue) {
      this._container.appendChild(descElement);
    } else if (descElement.parentNode) {
      descElement.parentNode.removeChild(descElement);
    }
    descElement.textContent = descValue || '';
  }

  /**
   * Set title
   * @param {string} value
   */
  set title(value) {
    this._values.title = value;
    this.update();
  }

  /**
   * Set desc
   * @param {string} value
   */
  set desc(value) {
    this._values.desc = value;
    this.update();
  }
}
