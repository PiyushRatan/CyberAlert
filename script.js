 async function sendToBackend() {
      const userInput = document.getElementById("inputText").value.trim();
      const responseLabel = document.getElementById("responseLabel");
      const responseText = document.getElementById("responseText");
      const responseBox = document.getElementById("responseBox");

      if (!userInput) {
        responseLabel.textContent = "⚠️ Empty Input";
        responseText.textContent = "Please enter a message to check.";
        responseBox.style.display = "block";
        return;
      }

      responseLabel.textContent = "⏳ Checking...";
      responseText.textContent = "Please wait while we analyze the message.";
      responseBox.style.display = "inline";

      try {
        const res = await fetch("https://flask-backend-t3sb.onrender.com/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ question: userInput })
        });

        const data = await res.json();
        if (data.answer) {
          responseLabel.textContent = "✅ Result";
          responseText.textContent = data.answer;
        } else {
          responseLabel.textContent = "❌ Error";
          responseText.textContent = "Could not get a valid response.";
        }
      } catch (err) {
        responseLabel.textContent = "🚨 Server Error";
        responseText.textContent = "The backend could not be reached.";
      }
    }