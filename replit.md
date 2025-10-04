# Smart Old Photo Reviver

An AI-powered web application that automatically restores, colorizes, and enhances old or damaged photos using deep learning.

## Overview

This application brings old photos back to life by:
- **Restoring damage**: Removes scratches, noise, and fading using advanced denoising and inpainting
- **Adding color**: Transforms black-and-white photos with realistic, natural-looking colors
- **Enhancing quality**: Upscales resolution and improves sharpness using super-resolution techniques

## Architecture

### Frontend (React + TypeScript)
- Modern, responsive UI built with React and Tailwind CSS
- Interactive before/after comparison slider
- Drag-and-drop photo upload interface
- Real-time processing status with progress indicators
- Dark mode support

**Key Components:**
- `Hero`: Landing page hero section with example showcase
- `UploadZone`: Drag-and-drop file upload interface
- `ProcessingOverlay`: Processing status with stage indicators
- `ComparisonSlider`: Interactive before/after photo comparison
- `Features`: AI capabilities showcase
- `ExamplesGallery`: Gallery of restoration examples

### Backend (Node.js + Express + Python + FastAPI)

**Node.js/Express Layer (Port 5000):**
- Serves the frontend application
- Acts as a proxy to the Python AI service
- Handles file uploads and API routing

**Python/FastAPI Layer (Port 8000):**
- AI-powered image processing
- Uses OpenCV, scikit-image, and NumPy
- Implements three main processing stages:
  1. **Restoration**: Denoising and inpainting to remove damage
  2. **Colorization**: LAB color space manipulation for natural colors
  3. **Enhancement**: CLAHE and sharpening for quality improvement

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── App.tsx      # Main app component
├── server/              # Backend services
│   ├── index.ts         # Node.js/Express server
│   ├── routes.ts        # API routes and proxy
│   ├── photo_api.py     # FastAPI image processing service
│   └── photo_processor.py # AI image processing algorithms
└── attached_assets/     # Generated example images
```

## Running the Application

### Prerequisites
- Node.js 20
- Python 3.11
- Dependencies installed via Replit package manager

### Starting the Application

**IMPORTANT:** This application requires TWO servers to run simultaneously:

**Step 1: Start the Node.js/Express Server (Frontend + API Proxy)**
- The Node.js server starts automatically via the "Start application" workflow on port 5000
- If not running, click "Run" or execute: `npm run dev`

**Step 2: Start the Python FastAPI Server (AI Processing)**
- Open a new shell/terminal
- Run the following command:
  ```bash
  cd server && python3 -m uvicorn photo_api:app --host 0.0.0.0 --port 8000
  ```
- Keep this terminal open while using the application
- You should see: "Uvicorn running on http://0.0.0.0:8000"

### Verifying the Services

Check if both servers are running:
```bash
# Check Node.js server (should return: {"status":"healthy"})
curl http://localhost:5000/api/health

# Check Python API server (should return: {"status":"healthy"})
curl http://localhost:8000/api/health
```

**Troubleshooting:**
- If photo uploads fail with "AI service unavailable", ensure the Python API server is running
- If you see connection errors, verify both servers are running on their correct ports
- Check logs: Node.js logs appear in the main workflow, Python logs appear in the terminal where you started uvicorn

## API Endpoints

### POST /api/restore
Processes an uploaded photo through all restoration stages.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (image file, max 10MB)

**Response:**
- Content-Type: image/jpeg
- Body: Processed image data

**Processing Steps:**
1. Noise removal and denoising
2. Scratch detection and inpainting
3. Color restoration (for B&W photos)
4. Resolution enhancement and sharpening

## Technical Details

### Image Processing Pipeline

1. **Input Preprocessing**
   - Format conversion to RGB
   - Color space validation

2. **Restoration Stage**
   - Non-local means denoising
   - Morphological operations for scratch detection
   - Telea inpainting algorithm

3. **Colorization Stage**
   - LAB color space transformation
   - Adaptive color channel generation
   - Sepia tone blending for vintage aesthetics

4. **Enhancement Stage**
   - Cubic interpolation upscaling
   - CLAHE (Contrast Limited Adaptive Histogram Equalization)
   - Unsharp masking for sharpness

### Technologies Used

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Wouter (routing)
- Radix UI (components)

**Backend:**
- Node.js + Express
- Python + FastAPI
- OpenCV (cv2)
- scikit-image
- NumPy
- Pillow (PIL)

## Development

### Adding New Processing Features

To add a new image processing feature:

1. Add the processing function to `server/photo_processor.py`:
```python
def new_feature(self, image: np.ndarray) -> np.ndarray:
    # Your processing logic here
    return processed_image
```

2. Update the `process_image` method to include your feature:
```python
if enable_new_feature:
    img_array = self.new_feature(img_array)
```

3. Add a new API endpoint in `server/photo_api.py` if needed

### Customizing the UI

Key files for UI customization:
- `client/src/index.css`: Color scheme and theme variables
- `design_guidelines.md`: Design system documentation
- `client/src/components/`: Individual UI components

## Performance Considerations

- Maximum upload size: 10MB
- Processing time varies by image size (typically 3-10 seconds)
- Images are processed sequentially for reliability
- Memory-efficient streaming responses

## Future Enhancements

Potential features to add:
- Batch processing for multiple photos
- Restoration style selection (soft, vivid, realistic)
- Advanced colorization with deep learning models
- User accounts and photo gallery
- Export options (different resolutions and formats)
- Background job processing with Redis/Celery

## License

MIT
