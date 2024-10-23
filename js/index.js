// Write custom JavaScript here.
// You may ignore this file and delete if if JavaScript is not required for your challenge.
let IdMap = new Set();
class TextArea extends HTMLElement {
  constructor() {
    super();
    this.id = this.updateIdMap();
    this.element = IdMap.size;
  }
  static observedAttributes = [
    "title",
    "placeholder",
    "wordLimit",
    "currentWords",
    "errors",
  ];
  attributeChangedCallback(name, oldval, newval) {
    console.log("attribute change called for", name);
    if (oldval !== newval) {
      this[name] = newval;
    }
  }
  get title() {
    return this.getAttribute("title");
  }

  get errors() {
    return JSON.parse(this.getAttribute("errors"));
  }
  set errors(val) {
    return this.setAttribute("errors", val);
  }

  get placeholder() {
    return this.getAttribute("placeholder");
  }
  get wordLimit() {
    return this.getAttribute("wordLimit");
  }
  get currentWords() {
    return this.getAttribute("currentWords");
  }
  set title(val) {
    this.setAttribute("title", val);
  }
  set placeholder(val) {
    this.setAttribute("placeholder", val);
  }
  set wordLimit(val) {
    this.setAttribute("wordLimit", val);
  }
  set currentWords(value) {
    this.setAttribute("currentWords", value || 0);
    if (this.charCounter)
      this.charCounter.innerText = `${this.currentWords}/${this.wordLimit}`;
  }
  get id() {
    return this._id;
  }
  set id(val) {
    this._id = val;
  }
  updateIdMap() {
    if (this.id) {
      return this.id;
    }
    let id = "textarea-" + Math.floor(Math.random() * 100000);
    if (IdMap.has(id)) {
      this.updateIdMap();
    } else {
      IdMap.add(id);
      return id;
    }
  }
  handleChange(event) {
    this.currentWords = event.target.value.length;
    this.handleError();
  }
  handleError() {
    if (!this.errors) return;
    console.log(this.errors, this.currentWords);
    let hasError = false;
    this.errors.forEach((error) => {
      if (
        !hasError &&
        error?.name === "required" &&
        parseInt(this.currentWords) === 0
      ) {
        this.errorP.innerText = error?.message;
        this.textbox.classList.add("border-red");
        hasError = true;
      } else if (
        !hasError &&
        error?.name === "maxLength" &&
        parseInt(this.currentWords) > parseInt(this.wordLimit)
      ) {
        this.errorP.innerText = error?.message;
        if (this.charCounter) this.charCounter.classList.add("red");
        this.textbox.classList.add("border-red");
        hasError = true;
      }
    });
    if (!hasError) {
      if (this.charCounter) this.charCounter.classList.remove("red");
      this.textbox.classList.remove("border-red");
      this.errorP.innerText = "";
    }
  }
  connectedCallback() {
    this.currentWords = this.currentWords || 0;
    this.innerHTML = `
    <section>
    <label for="${this.id}">${this.title}</label>
    <textarea rows=5 id=${this.id} placeholder="${this.placeholder}"></textarea>
    <div class="sub-container">
    <p class="red" id=${this.element}-error></p>
    ${
      this.wordLimit
        ? "<p id = " + this.element + "-p>0/" + this.wordLimit + "</p>"
        : ""
    }
    </div>
    </section>
    `;
    this.textbox = document.getElementById(this.id);
    this.textbox.addEventListener("input", (event) => this.handleChange(event));
    this.charCounter = document.getElementById(this.element + "-p");
    this.errorP = document.getElementById(this.element + "-error");
    console.log(this.charCounter, this.errorP);
    this.handleError();
  }
}

// Define the custom element
customElements.define("text-area", TextArea);
