const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: 'YOUR_OPENAI_API_KEY' // Replace with your OpenAI API key
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    });
    const aiReply = completion.data.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (error) {
    res.status(500).json({ reply: "Sorry, I couldn't process your request." });
  }
});

app.listen(5000, () => console.log('AI chat server running on port 5000'));

document.getElementById('chat-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const chatInput = document.getElementById('chat-input');
  const chatBox = document.getElementById('chat-box');
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;

  // Display user message
  chatBox.innerHTML += `<div style="margin-bottom:0.5rem;"><strong>You:</strong> ${userMsg}</div>`;
  chatBox.innerHTML += `<div style="margin-bottom:0.5rem;color:#888;"><em>AI is typing...</em></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg })
    });
    const data = await response.json();
    chatBox.innerHTML = chatBox.innerHTML.replace(/<div style="margin-bottom:0.5rem;color:#888;"><em>AI is typing\.\.\.<\/em><\/div>/, '');
    chatBox.innerHTML += `<div style="margin-bottom:0.5rem;"><strong>AI:</strong> ${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch {
    chatBox.innerHTML += `<div style="margin-bottom:0.5rem;"><strong>AI:</strong> Sorry, I couldn't process your request.</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  chatInput.value = '';
});