from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from photo_processor import AIPhotoProcessor
import io
import logging
from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Photo Reviver API - Alqudimi Technology")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor = AIPhotoProcessor()

@app.get("/")
async def root():
    return {
        "message": "Smart Photo Reviver API - Alqudimi Technology", 
        "status": "running",
        "technology": "Alqudimi",
        "models": {
            "super_resolution": "SwinIR",
            "face_enhancement": "CodeFormer",
            "colorization": "DDColor",
            "instruction_control": "InstructIR"
        }
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "technology": "Alqudimi", "ai_enabled": processor.api_key is not None}

@app.post("/api/restore")
async def restore_photo(
    file: UploadFile = File(...),
    instruction: Optional[str] = Form(None),
    enable_super_resolution: bool = Form(True),
    enable_face_enhancement: bool = Form(True),
    enable_colorization: bool = Form(True),
    enable_inpainting: bool = Form(True),
    sr_scale: int = Form(2),
    face_fidelity: float = Form(0.5)
):
    """
    Alqudimi Technology photo restoration with multiple models:
    - SwinIR: Super-resolution (2x, 3x, 4x upscaling)
    - CodeFormer: Face enhancement
    - DDColor: Photo-realistic colorization
    - InstructIR: Text-based instruction control
    - Basic inpainting: Damage and scratch removal
    
    Args:
        file: Image file to restore
        instruction: Optional natural language instruction (e.g., "Remove noise and enhance details")
        enable_super_resolution: Apply SwinIR super-resolution
        enable_face_enhancement: Apply CodeFormer face enhancement
        enable_colorization: Apply DDColor colorization (for B&W photos)
        enable_inpainting: Apply basic inpainting for damage removal
        sr_scale: Super-resolution scale (2, 3, or 4)
        face_fidelity: CodeFormer fidelity (0-1, lower = more enhancement, 0.5 recommended)
    """
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        
        max_size = 10 * 1024 * 1024
        if len(contents) > max_size:
            raise HTTPException(status_code=400, detail="File size must be less than 10MB")
        
        logger.info(f"Processing image: {file.filename}, size: {len(contents)} bytes")
        logger.info(f"Options: SR={enable_super_resolution}(x{sr_scale}), Face={enable_face_enhancement}, Color={enable_colorization}, Inpaint={enable_inpainting}")
        if instruction:
            logger.info(f"Instruction: {instruction}")
        
        processed_image_bytes = processor.process_image(
            contents,
            enable_super_resolution=enable_super_resolution,
            enable_face_enhancement=enable_face_enhancement,
            enable_colorization=enable_colorization,
            enable_inpainting=enable_inpainting,
            instruction=instruction,
            sr_scale=min(max(sr_scale, 2), 4),
            face_fidelity=max(0.0, min(1.0, face_fidelity))
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
    step: str = Form("all"),
    instruction: Optional[str] = Form(None)
):
    """
    Restore photo with specific processing step
    Options: super_resolution, face_enhancement, colorization, inpainting, instruction, all
    """
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        
        enable_sr = step in ["super_resolution", "all"]
        enable_face = step in ["face_enhancement", "all"]
        enable_color = step in ["colorization", "all"]
        enable_inpaint = step in ["inpainting", "all"]
        
        use_instruction = instruction if step in ["instruction", "all"] else None
        
        processed_image_bytes = processor.process_image(
            contents,
            enable_super_resolution=enable_sr,
            enable_face_enhancement=enable_face,
            enable_colorization=enable_color,
            enable_inpainting=enable_inpaint,
            instruction=use_instruction
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

@app.post("/api/super-resolution")
async def apply_super_resolution(
    file: UploadFile = File(...),
    scale: int = Form(4)
):
    """Apply SwinIR super-resolution only"""
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        
        from PIL import Image
        import numpy as np
        
        image = Image.open(io.BytesIO(contents))
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        img_array = np.array(image)
        
        result_array = processor.super_resolution(img_array, scale=min(max(scale, 2), 4))
        
        result_image = Image.fromarray(result_array)
        output_buffer = io.BytesIO()
        result_image.save(output_buffer, format='JPEG', quality=95)
        output_buffer.seek(0)
        
        return StreamingResponse(
            output_buffer,
            media_type="image/jpeg",
            headers={
                "Content-Disposition": f"attachment; filename=sr_{file.filename}"
            }
        )
    
    except Exception as e:
        logger.error(f"Error in super-resolution: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/api/colorize")
async def apply_colorization(
    file: UploadFile = File(...)
):
    """Apply DDColor colorization only"""
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        
        from PIL import Image
        import numpy as np
        
        image = Image.open(io.BytesIO(contents))
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        img_array = np.array(image)
        
        result_array = processor.colorize_photo(img_array)
        
        result_image = Image.fromarray(result_array)
        output_buffer = io.BytesIO()
        result_image.save(output_buffer, format='JPEG', quality=95)
        output_buffer.seek(0)
        
        return StreamingResponse(
            output_buffer,
            media_type="image/jpeg",
            headers={
                "Content-Disposition": f"attachment; filename=colorized_{file.filename}"
            }
        )
    
    except Exception as e:
        logger.error(f"Error in colorization: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/api/face-enhance")
async def apply_face_enhancement(
    file: UploadFile = File(...),
    fidelity: float = Form(0.5)
):
    """Apply CodeFormer face enhancement only"""
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        
        from PIL import Image
        import numpy as np
        
        image = Image.open(io.BytesIO(contents))
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        img_array = np.array(image)
        
        result_array = processor.face_enhancement(img_array, fidelity=max(0.0, min(1.0, fidelity)))
        
        result_image = Image.fromarray(result_array)
        output_buffer = io.BytesIO()
        result_image.save(output_buffer, format='JPEG', quality=95)
        output_buffer.seek(0)
        
        return StreamingResponse(
            output_buffer,
            media_type="image/jpeg",
            headers={
                "Content-Disposition": f"attachment; filename=face_enhanced_{file.filename}"
            }
        )
    
    except Exception as e:
        logger.error(f"Error in face enhancement: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/api/instruct")
async def apply_instructional_restoration(
    file: UploadFile = File(...),
    instruction: str = Form(...)
):
    """Apply InstructIR with natural language instruction"""
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        if not instruction:
            raise HTTPException(status_code=400, detail="Instruction is required")
        
        contents = await file.read()
        
        from PIL import Image
        import numpy as np
        
        image = Image.open(io.BytesIO(contents))
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        img_array = np.array(image)
        
        result_array = processor.instruct_restore(img_array, instruction)
        
        result_image = Image.fromarray(result_array)
        output_buffer = io.BytesIO()
        result_image.save(output_buffer, format='JPEG', quality=95)
        output_buffer.seek(0)
        
        return StreamingResponse(
            output_buffer,
            media_type="image/jpeg",
            headers={
                "Content-Disposition": f"attachment; filename=instructed_{file.filename}"
            }
        )
    
    except Exception as e:
        logger.error(f"Error in instructional restoration: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
