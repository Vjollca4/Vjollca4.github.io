// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
let currentTheme = localStorage.getItem("theme") || "light";

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

setTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(currentTheme);
});

// Calendar and Markdown Loading
const datePicker = document.getElementById("datePicker");
const dayContent = document.getElementById("dayContent");

// Set today's date as default
const today = new Date();
datePicker.value = today.toISOString().split("T")[0];

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return code;
  },
});

async function loadMarkdownContent(date) {
  const filePath = `learnings/${date}.md`;

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error("File not found");
    }

    const markdown = await response.text();
    const html = marked.parse(markdown);

    dayContent.innerHTML = `
            <div class="markdown-content">
                ${html}
            </div>
        `;

    // Add syntax highlighting if needed
    if (typeof hljs !== "undefined") {
      document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightBlock(block);
      });
    }
  } catch (error) {
    dayContent.innerHTML = `
            <div class="no-content">
                <h2>No Learning Entry Found</h2>
                <p>There's no learning entry for ${date}. Check back later or select a different date.</p>
            </div>
        `;
  }
}

// Event listener for date picker
datePicker.addEventListener("change", (e) => {
  loadMarkdownContent(e.target.value);
});

// Load initial content
loadMarkdownContent(datePicker.value);

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}
