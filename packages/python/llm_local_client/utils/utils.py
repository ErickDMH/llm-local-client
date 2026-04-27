class Utils:
    def __init__(self, client):
        self.client = client

    def translate(self, text: str, target_language: str) -> str:
        prompt = f"Translate the following text to {target_language}:\n\n{text}"
        return self.client.prompt(message=prompt)

    def infer_language(self, text: str) -> str:
        prompt = f"Identify the language of the following text. Respond with ONLY the name of the language (e.g., English, Spanish):\n\n{text}"
        result = self.client.prompt(message=prompt)
        return result.strip()

    def audio_to_text(self, audio_path: str) -> str:
        # Stub: Requires external service or specific audio model like Whisper.
        raise NotImplementedError("audio_to_text not natively supported by Ollama text models yet. Use a Whisper endpoint.")

    def interpret_image(self, image_path_base64: str) -> str:
        # Uses a multimodal model like LLaVA
        return self.client.prompt(
            message='Describe this image in detail.',
            images=[image_path_base64]
        )
