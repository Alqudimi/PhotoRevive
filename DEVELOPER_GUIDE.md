# Alqudimi Technology Developer Guide

This guide provides comprehensive information for developers working with or contributing to the Alqudimi Technology photo restoration platform.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Setup and Installation](#setup-and-installation)
3. [Development Workflow](#development-workflow)
4. [Code Structure](#code-structure)
5. [API Integration](#api-integration)
6. [AI Models](#ai-models)
7. [Frontend Development](#frontend-development)
8. [Backend Development](#backend-development)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Contributing](#contributing)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
│                  (React + TypeScript)                        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────────┐
│              Node.js + Express Server                        │
│                   (Port 5000)                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes │ File Handling │ Response Streaming     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/FormData
┌────────────────────▼────────────────────────────────────────┐
│            Python + FastAPI Service                          │
│               (Integrated Backend)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         AIPhotoProcessor Class                        │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │  SwinIR │ CodeFormer │ DDColor │ InstructIR │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │          Replicate API Integration                    │   │
│  │          Fallback Algorithms (OpenCV)                 │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/API
┌────────────────────▼────────────────────────────────────────┐
│               Replicate API Service                          │
│           (GPU Infrastructure)                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AI Models on Professional GPU Hardware              │   │
│  │  (Nvidia T4, L40S)                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling framework
- **Wouter**: Lightweight routing
- **Radix UI**: Accessible components
- **TanStack Query**: Data fetching and caching

#### Backend
- **Node.js + Express**: Web server and API
- **Python 3.11**: AI processing engine
- **FastAPI**: Python API framework
- **Replicate API**: AI model hosting
- **OpenCV**: Image processing fallbacks
- **NumPy**: Numerical operations
- **Pillow**: Image manipulation

---

## Setup and Installation

### Prerequisites

```bash
# Check versions
node --version  # Should be 20+
python3 --version  # Should be 3.11+
```

### Initial Setup

1. **Clone the repository**
```bash
git clone https://github.com/Alqudimi/PhotoRevive.git
cd PhotoRevive
```

2. **Install Node.js dependencies**
```bash
npm install
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
# OR using the Replit package manager
```

4. **Configure environment variables**

Create a `.env` file or add to Replit Secrets:
```bash
REPLICATE_API_TOKEN=your_replicate_api_key_here
NODE_ENV=development
```

5. **Start development server**
```bash
npm run dev
```

The server will start on http://localhost:5000

---

## Development Workflow

### File Structure

```
project/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── Hero.tsx
│   │   │   ├── UploadZone.tsx
│   │   │   ├── Features.tsx
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   └── not-found.tsx
│   │   ├── lib/             # Utility functions
│   │   ├── hooks/           # Custom React hooks
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── ...
├── server/                   # Backend services
│   ├── index.ts            # Express server
│   ├── routes.ts           # API routes
│   ├── photo_api.py        # FastAPI endpoints
│   ├── photo_processor.py  # AI processing logic
│   ├── storage.ts          # Data storage interface
│   └── vite.ts            # Vite integration
├── shared/                  # Shared types/schemas
│   └── schema.ts
├── attached_assets/        # Static assets
├── ALQUDIMI_TECHNOLOGY.md  # Technology docs
├── API_DOCUMENTATION.md    # API reference
├── USER_GUIDE.md          # User guide
├── DEVELOPER_GUIDE.md     # This file
├── replit.md              # Project overview
├── package.json
├── pyproject.toml
├── vite.config.ts
└── tailwind.config.ts
```

### Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Start production server
npm start

# Database migrations
npm run db:push
```

### Code Style

#### TypeScript/React
- Use functional components with hooks
- Prefer TypeScript interfaces over types
- Use descriptive variable names
- Add data-testid attributes to interactive elements

```typescript
// Good
interface UploadZoneProps {
  onFileSelect: (file: File, options: ProcessingOptions) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  // Component logic
}

// Add test IDs
<button data-testid="button-upload">Upload</button>
```

#### Python
- Follow PEP 8 style guide
- Use type hints
- Document functions with docstrings
- Handle errors gracefully

```python
def super_resolution(self, image: np.ndarray, scale: int = 4) -> np.ndarray:
    """
    Enhance image quality using SwinIR super-resolution
    
    Args:
        image: Input image as numpy array
        scale: Upscaling factor (2, 3, 4, or 8)
    
    Returns:
        Enhanced image as numpy array
    """
    # Function implementation
```

---

## Code Structure

### Frontend Components

#### Component Organization

```
components/
├── ui/                    # Reusable UI primitives
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── Hero.tsx              # Landing hero section
├── UploadZone.tsx        # File upload interface
├── ProcessingOverlay.tsx # Processing status
├── ComparisonSlider.tsx  # Before/after comparison
├── Features.tsx          # Feature showcase
└── ...
```

#### Creating New Components

1. Create component file in appropriate directory
2. Export as named export
3. Add TypeScript interface for props
4. Include data-testid attributes
5. Import and use in parent component

Example:
```typescript
// components/MyComponent.tsx
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction} data-testid="button-action">
        Click Me
      </button>
    </div>
  );
}
```

### Backend Structure

#### Photo Processor Class

The `AIPhotoProcessor` class is the core of Alqudimi Technology:

```python
class AIPhotoProcessor:
    def __init__(self, api_key: Optional[str] = None)
    def super_resolution(self, image: np.ndarray, scale: int = 4) -> np.ndarray
    def face_enhancement(self, image: np.ndarray, fidelity: float = 0.5) -> np.ndarray
    def colorize_photo(self, image: np.ndarray) -> np.ndarray
    def instruct_restore(self, image: np.ndarray, instruction: str) -> np.ndarray
    def process_image(self, image_bytes: bytes, **options) -> bytes
```

#### Adding New Processing Features

1. Add method to `AIPhotoProcessor` class
2. Integrate with Replicate API or use OpenCV
3. Add fallback algorithm
4. Create API endpoint in `photo_api.py`
5. Update frontend to use new feature

Example:
```python
def new_feature(self, image: np.ndarray, param: float) -> np.ndarray:
    """New processing feature"""
    if not self.api_key:
        return self._fallback_new_feature(image, param)
    
    try:
        # Replicate API integration
        result = replicate.run(model_id, input={...})
        return self._download_image_from_url(result)
    except Exception as e:
        logger.error(f"Feature failed: {e}")
        return self._fallback_new_feature(image, param)
```

---

## API Integration

### Adding New Endpoints

1. **Define endpoint in `photo_api.py`**:

```python
@app.post("/api/new-feature")
async def apply_new_feature(
    file: UploadFile = File(...),
    parameter: float = Form(1.0)
):
    """Apply new processing feature"""
    # Validation
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Processing
    contents = await file.read()
    result = processor.new_feature(
        Image.open(io.BytesIO(contents)),
        parameter
    )
    
    # Response
    return StreamingResponse(
        io.BytesIO(result),
        media_type="image/jpeg"
    )
```

2. **Update frontend to call endpoint**:

```typescript
async function applyNewFeature(file: File, parameter: number) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('parameter', String(parameter));
  
  const response = await fetch('/api/new-feature', {
    method: 'POST',
    body: formData
  });
  
  return await response.blob();
}
```

---

## AI Models

### Replicate Integration

All AI models run via Replicate API:

```python
# Model versions
model_versions = {
    'swinir': 'jingyunliang/swinir',
    'codeformer': 'sczhou/codeformer',
    'ddcolor': 'piddnad/ddcolor',
    'instructir': 'mv-lab/instructir'
}

# Making API calls
output = replicate.run(
    model_versions['swinir'],
    input={
        "image": data_uri,
        "task": "real_sr",
        "scale": 4
    }
)
```

### Adding New AI Models

1. Research model availability on Replicate
2. Add model to `model_versions` dictionary
3. Create processing method
4. Add fallback algorithm
5. Document usage in code
6. Update frontend options

### Fallback Algorithms

Always implement OpenCV-based fallbacks:

```python
def _fallback_super_resolution(self, image: np.ndarray, scale: int) -> np.ndarray:
    """Fallback when API unavailable"""
    height, width = image.shape[:2]
    new_size = (width * scale, height * scale)
    return cv2.resize(image, new_size, interpolation=cv2.INTER_CUBIC)
```

---

## Frontend Development

### State Management

Use React hooks and TanStack Query:

```typescript
// Local state
const [appState, setAppState] = useState<AppState>("landing");

// Server state
const { data, isLoading } = useQuery({
  queryKey: ['/api/health'],
  // queryFn handled automatically
});
```

### Form Handling

Use react-hook-form with Zod validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  instruction: z.string().optional(),
  scale: z.number().min(2).max(4)
});

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    instruction: "",
    scale: 2
  }
});
```

### Styling

Use Tailwind CSS with dark mode support:

```typescript
<div className="bg-white dark:bg-black text-black dark:text-white">
  Content
</div>
```

---

## Backend Development

### API Route Organization

Keep routes thin, logic in processor:

```python
# Good - thin route
@app.post("/api/restore")
async def restore_photo(file: UploadFile = File(...)):
    contents = await file.read()
    result = processor.process_image(contents)
    return StreamingResponse(io.BytesIO(result))

# Bad - thick route with logic
@app.post("/api/restore")
async def restore_photo(file: UploadFile = File(...)):
    # Lots of processing logic here...
```

### Error Handling

Provide clear error messages:

```python
try:
    result = processor.process_image(contents)
except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))
except Exception as e:
    logger.error(f"Processing failed: {e}")
    raise HTTPException(status_code=500, detail="Processing failed")
```

---

## Testing

### Manual Testing Checklist

- [ ] Upload various image formats (JPG, PNG)
- [ ] Test all processing options
- [ ] Verify natural language instructions work
- [ ] Check before/after comparison
- [ ] Test download functionality
- [ ] Verify error handling
- [ ] Test on different browsers
- [ ] Check mobile responsiveness

### API Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Basic restoration
curl -X POST http://localhost:5000/api/restore \
  -F "file=@test.jpg" \
  --output result.jpg
```

---

## Deployment

### Environment Variables

Required for production:
- `REPLICATE_API_TOKEN`: Your Replicate API key
- `NODE_ENV=production`

### Build Process

```bash
# Build frontend and backend
npm run build

# Start production server
npm start
```

### Performance Optimization

1. Enable caching for static assets
2. Use CDN for image delivery
3. Implement request queuing
4. Monitor API usage
5. Set up error tracking

---

## Contributing

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request with description

### Code Review Guidelines

- Follow existing code style
- Add appropriate documentation
- Include test cases
- Update relevant docs

### Commit Messages

Follow conventional commits:
```
feat: add new colorization option
fix: resolve upload timeout issue
docs: update API documentation
refactor: simplify processing pipeline
```

---

## Additional Resources

### Documentation
- [ALQUDIMI_TECHNOLOGY.md](./ALQUDIMI_TECHNOLOGY.md) - Technology overview
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [USER_GUIDE.md](./USER_GUIDE.md) - End-user guide

### External Resources
- [SwinIR Paper](https://arxiv.org/abs/2108.10257)
- [CodeFormer Paper](https://arxiv.org/abs/2206.11253)
- [DDColor Paper](https://arxiv.org/abs/2212.11613)
- [InstructIR Paper](https://arxiv.org/abs/2401.16468)


---

## Support

For development questions:
1. Check existing documentation
2. Review code comments
3. Search GitHub issues
4. Ask in development channels

---

**Happy coding with Alqudimi Technology!**
