import json
import os
import re

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY) if API_KEY else None


def _fallback_listing(
    product_name,
    category,
    material,
    dimensions,
    story,
    notes,
):
    product_name = product_name.strip() if product_name else "Premium Handmade Product"
    category = category.strip() if category else "Handmade Decor"
    material = material.strip() if material else "Natural Materials"
    story = story.strip() if story else "traditional artisan craftsmanship"

    return {
        "product_analysis": {
            "product_type": product_name,
            "craft_style": category,
            "materials": [material],
            "primary_colors": [],
            "secondary_colors": [],
            "patterns_and_motifs": [],
            "visible_techniques": [],
            "purpose": "Decorative and functional",
            "visual_style": "Handcrafted",
            "craftsmanship_score": 70,
            "uniqueness_score": 65,
            "analysis_confidence": 40,
            "market_positioning": "Mid-range",
        },

        "market_insight": {
            "target_customer": "Customers interested in handmade artisan products",
            "product_category": category,
            "buying_motivation": "Interest in handcrafted products",
            "strongest_selling_point": f"Handcrafted {category.lower()}",
            "recommended_positioning": "Authentic handmade product",
            "content_angle": f"Focus on the handcrafted nature and use of {material.lower()}",
        },

        "pricing": {
            "budget_price": 1200,
            "recommended_price": 2000,
            "premium_price": 2800,
            "price_confidence": 35,
            "pricing_reason": (
                f"Fallback estimate based on the provided category and material: "
                f"{category} made with {material}."
            ),
        },

        "listing": {
            "title": product_name,

            "description": (
                f"This handcrafted {category.lower()} is created using "
                f"{material.lower()}. Inspired by {story}, it reflects "
                f"traditional artisan craftsmanship and is designed for "
                f"customers who appreciate handmade products."
            ),

            "product_highlights": [
                f"Handcrafted {category.lower()}",
                f"Made using {material.lower()}",
                "Created with traditional artisan craftsmanship",
            ],

            "seo_keywords": [
                "handmade",
                "artisan",
                category.lower(),
                material.lower(),
                "handmade decor",
                "Indian handicraft",
                "artisan product",
                "traditional craft",
            ],
        },

        "social_media": {
            "instagram_caption": (
                f"Discover this handcrafted {product_name.lower()}, "
                f"created with care using {material.lower()}. "
                f"Explore authentic artisan craftsmanship."
            ),

            "facebook_caption": (
                f"Introducing our handcrafted {product_name.lower()}, "
                f"created using {material.lower()} and inspired by "
                f"{story}. A thoughtful choice for anyone who appreciates "
                f"authentic artisan products."
            ),

            "hashtags": [
                "#Handmade",
                "#IndianCraft",
                "#Artisan",
                "#Handcrafted",
                "#IndianHandicraft",
                "#SupportArtisans",
                "#Craftsmanship",
                "#MadeInIndia",
            ],
        },
    }


def _clean_json(text):
    """
    Remove Markdown code fences and surrounding whitespace
    from Gemini's response.
    """

    if not text:
        return "{}"

    text = text.strip()

    # Remove ```json ... ```
    text = re.sub(r"^```json\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    return text.strip()


def _parse_json(text):
    """
    Safely parse Gemini's JSON response.

    First attempts to parse the complete response.
    If Gemini accidentally adds surrounding text, extracts
    the JSON object.
    """

    cleaned = _clean_json(text)

    try:
        return json.loads(cleaned)

    except json.JSONDecodeError:
        # Try extracting the first JSON object
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)

        if match:
            return json.loads(match.group())

        raise ValueError("Gemini returned invalid JSON")


def _normalise_result(parsed, product_name=""):
    """
    Ensure Gemini's response always follows the expected structure.

    This prevents a malformed or partially completed Gemini response
    from breaking the frontend.
    """

    product_analysis = parsed.get("product_analysis") or {}
    market_insight = parsed.get("market_insight") or {}
    pricing = parsed.get("pricing") or {}
    listing = parsed.get("listing") or {}
    social_media = parsed.get("social_media") or {}

    return {
        "product_analysis": {
            "product_type": product_analysis.get("product_type", ""),
            "craft_style": product_analysis.get("craft_style", ""),
            "materials": product_analysis.get("materials", []),
            "primary_colors": product_analysis.get("primary_colors", []),
            "secondary_colors": product_analysis.get("secondary_colors", []),
            "patterns_and_motifs": product_analysis.get(
                "patterns_and_motifs",
                [],
            ),
            "visible_techniques": product_analysis.get(
                "visible_techniques",
                [],
            ),
            "purpose": product_analysis.get("purpose", ""),
            "visual_style": product_analysis.get("visual_style", ""),
            "craftsmanship_score": product_analysis.get(
                "craftsmanship_score",
                0,
            ),
            "uniqueness_score": product_analysis.get(
                "uniqueness_score",
                0,
            ),
            "analysis_confidence": product_analysis.get(
                "analysis_confidence",
                0,
            ),
            "market_positioning": product_analysis.get(
                "market_positioning",
                "",
            ),
        },

        "market_insight": {
            "target_customer": market_insight.get(
                "target_customer",
                "",
            ),
            "product_category": market_insight.get(
                "product_category",
                "",
            ),
            "buying_motivation": market_insight.get(
                "buying_motivation",
                "",
            ),
            "strongest_selling_point": market_insight.get(
                "strongest_selling_point",
                "",
            ),
            "recommended_positioning": market_insight.get(
                "recommended_positioning",
                "",
            ),
            "content_angle": market_insight.get(
                "content_angle",
                "",
            ),
        },

        "pricing": {
            "budget_price": pricing.get("budget_price", 0),
            "recommended_price": pricing.get("recommended_price", 0),
            "premium_price": pricing.get("premium_price", 0),
            "price_confidence": pricing.get("price_confidence", 0),
            "pricing_reason": pricing.get("pricing_reason", ""),
        },

        "listing": {
            "title": listing.get(
                "title",
                product_name or "Handcrafted Product",
            ),
            "description": listing.get(
                "description",
                "",
            ),
            "product_highlights": listing.get(
                "product_highlights",
                [],
            ),
            "seo_keywords": listing.get(
                "seo_keywords",
                [],
            ),
        },

        "social_media": {
            "instagram_caption": social_media.get(
                "instagram_caption",
                "",
            ),
            "facebook_caption": social_media.get(
                "facebook_caption",
                "",
            ),
            "hashtags": social_media.get(
                "hashtags",
                [],
            ),
        },
    }


def generate_listing(
    product_name="",
    category="",
    material="",
    dimensions="",
    story="",
    notes="",
    image_bytes=None,
    image_content_type=None,
):
    from prompts import build_listing_prompt

    prompt = build_listing_prompt(
        product_name,
        category,
        material,
        dimensions,
        story,
        notes,
    )

    # --------------------------------------------------
    # Gemini unavailable
    # --------------------------------------------------

    if client is None:
        print("Gemini client not initialized. Using fallback.")

        return _fallback_listing(
            product_name,
            category,
            material,
            dimensions,
            story,
            notes,
        )

    try:

        contents = []

        # --------------------------------------------------
        # IMAGE
        # --------------------------------------------------

        if image_bytes and image_content_type:
            contents.append(
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=image_content_type,
                )
            )

        # --------------------------------------------------
        # PROMPT
        # --------------------------------------------------

        contents.append(prompt)

        # --------------------------------------------------
        # GEMINI REQUEST
        # --------------------------------------------------

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=contents,
        )

        response_text = response.text or ""

        # --------------------------------------------------
        # PARSE RESPONSE
        # --------------------------------------------------

        parsed = _parse_json(response_text)

        # --------------------------------------------------
        # NORMALISE RESPONSE
        # --------------------------------------------------

        return _normalise_result(
            parsed,
            product_name,
        )

    except Exception as e:

        import traceback

        print("Gemini generation failed:")
        traceback.print_exc()

        # IMPORTANT:
        # For a hackathon demo, graceful fallback is much better
        # than returning an error and leaving the user with
        # a broken Product Studio.

        return _fallback_listing(
            product_name,
            category,
            material,
            dimensions,
            story,
            notes,
        )