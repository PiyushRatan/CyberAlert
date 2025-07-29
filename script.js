
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
        }, 1000);
        sendToBackend(input, resultBox, timerInterval);
    });

    // Allow pressing Enter in the input field to trigger the backend call
    inputText.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            submitBtn.click();
        }
    });
});

async function sendToBackend(input, resultBox, timerInterval) {
    try {
        const res = await fetch("https://flask-backend-t3sb.onrender.com/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question: input })
        });
        if (!res.ok) {
            throw new Error(`Server responded with status ${res.status}`);
        }
        const data = await res.json();
        if (!data.answer || !data.severity || !data.action) {
            throw new Error("Incomplete response from server.");
        }
        clearInterval(timerInterval);
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
// Loader CSS (inject if not present)
if (!document.getElementById('loader-style')) {
    const style = document.createElement('style');
    style.id = 'loader-style';
    style.textContent = `
    .loader-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        animation: spin 1s linear infinite;
        margin-bottom: 8px;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    `;
    document.head.appendChild(style);
}
