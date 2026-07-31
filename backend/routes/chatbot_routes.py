from flask import Blueprint, request, jsonify

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '').lower()
    
    # Simple Rule-Based Logic
    response = "I'm still learning! Try asking about 'shipping', 'vets', 'food', or 'hours'."

    if "hello" in user_message or "hi" in user_message:
        response = "Woof! Hi there! I'm Tizly's assistant. How can I help you and your pet today?"
    
    elif "shipping" in user_message or "delivery" in user_message:
        response = "We offer free shipping on orders over $50! Standard delivery takes 3-5 business days."
    
    elif "vet" in user_message or "doctor" in user_message or "appointment" in user_message:
        response = "You can book an appointment with our expert vets in the 'Vetcare' section of our site."
    
    elif "food" in user_message or "diet" in user_message:
        response = "We have a wide range of premium organic food for dogs and cats in our Shop!"
    
    elif "cat" in user_message:
        response = "Cats are wonderful! We have special grooming packages and toys just for felines in the shop."
        
    elif "dog" in user_message:
        response = "Dogs are the best! Check out our durable chew toys and high-protein kibble."

    return jsonify({"response": response}), 200