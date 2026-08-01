from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email config (Emergent managed email proxy)
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Dekora Clean S.A.S")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "j-var79@gmail.com")

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

SERVICE_LABELS = {
    "curtains": "Cortinas y Persianas",
    "carpets": "Alfombras y Tapetes",
    "furniture": "Lavado de Muebles",
    "linens": "Lencería y Ropa de Cama",
    "flooring": "Pisos de Madera y Laminados",
    "automotive": "Tapicería Automotriz",
    "repairs": "Arreglos Locativos",
    "laundry": "Lavandería y Sastrería",
}


def build_contact_email_html(contact) -> str:
    service = SERVICE_LABELS.get(contact.service_type, contact.service_type or "No especificado")
    message = contact.message or "Sin mensaje"
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafb;padding:24px;font-family:Arial,sans-serif;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8ecef;">
          <tr><td style="background:#2ED573;padding:24px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;">Dekora Clean S.A.S</h1>
            <p style="margin:4px 0 0;color:#ffffff;font-size:13px;">Nueva solicitud de cotización</p>
          </td></tr>
          <tr><td style="padding:32px;">
            <p style="margin:0 0 16px;color:#1e272e;font-size:15px;">Has recibido una nueva solicitud desde el sitio web:</p>
            <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px;color:#1e272e;">
              <tr><td style="width:140px;color:#57606f;font-weight:bold;">Nombre:</td><td>{contact.name}</td></tr>
              <tr><td style="color:#57606f;font-weight:bold;">Correo:</td><td>{contact.email}</td></tr>
              <tr><td style="color:#57606f;font-weight:bold;">Teléfono:</td><td>{contact.phone}</td></tr>
              <tr><td style="color:#57606f;font-weight:bold;">Servicio:</td><td>{service}</td></tr>
              <tr><td style="color:#57606f;font-weight:bold;vertical-align:top;">Mensaje:</td><td>{message}</td></tr>
            </table>
          </td></tr>
          <tr><td style="background:#1e272e;padding:16px 32px;">
            <p style="margin:0;color:#a4b0be;font-size:12px;">Recibido el {contact.created_at.strftime('%d/%m/%Y %H:%M')} UTC</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


async def send_contact_notification(contact) -> bool:
    """Send email notification to the business owner."""
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY not set - skipping email notification")
        return False
    payload = {
        "to": [OWNER_EMAIL],
        "subject": f"Nueva cotización de {contact.name} - Dekora Clean",
        "html": build_contact_email_html(contact),
        "from_name": EMAIL_FROM_NAME,
        "contact_email": contact.email,
    }
    try:
        async with httpx.AsyncClient(timeout=30) as http_client:
            resp = await http_client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        logger.info(f"Contact notification email sent to {OWNER_EMAIL}")
        return True
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        return False
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        return False


# Models
class ContactFormCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service_type: str
    message: Optional[str] = ""

class ContactForm(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    service_type: str
    message: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactFormResponse(BaseModel):
    success: bool
    message: str
    contact_id: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "Dekora Clean API"}

@api_router.post("/contact", response_model=ContactFormResponse)
async def submit_contact_form(form_data: ContactFormCreate):
    """Submit contact form - saves to database and sends email notification"""
    try:
        contact = ContactForm(**form_data.model_dump())
        doc = contact.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.contact_submissions.insert_one(doc)
        logger.info(f"Contact form submitted: {contact.email}")
        
        # Send email notification to owner
        await send_contact_notification(contact)
        
        return ContactFormResponse(
            success=True,
            message="Formulario enviado exitosamente. Nos pondremos en contacto pronto.",
            contact_id=contact.id
        )
    except Exception as e:
        logger.error(f"Error submitting contact form: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/contacts", response_model=List[ContactForm])
async def get_contacts():
    """Get all contact submissions (admin use)"""
    contacts = await db.contact_submissions.find({}, {"_id": 0}).to_list(1000)
    for contact in contacts:
        if isinstance(contact.get('created_at'), str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'])
    return contacts

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
