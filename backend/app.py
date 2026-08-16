print("APP LOADED")
import os
from typing import Optional

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from gemini_service import generate_listing

app = FastAPI(title="CraftAI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}

@app.get("/")
def root():
    print("ROOT HIT")
    return {"message": "backend working"}


@app.post("/generate")
async def generate(
    image: UploadFile = File(...),
    product_name: str = Form(""),
    category: str = Form(""),
    material: str = Form(""),
    dimensions: str = Form(""),
    story: str = Form(""),
    notes: str = Form(""),
) -> dict:

    print("GENERATE ENDPOINT HIT")
    print("\n========== REQUEST RECEIVED ==========")
    print("Image object:", image)
    print("Filename:", image.filename if image else None)
    print("Content-Type:", image.content_type if image else None)
    print("Product:", product_name)
    print("Category:", category)
    print("Material:", material)
    print("Dimensions:", dimensions)
    print("Story:", story)
    print("Notes:", notes)
    print("======================================\n")

    image_bytes = await image.read()
    image_content_type = image.content_type or "image/jpeg"

    result = generate_listing(
        product_name=product_name,
        category=category,
        material=material,
        dimensions=dimensions,
        story=story,
        notes=notes,
        image_bytes=image_bytes,
        image_content_type=image_content_type,
    )

    return result
