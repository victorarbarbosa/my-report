package com.myreport.api.application;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

@Service
public class AIService {
    public String sendMessage(String prompt) {
        Client client = Client.builder().apiKey("AIzaSyAfxqXST6vM-A61zqjlNsiXFwhowdAsb8g").build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.5-flash",
                        prompt,
                        null);

        return response.text();
    }
}