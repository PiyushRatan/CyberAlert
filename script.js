document.addEventListener("DOMContentLoaded", function() {
    const submitBtn = document.getElementById("submitBtn");
    const inputText = document.getElementById("inputText");
    const resultBox = document.getElementById("responseBox");
    if (!submitBtn || !inputText || !resultBox) {
        console.error("Required elements not found in the DOM.");
        return;
    }
    
    submitBtn.addEventListener("click", function () {
        const input = inputText.value.trim();
        let language = document.getElementById("language-selector").value;
        console.log(language);
        document.getElementById("promise").hidden = true;
        const alerts = document.getElementsByClassName("alert");
        for (let i = 0; i < alerts.length; i++) {
            alerts[i].hidden = true;
        }
        // Determine severity class for container
        if (!input) {
            resultBox.innerHTML = "<p>Please enter a message to analyze.</p>";
            return;
        }
        // Loader with timer
        let seconds = 0;
        resultBox.innerHTML = `
            <div class="loader-container">
                <div class="loader"></div>
                <p><em>Analyzing... <span id="timer">0</span>s</em></p>
            </div>
        `;
        let timerInterval = setInterval(() => {
            seconds++;
            const timerSpan = document.getElementById("timer");
            if (timerSpan) timerSpan.textContent = seconds;
            // Timer alert logic moved here and fixed
            if (seconds === 7) {
                document.getElementById("alert2").hidden = false;
            } else if (seconds === 20) {
                document.getElementById("alert2").hidden = true;
                document.getElementById("alert3").hidden = false; // changed from alert3 to alertBoot
            } else if(seconds === 30) {
                document.getElementById("alert3").hidden = true;
                document.getElementById("alert4").hidden = false;
            }
        }, 1000);
        sendToBackend(input, resultBox, timerInterval,language);
    });
    // Removed broken timerInterval logic from here
    // ...existing code...
    inputText.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            submitBtn.click();
        }
    });
});

async function sendToBackend(input, resultBox, timerInterval, language) {
    try {
        const res = await fetch("https://flask-backend-t3sb.onrender.com/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question: input , language:language})
        });
        if (!res.ok) {
            throw new Error(`Server responded with status ${res.status}`);
        }
        const data = await res.json();
        if (!data.answer || !data.severity || !data.action) {
            throw new Error("Incomplete response from server.");
        }
        clearInterval(timerInterval);
        // Hide all alert
        const alerts = document.getElementsByClassName("alert");
        for (let i = 0; i < alerts.length; i++) {
            alerts[i].hidden = true;
        }
        // Determine severity class for container
        let severityClass = '';
        if (data.severity) {
            const sev = data.severity.toLowerCase();
            if (sev === 'low') severityClass = 'severity-low';
            else if (sev === 'moderate') severityClass = 'severity-moderate';
            else if (sev === 'high') severityClass = 'severity-high';
            else if (sev === 'critical') severityClass = 'severity-critical';
        }
        resultBox.innerHTML = `
            <div class="response-container ${severityClass}">
                <div class="responseBox-inner">
                    <p id="responseLabel" class="responseLabel"><strong>🧠 Response:  </strong> ${data.answer}</p>
                    <p id="responseSeverity" class="responseSeverity"><strong>🔥 Severity:</strong> <span class="severity severity-${data.severity.toLowerCase()}">${data.severity}</span></p>
                    <p id="responseAction" class="responseAction"><strong>🛡️ Recommended Action:</strong> ${data.action}</p>
                </div>
            </div>
        `;
    } catch (error) {
        clearInterval(timerInterval);
        console.error("Error:", error);
        resultBox.innerHTML = "<p>❌ Error occurred. Please try again later.</p>";
    }
}
// Loader CSS (Not needed i just used cs heheehe)
if (!document.getElementById('loader-style')) {
    const style = document.createElement('style');
    style.id = 'loader-style';
    style.textContent = `
    
    `;
    document.head.appendChild(style);
}
// Add this JavaScript to handle the hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navList.classList.toggle('active');
    
    // Update aria-expanded attribute for accessibility
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
  });
  
  // Close menu when clicking on a nav link (optional)
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('active');
        navList.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });
});