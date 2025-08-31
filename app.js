class TicketForm {
  constructor() {
    this.MAX_FILE_SIZE_KB = 500;

    // Grab elements
    this.uploadArea = document.getElementById("upload-area");
    this.fileInput = document.getElementById("file-input");
    this.preview = document.getElementById("preview");
    this.uploadText = document.getElementById("upload-text");
    this.uploadButtons = document.getElementById("upload-buttons");
    this.uploadRemove = document.getElementById("upload-remove");
    this.uploadChange = document.getElementById("upload-change");
    this.form = document.getElementById("form");
    this.fullNameInput = document.getElementById("full-name");
    this.emailInput = document.getElementById("email");
    this.githubInput = document.getElementById("github");

    this.formSection = document.getElementById("form-section");
    this.ticketSection = document.getElementById("ticket-section");

    // Set initial view state
    this.formSection.style.display = "block";
    this.ticketSection.style.display = "none";

    // Bind event handlers to ensure correct `this`
    this.handleAreaClick = this.handleAreaClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    // Attach event listeners
    this.uploadArea.addEventListener("click", this.handleAreaClick);
    this.fileInput.addEventListener("change", this.handleInputChange);
    this.uploadArea.addEventListener("dragover", this.handleDragOver);
    this.uploadArea.addEventListener("dragleave", this.handleDragLeave);
    this.uploadArea.addEventListener("drop", this.handleDrop);
    this.uploadRemove.addEventListener("click", this.handleRemove);
    this.uploadChange.addEventListener("click", this.handleChange);
    this.form.addEventListener("submit", this.handleFormSubmit);

    // Allow Enter key to trigger file selection when focused on the upload area
    this.uploadArea.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 && e.target.tagName === "DIV") {
        this.handleAreaClick(e);
      }
    });
  }

  /**
   * Toggle the error state on a form group.
   * Optionally replaces elements with .form__info to .form__error (and vice versa).
   */
  toggleErrorState(group, hasError, hasInfo = false) {
    if (hasError) {
      group.classList.add("form__group--error");
      if (hasInfo) {
        const infoEl = group.querySelector(".form__info");
        if (infoEl) {
          infoEl.classList.replace("form__info", "form__error");
        }
      }
    } else {
      group.classList.remove("form__group--error");
      if (hasInfo) {
        const infoEl = group.querySelector(".form__error");
        if (infoEl) {
          infoEl.classList.replace("form__error", "form__info");
        }
      }
    }
  }

  /**
   * Processes the file (either selected via input or dropped).
   */
  handleFile(file) {
    if (!file) return;

    const formGroup = this.fileInput.closest(".form__group");

    // Check file size (in kilobytes)
    if (file.size / 1024 > this.MAX_FILE_SIZE_KB) {
      this.toggleErrorState(formGroup, true, true);
      return;
    } else {
      this.toggleErrorState(formGroup, false, true);
    }

    // Only process image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.preview.src = event.target.result;
        this.preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }

    this.uploadButtons.style.display = "flex";
    this.uploadText.style.display = "none";
  }

  /**
   * Opens the file input when the upload area is clicked.
   */
  handleAreaClick() {
    this.fileInput.click();
  }

  /**
   * Handles file selection from the input.
   */
  handleInputChange(event) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  /**
   * Adds visual feedback when a file is dragged over the upload area.
   */
  handleDragOver(event) {
    event.preventDefault();
    this.uploadArea.classList.add("dragover");
  }

  /**
   * Removes visual feedback when a file leaves the upload area.
   */
  handleDragLeave() {
    this.uploadArea.classList.remove("dragover");
  }

  /**
   * Handles file drop in the upload area.
   */
  handleDrop(event) {
    event.preventDefault();
    this.uploadArea.classList.remove("dragover");

    const file = event.dataTransfer.files[0];
    this.handleFile(file);
  }

  /**
   * Resets the file input and preview to the initial state.
   */
  handleRemove(event) {
    event.stopPropagation();
    this.fileInput.value = "";

    // Reset preview image to default icon
    this.preview.src = "./assets/images/icon-upload.svg";
    this.preview.style.display = "block";
    this.uploadButtons.style.display = "none";
    this.uploadText.style.display = "block";

    const formGroup = this.fileInput.closest(".form__group");
    this.toggleErrorState(formGroup, false);
  }

  /**
   * Opens the file selector when the change button is clicked.
   */
  handleChange(event) {
    event.stopPropagation();
    this.fileInput.click();
  }

  /**
   * Generates a random 5-digit ticket ID.
   */
  generateTicketId() {
    const randomNum = Math.floor(Math.random() * 100000);
    return randomNum.toString().padStart(5, "0");
  }

  /**
   * Simple email validation.
   */
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  }

  /**
   * Handles the form submission.
   */
  handleFormSubmit(event) {
    event.preventDefault();
    let isValid = true;

    // Validate full name
    const fullNameGroup = this.fullNameInput.parentElement;
    if (!this.fullNameInput.value.trim()) {
      this.toggleErrorState(fullNameGroup, true);
      isValid = false;
    } else {
      this.toggleErrorState(fullNameGroup, false);
    }

    // Validate email
    const emailGroup = this.emailInput.parentElement;
    if (!this.validateEmail(this.emailInput.value)) {
      this.toggleErrorState(emailGroup, true);
      isValid = false;
    } else {
      this.toggleErrorState(emailGroup, false);
    }

    // If validation passes, proceed with form submission steps.
    if (isValid) {
      this.formSection.style.display = "none";
      this.ticketSection.style.display = "block";

      document.getElementById("ticket-name").textContent =
        this.fullNameInput.value;
      document.getElementById("ticket-email").textContent =
        this.emailInput.value;

      if (!this.githubInput.value) {
        document.querySelector(".card__user-github").style.display = "none";
      } else {
        document.getElementById("ticket-github").textContent =
          "@" + this.githubInput.value;
      }

      document.getElementById("ticket-image").src = this.preview.src;
      document.getElementById(
        "ticket-number"
      ).textContent = `# ${this.generateTicketId()}`;
    }
  }
}

// Initialize the TicketForm class once the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", () => {
  new TicketForm();
});
