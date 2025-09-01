from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import uuid
from datetime import datetime
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class BlueprintRequest(BaseModel):
    system_prompt: str
    user_query: str

class BlueprintResponse(BaseModel):
    blueprint: Dict[str, Any]

class RefinementRequest(BaseModel):
    query: str
    initial_blueprint: Dict[str, Any]

class ContactSubmission(BaseModel):
    contact: Dict[str, str]
    blueprint: Dict[str, Any]
    timestamp: str

class ContactResponse(BaseModel):
    message: str
    id: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/generate-blueprint", response_model=BlueprintResponse)
async def generate_blueprint(request: BlueprintRequest):
    """Generate AI strategic blueprint using LLM"""
    try:
        # Create a new LLM chat instance
        chat = LlmChat(
            api_key="emergent",  # Using Emergent LLM key
            session_id=f"blueprint-{uuid.uuid4()}",
            system_message=request.system_prompt
        ).with_model("openai", "gpt-4o")
        
        # Create user message with JSON response instruction
        user_message = UserMessage(
            text=f"{request.user_query}\n\nRespond ONLY with a valid JSON object containing 'headline', 'key_points' (array), and 'recommendation' keys."
        )
        
        # Send message and get response
        response = await chat.send_message(user_message)
        
        # Parse JSON response
        try:
            blueprint = json.loads(response.strip())
            return BlueprintResponse(blueprint=blueprint)
        except json.JSONDecodeError:
            # Fallback blueprint if JSON parsing fails
            fallback_blueprint = {
                "headline": "Strategic AI Assessment Complete",
                "key_points": [
                    "Your organization shows strong potential for AI integration",
                    "Custom AI solutions can address your specific operational needs",
                    "Data analytics capabilities will enhance decision-making processes",
                    "Intelligent automation can optimize workflow efficiency"
                ],
                "recommendation": "Based on your assessment, we recommend starting with a comprehensive AI strategy consultation to identify the highest-impact opportunities for your organization."
            }
            return BlueprintResponse(blueprint=fallback_blueprint)
            
    except Exception as e:
        logger.error(f"Blueprint generation error: {str(e)}")
        # Return fallback blueprint on error
        fallback_blueprint = {
            "headline": "AI Strategy Consultation Recommended",
            "key_points": [
                "Assessment indicates readiness for AI implementation",
                "Multiple integration opportunities have been identified",
                "Strategic planning will maximize technology investments"
            ],
            "recommendation": "We recommend scheduling a detailed consultation to explore your AI transformation potential further."
        }
        return BlueprintResponse(blueprint=fallback_blueprint)

@api_router.post("/refine-blueprint")
async def refine_blueprint(request: RefinementRequest):
    """Refine existing blueprint with follow-up questions"""
    try:
        chat = LlmChat(
            api_key="emergent",
            session_id=f"refinement-{uuid.uuid4()}",
            system_message="You are an expert AI strategist for ZYNIQ, continuing a conversation. The client has received an initial blueprint and has a follow-up question. Provide a concise, helpful answer in JSON format with a single key: 'refinement_text' containing a paragraph answering the user's question."
        ).with_model("openai", "gpt-4o")
        
        user_query = f"""Initial blueprint: {json.dumps(request.initial_blueprint)}

Client's follow-up question: "{request.query}"

Provide a helpful answer in JSON format."""
        
        user_message = UserMessage(text=user_query)
        response = await chat.send_message(user_message)
        
        try:
            refinement = json.loads(response.strip())
            return refinement
        except json.JSONDecodeError:
            return {
                "refinement_text": "Thank you for your question. Based on your blueprint, I recommend focusing on the strategic priorities we've identified. Our team can provide more detailed guidance during a consultation call."
            }
            
    except Exception as e:
        logger.error(f"Blueprint refinement error: {str(e)}")
        return {
            "refinement_text": "I apologize, but I'm having trouble processing that question right now. Please try rephrasing it, or feel free to contact our team directly for personalized assistance."
        }

@api_router.post("/submit-contact", response_model=ContactResponse)
async def submit_contact(submission: ContactSubmission):
    """Store contact form submission and blueprint data"""
    try:
        contact_id = str(uuid.uuid4())
        contact_record = {
            "id": contact_id,
            "contact": submission.contact,
            "blueprint": submission.blueprint,
            "timestamp": submission.timestamp,
            "created_at": datetime.utcnow()
        }
        
        # Store in MongoDB
        await db.contacts.insert_one(contact_record)
        
        logger.info(f"Contact submission saved: {contact_id}")
        logger.info(f"Contact details: {submission.contact}")
        
        return ContactResponse(
            message="Contact information received successfully",
            id=contact_id
        )
        
    except Exception as e:
        logger.error(f"Contact submission error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit contact information")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
