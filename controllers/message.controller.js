import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config()

// const API_KEY = process.env.API_KEY;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const sendMessage = async (req, res) => {
    const userId = req.user._id;
    const { text } = req.body;

    try {
        // Find or create a conversation for the user
        let conversation = await Conversation.findOne({ userId }).populate('messages');

        if (!conversation) {
            conversation = new Conversation({ userId });
            await conversation.save();
        }

        // Create a new message with the user's input
        const userMessage = new Message({
            conversationId: conversation._id,
            sender: 'user',
            text,
        });
        await userMessage.save();

        // Prepare the conversation history for the AI prompt
        const previousMessages = conversation.messages.map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`).join('\n');
        const prompt = `${previousMessages}\nUser: ${text}`;

        // Call Gemini API to get a response
        const result = await model.generateContent(prompt);
        if (!result) console.log("error in model response");

        let botResponse = result.response.text();

        // Remove the "Bot:" prefix if it exists
        if (botResponse.startsWith("Bot:")) {
            botResponse = botResponse.replace("Bot:", "").trim();
        }

        // Create a new message with the bot's response
        const botMessage = new Message({
            conversationId: conversation._id,
            sender: 'bot',
            text: botResponse,
        });
        await botMessage.save();

        // Add messages to the conversation
        conversation.messages.push(userMessage._id, botMessage._id);
        await conversation.save();

        // Return the latest messages only (user message and bot response)
        res.status(200).json([userMessage, botMessage]);

    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
};



export const getAllMessage = async (req, res) => {
    const userId = req.user._id;


    try {
        // Find the conversation for the user
        const conversation = await Conversation.findOne({ userId }).populate('messages');

        if (!conversation) {
            return res.status(201).json("welcom")
        }

        res.status(200).json(conversation);
      

    } catch (error) {
        console.error('Error in getAllMessage:', error);
        res.status(500).json({ error: 'An error occurred while fetching the conversation.' });
    }
};