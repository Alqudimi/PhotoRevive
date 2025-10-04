from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from photo_processor import PhotoProcessor
import io
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Photo Reviver API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor = PhotoProcessor()

@app.get("/")
async def root():
    return {"message": "Smart Photo Reviver API", "status": "running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/restore")
async def restore_photo(file: UploadFile = File(...)):
    """
    Restore, colorize, and enhance a photo
    """
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        
        max_size = 10 * 1024 * 1024
        if len(contents) > max_size:
            raise HTTPException(status_code=400, detail="File size must be less than 10MB")
        
        logger.info(f"Processing image: {file.filename}, size: {len(contents)} bytes")
        
        processed_image_bytes = processor.process_image(
            contents,
            enable_restoration=True,
            enable_colorization=True,
            enable_enhancement=True
        )
        
        logger.info("Image processing completed successfully")
        
        return StreamingResponse(
            io.BytesIO(processed_image_bytes),
            media_type="image/jpeg",
            headers={
                "Content-Disposition": f"attachment; filename=restored_{file.filename}"
            }
        )
    
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/api/restore-step")
async def restore_photo_with_steps(
    file: UploadFile = File(...),
    step: str = "all"
):
    """
    Restore photo with specific processing step
    Options: restoration, colorization, enhancement, all
    """
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        
        enable_restoration = step in ["restoration", "all"]
        enable_colorization = step in ["colorization", "all"]
        enable_enhancement = step in ["enhancement", "all"]
        
        processed_image_bytes = processor.process_image(
            contents,
            enable_restoration=enable_restoration,
            enable_colorization=enable_colorization,
            enable_enhancement=enable_enhancement
        )
        
        return StreamingResponse(
            io.BytesIO(processed_image_bytes),
            media_type="image/jpeg",
            headers={
                "Content-Disposition": f"attachment; filename=restored_{file.filename}"
            }
        )
    
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
