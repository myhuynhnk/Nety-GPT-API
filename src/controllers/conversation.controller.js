const Conversation = require("../models/conversation.model");
const createError = require("http-errors");
const axios = require("axios");
const crypto = require("crypto");

const conversationToChatGPT = async (req, res, next) => {
  try {
    let { userId, sessionId, message } = req.body;
    const API_CHAT_GPT = "https://api.openai.com/v1/chat/completions";
    let conversation;
    if (!userId || !message) {
      return res.status(400).json({
        error: "Invalid request. Please provide userID and message.",
      });
    }

    if (!sessionId) {
      sessionId = crypto.randomBytes(32).toString("hex");
      conversation = new Conversation({
        userId,
        sessionId,
        message,
        reply: "",
        timestamp: new Date(),
      });
      conversation.reply = invokeAPIChatGPT(API_CHAT_GPT);
      // save DB
      const savedConversation = await Conversation.create(conversation);
      res.json({ savedConversation });
    }

    const reply = invokeAPIChatGPT(API_CHAT_GPT, message);
    conversation = {
      userId,
      sessionId,
      message,
      reply,
      timestamp: new Date(),
    };

    const savedConversation = await Conversation.create(conversation);
    res.json({ savedConversation });
  } catch (error) {
    console.error("Error during chat:", error);
    res.status(500).json({ error: " Error occurred during chat." });
    next(error);
  }
};

const invokeAPIChatGPT = async (urlEP, message) => {
  console.log("Prepare to call API chat GPT \n" + urlEP);
  try {
    const response = await axios.post(
      urlEP,
      {
        messages: [
          { role: "assistant", content: "" },
          { role: "user", content: message },
        ],
        max_tokens: 1000,
        temperature: 0.6,
      },
      {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
      }
    );
    const reply = response.data.choices[0].message.content;
    return reply;
  } catch (error) {
    console.log("ERROR:| call API chat GPT error: " + error);
    next(error);
  }
};

module.exports = {
  conversationToChatGPT,
};
